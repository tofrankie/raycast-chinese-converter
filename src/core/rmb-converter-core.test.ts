import { describe, expect, it } from "vitest";
import {
  applyDecimalPolicy,
  buildResultSubtitle,
  convertInputToRmb,
  createNzh,
  parseBooleanPreference,
  parseDecimalPlaces,
  parseMoneyPrefix,
  parseRoundingMode,
  trimTrailingDecimalZeros,
} from "./rmb-converter-core";

describe("rmb-converter-core", () => {
  it("parseDecimalPlaces should clamp invalid input to default 2", () => {
    expect(parseDecimalPlaces(undefined)).toBe(2);
    expect(parseDecimalPlaces("")).toBe(2);
    expect(parseDecimalPlaces("-1")).toBe(2);
    expect(parseDecimalPlaces("6")).toBe(2);
  });

  it("parseDecimalPlaces should accept 0~5", () => {
    expect(parseDecimalPlaces("0")).toBe(0);
    expect(parseDecimalPlaces("5")).toBe(5);
    expect(parseDecimalPlaces("2")).toBe(2);
  });

  it("parseRoundingMode should fallback to round", () => {
    expect(parseRoundingMode("truncate")).toBe("truncate");
    expect(parseRoundingMode("round")).toBe("round");
    expect(parseRoundingMode(undefined)).toBe("round");
  });

  it("parse helpers should normalize values", () => {
    expect(parseMoneyPrefix("  人民币  ")).toBe("人民币");
    expect(parseBooleanPreference(true, false)).toBe(true);
    expect(parseBooleanPreference("true", false)).toBe(true);
    expect(parseBooleanPreference("false", true)).toBe(false);
    expect(parseBooleanPreference(undefined, true)).toBe(true);
  });

  it("trimTrailingDecimalZeros should remove trailing decimal zeros", () => {
    expect(trimTrailingDecimalZeros("1.2300")).toBe("1.23");
    expect(trimTrailingDecimalZeros("1.200")).toBe("1.2");
    expect(trimTrailingDecimalZeros("1.000")).toBe("1");
    expect(trimTrailingDecimalZeros("0.000")).toBe("0");
  });

  it("applyDecimalPolicy should support round and truncate then trim zeros", () => {
    expect(applyDecimalPolicy(1.235, 2, "round")).toBe("1.24");
    expect(applyDecimalPolicy(1.239, 2, "truncate")).toBe("1.23");
    expect(applyDecimalPolicy(1, 2, "round")).toBe("1");
  });

  it("convertInputToRmb should follow A->B->C->toMoney flow", () => {
    const nzh = createNzh("");
    const res = convertInputToRmb("1.2300", {
      decimalPlaces: 2,
      roundingMode: "round",
      moneyOptions: { unOmitYuan: false, forceZheng: true },
      nzh,
    });

    expect(res.status).toBe("ok");
    if (res.status === "ok") {
      expect(res.normalizedInput).toBe("1.23");
      expect(res.value).toBe("壹元贰角叁分");
    }
  });

  it("convertInputToRmb should reject invalid and negative input", () => {
    const nzh = createNzh("");

    expect(
      convertInputToRmb("", {
        decimalPlaces: 2,
        roundingMode: "round",
        moneyOptions: { unOmitYuan: false, forceZheng: true },
        nzh,
      }),
    ).toEqual({ status: "idle" });

    expect(
      convertInputToRmb("abc", {
        decimalPlaces: 2,
        roundingMode: "round",
        moneyOptions: { unOmitYuan: false, forceZheng: true },
        nzh,
      }),
    ).toEqual({ status: "error", message: "Input cannot be parsed as a number" });

    expect(
      convertInputToRmb("-1", {
        decimalPlaces: 2,
        roundingMode: "round",
        moneyOptions: { unOmitYuan: false, forceZheng: true },
        nzh,
      }),
    ).toEqual({ status: "error", message: "Negative numbers are not supported" });
  });

  it("convertInputToRmb should apply moneyPrefix via m_t", () => {
    const nzh = createNzh("人民币");
    const res = convertInputToRmb("0.32", {
      decimalPlaces: 2,
      roundingMode: "round",
      moneyOptions: { unOmitYuan: true, forceZheng: true },
      nzh,
    });

    expect(res.status).toBe("ok");
    if (res.status === "ok") {
      expect(res.value.startsWith("人民币")).toBe(true);
    }
  });

  it("buildResultSubtitle should only show normalized value when C !== A", () => {
    expect(buildResultSubtitle("", "idle")).toBe("Enter a value to convert");
    expect(buildResultSubtitle("abc", "error")).toBe("Invalid number or unsupported input");
    expect(buildResultSubtitle("1.2300", "ok", "1.23")).toBe("1.23");
    expect(buildResultSubtitle("1.23", "ok", "1.23")).toBeUndefined();
  });
});
