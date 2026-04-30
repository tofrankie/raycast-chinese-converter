import Nzh from "nzh";

export type RoundingMode = "round" | "truncate";

export type MoneyOptions = {
  unOmitYuan: boolean;
  forceZheng: boolean;
};

export type ConvertResult =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "ok"; value: string; normalizedInput: string };

export function createNzh(moneyPrefix: string) {
  return new Nzh({
    ch: "零壹贰叁肆伍陆柒捌玖",
    ch_u: "个十百千万亿兆京",
    ch_f: "负",
    ch_d: "点",
    m_u: "元角分厘毫丝",
    m_t: moneyPrefix,
    m_z: "整",
  });
}

export function parseDecimalPlaces(input?: string) {
  const parsed = Number.parseInt(input ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 5) {
    return 2;
  }
  return parsed;
}

export function parseRoundingMode(input?: string): RoundingMode {
  if (input === "truncate") {
    return "truncate";
  }
  return "round";
}

export function parseMoneyPrefix(input?: string) {
  return (input ?? "").trim();
}

export function parseBooleanPreference(input: unknown, fallback: boolean) {
  if (typeof input === "boolean") {
    return input;
  }

  if (input === "true") {
    return true;
  }

  if (input === "false") {
    return false;
  }

  return fallback;
}

export function buildResultSubtitle(input: string, status: "ok" | "idle" | "error", normalizedInput?: string) {
  if (!input) {
    return "Enter a value to convert";
  }

  if (status === "error") {
    return "Invalid number or unsupported input";
  }

  if (!normalizedInput) {
    return "Press Enter to copy";
  }

  return normalizedInput !== input ? normalizedInput : undefined;
}

export function convertInputToRmb(
  rawInput: string,
  options: {
    decimalPlaces: number;
    roundingMode: RoundingMode;
    moneyOptions: MoneyOptions;
    nzh: Nzh;
  },
): ConvertResult {
  if (!rawInput) {
    return { status: "idle" };
  }

  const numeric = Number(rawInput);
  if (!Number.isFinite(numeric)) {
    return { status: "error", message: "Input cannot be parsed as a number" };
  }

  if (numeric < 0) {
    return { status: "error", message: "Negative numbers are not supported" };
  }

  const normalized = applyDecimalPolicy(numeric, options.decimalPlaces, options.roundingMode);
  const output = options.nzh.toMoney(normalized, {
    ...options.moneyOptions,
    outSymbol: true,
  });

  return { status: "ok", value: output, normalizedInput: normalized };
}

export function applyDecimalPolicy(value: number, decimalPlaces: number, roundingMode: RoundingMode) {
  const factor = 10 ** decimalPlaces;
  const fixedValue =
    roundingMode === "truncate"
      ? (Math.trunc(value * factor) / factor).toFixed(decimalPlaces)
      : (Math.round(value * factor) / factor).toFixed(decimalPlaces);

  return trimTrailingDecimalZeros(fixedValue);
}

export function trimTrailingDecimalZeros(input: string) {
  return input.replace(/(?:\.0*|(\.\d+?)0+)$/, "$1");
}
