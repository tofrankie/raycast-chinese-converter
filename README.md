# Chinese Converter

Convert number input into Chinese formatted text in Raycast, including uppercase RMB amount conversion.

## What It Does

- Converts positive numbers (`0`, integers, decimals) to uppercase Chinese RMB text
- Supports decimal handling policy (`round` or `truncate`)
- Supports custom output behavior for `元` and `整`

## Examples

### Default Settings

Default settings:

- `decimalPlaces = 2`
- `roundingMode = round`
- `unOmitYuan = false`
- `forceZheng = true`
- `moneyPrefix = ''`

### `round` vs `truncate`

With `decimalPlaces = 2`:

| Input A | `round` -> C | `truncate` -> C |
| ------- | ------------ | --------------- |
| `1.235` | `1.24`       | `1.23`          |
| `1.239` | `1.24`       | `1.23`          |

### `unOmitYuan` Difference

| Input A | `unOmitYuan = false` | `unOmitYuan = true` |
| ------- | -------------------- | ------------------- |
| `0.32`  | `叁角贰分`           | `零元叁角贰分`      |

### `moneyPrefix` Difference

| Input A | `moneyPrefix = ''` | `moneyPrefix = '人民币'` |
| ------- | ------------------ | ------------------------ |
| `0.32`  | `叁角贰分`         | `人民币叁角贰分`         |

## Preferences

### Decimal Places

- Controls how many digits are kept after the decimal point before conversion
- Example: for `1.2345` with `2` digits, keep `1.23` before conversion

### Extra Decimal Handling

- Controls how extra decimal digits are handled
- `Round`: for `1.235` with `2` digits, use `1.24`
- `Truncate`: for `1.235` with `2` digits, use `1.23`

### Always Show Yuan (元)

- For number input like `0.32`, show `零元叁角贰分` instead of `叁角贰分`

### Append 整 Automatically

- For number input like `1`, show `壹元整` instead of `壹元`

### Custom Prefix Text

- Adds custom text before the converted amount
- For number input like `0.32` with prefix `人民币`, show `人民币零元叁角贰分` instead of `零元叁角贰分`

## Input Rules

- Supported: `0`, positive integers, positive decimals
- Not supported: negative numbers
- Invalid input shows a failure toast: `Please enter a valid number.`

## Notes on Output Style

This extension uses [`nzh`](https://www.npmjs.com/package/nzh) as the conversion engine.

The extension sends the processed numeric string directly to `nzh.toMoney` and returns the converted result.

## Development

```bash
npm install
npm run dev
```

## Validation

Run conversion feasibility checks and sample comparisons:

```bash
npm run verify:nzh
npm run test
```

## Publish

```bash
npm run build
npm run publish
```

## Acknowledgments

- [`nzh`](https://github.com/cnwhy/nzh) by [cnwhy](https://github.com/cnwhy)
- [Raycast API](https://developers.raycast.com/)
