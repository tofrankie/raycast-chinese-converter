import { useMemo, useState } from "react";
import Nzh from "nzh";
import { Action, ActionPanel, getPreferenceValues, Icon, List, open } from "@raycast/api";
import { showFailureToast } from "@raycast/utils";
import {
  buildResultSubtitle,
  convertInputToRmb,
  createNzh,
  parseBooleanPreference,
  parseDecimalPlaces,
  parseMoneyPrefix,
  parseRoundingMode,
  type MoneyOptions,
  type RoundingMode,
} from "./core/rmb-converter-core";

type CommandPreferences = {
  decimalPlaces?: string;
  roundingMode?: RoundingMode;
  unOmitYuan?: boolean;
  forceZheng?: boolean;
  moneyPrefix?: string;
};

export default function ConvertToRmb() {
  const preferences = getPreferenceValues<CommandPreferences>();
  const [searchText, setSearchText] = useState("");

  const decimalPlaces = parseDecimalPlaces(preferences.decimalPlaces);
  const roundingMode = parseRoundingMode(preferences.roundingMode);
  const moneyPrefix = parseMoneyPrefix(preferences.moneyPrefix);
  const moneyOptions: MoneyOptions = {
    unOmitYuan: parseBooleanPreference(preferences.unOmitYuan, false),
    forceZheng: parseBooleanPreference(preferences.forceZheng, true),
  };

  const nzh = useMemo(() => createNzh(moneyPrefix), [moneyPrefix]);
  const trimmedInput = searchText.trim();

  const parsed = useMemo(() => {
    return convertInputToRmb(trimmedInput, { decimalPlaces, roundingMode, moneyOptions, nzh: nzh as Nzh });
  }, [trimmedInput, decimalPlaces, roundingMode, moneyOptions.unOmitYuan, moneyOptions.forceZheng, nzh]);

  const resultTitle = parsed.status === "ok" ? parsed.value : "No result";

  return (
    <List searchBarPlaceholder="Enter a number, e.g. 1000" onSearchTextChange={setSearchText} throttle>
      <List.Section title="Result">
        <List.Item
          title={resultTitle}
          subtitle={buildResultSubtitle(
            trimmedInput,
            parsed.status,
            parsed.status === "ok" ? parsed.normalizedInput : undefined,
          )}
          icon={parsed.status === "ok" ? Icon.BankNote : Icon.ExclamationMark}
          actions={
            <ActionPanel>
              {parsed.status === "ok" ? (
                <Action.CopyToClipboard title="Copy Result" content={parsed.value} />
              ) : (
                <Action
                  title="Copy Result"
                  icon={Icon.Clipboard}
                  onAction={async () => {
                    await showFailureToast("Please enter a valid number.", { title: "Invalid Input" });
                  }}
                />
              )}
              <Action.OpenInBrowser
                title="Report an Issue"
                url="https://github.com/tofrankie/raycast-chinese-converter/issues"
              />
              <Action
                title="Contact Author"
                icon={Icon.Envelope}
                onAction={() => open("mailto:1426203851@qq.com?subject=RMB%20Converter%20Feedback")}
              />
            </ActionPanel>
          }
        />
      </List.Section>

      <List.Section title="Feedback">
        <List.Item
          title="If conversion looks wrong or you need another feature, report an issue or contact the author."
          icon={Icon.Info}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser
                title="Open Issues Page"
                url="https://github.com/tofrankie/raycast-chinese-converter/issues"
              />
              <Action
                title="Send Email"
                icon={Icon.Envelope}
                onAction={() => open("mailto:1426203851@qq.com?subject=RMB%20Converter%20Feedback")}
              />
            </ActionPanel>
          }
        />
      </List.Section>
    </List>
  );
}
