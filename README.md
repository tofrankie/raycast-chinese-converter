# Chinese Converter

Convert number into Chinese formatted text.

Now support uppercase RMB amount conversion.

```
0 → 零元整
1 → 壹元整
10 → 壹拾元整
10024 → 壹万零贰拾肆元整
2354350320 → 贰拾叁亿伍仟肆佰叁拾伍万零叁佰贰拾元整

0.1 → 壹角
0.12 → 壹角贰分
1.236 → 壹元贰角肆分（四舍五入为 1.24，默认最多保留两位小数）
1000000.93 → 壹佰万元玖角叁分
```

## Advanced Usage

本扩展支持一些配置项，以满足不同的需求。你可以在 Convert to RMB 命令的 ActionPanel 中找到「Configure Command」选项打开配置界面。

### Decimal Places / 小数位数

- Controls how many digits are kept after the decimal point before conversion
- Example: for `1.2345` with `2` digits, keep `1.23` before conversion

### Rounding Mode / 取整模式

Controls how extra decimal digits beyond the specified places are handled. Powered by [bignumber.js](https://github.com/MikeMcl/bignumber.js#rounding-modes), all 9 rounding modes are supported:

| Mode                            | Description                                      |
| :------------------------------ | :----------------------------------------------- |
| 四舍五入 / Round Half Up        | **默认模式** 传统四舍五入，遇 5 远离零进位       |
| 五舍六入 / Round Half Down      | 遇 5 向零舍去                                    |
| 向上取整 / Round Up             | 无论正负，远离零方向进位                         |
| 向下取整 / Round Down           | 截断多余位数，向零方向舍去                       |
| 向正无穷取整 / Round Ceil       | 向 +∞ 方向舍入                                   |
| 向负无穷取整 / Round Floor      | 向 −∞ 方向舍入                                   |
| 银行家舍入 / Round Half Even    | 遇 5 取前一位最近的偶数；IEEE 754 和银行系统标准 |
| 半正无穷取整 / Round Half Ceil  | 遇 5 向 +∞ 方向进位                              |
| 半负无穷取整 / Round Half Floor | 遇 5 向 −∞ 方向进位                              |

### Always Show Yuan / 总是显示元位

默认情况下，不足一元时省略「元」位：

```
0.1 → 壹角
0.12 → 壹角贰分
```

开启选项后：

```
0.1 → 零元壹角
0.12 → 零元壹角贰分
```

### Append Zheng / 追加整字

默认情况下：

```
1 → 壹元整
1.2 → 壹元贰角
1.23 → 壹元贰角叁分
```

依据[《会计基础工作规范》](https://kjs.mof.gov.cn/gongzuotongzhi/202408/P020240801612534470745.pdf)的会计凭证的书写要求：

> 汉字大写数字金额如零、壹、贰、叁、肆、伍、陆、柒、捌、玖、拾、佰、仟、万、亿等，一律用正楷或者行书体书写，不得用０、一、二、三、四、五、六、七、八、九、十等简化字代替，不得任意自造简化字。大写金额数字到元或者角为止的，在“元”或者“角”字之后应当写“整”字或者“正”字；大写金额数字有分的，分字后面不写“整”或者“正”字。

开启选项后：

```
1.2 → 壹元贰角整
1.23 → 壹元贰角叁分
```

### Custom Prefix / 自定义前缀

- Adds custom text before the converted amount
- For number input like `0.32` with prefix `人民币`, show `人民币叁角贰分` instead of `叁角贰分`

## Acknowledgments / 致谢

- [`nzh`](https://github.com/cnwhy/nzh)
- [`bignumber.js`](https://github.com/MikeMcl/bignumber.js)

## 其他

### 舍入模式说明

#### 1. 经典舍入（**恰好是 5** 是分水岭）

这类模式是大家最熟悉的，区别在于当遇到 **恰好是 5** 的时候怎么处理。

- **`ROUND_HALF_UP`**
  - 原理：四舍五入。遇到 5 向上（远离 0）进位。
  - 示例：`1.5` → `2`，`-1.5` → `-2`。
  - 场景：数学课本标准。零售、普通过程计算。

- **`ROUND_HALF_DOWN`**
  - 原理：五舍六入。遇到 5 向下（靠近 0）舍去。
  - 示例：`1.5` → `1`，`1.51` → `2`，`-1.5` → `-1`。
  - 场景：特定的工业标准，或者需要稍微调低统计结果的场景。

#### 2. 方向性舍入（非 5 偏向）

这类模式不关心被舍弃的部分是不是 5，只关心数字在数轴上的移动方向。

- **`ROUND_UP`**
  - 原理：远离 0 的方向舍入。无论正负，只要有小数就“进位”。
  - 示例：`1.1` → `2`，`-1.1` → `-2`。
  - 场景：加价/惩罚性计费。只要超出一丁点，就按完整单位收费。

- **`ROUND_DOWN`**
  - 原理：靠近 0 的方向舍入。直接抹掉小数部分。
  - 示例：`1.9` → `1`，`-1.9` → `-1`。
  - 场景：提现/额度消耗。1.99 元的余额只能买起 1 元的东西，剩下的不够。

- **`ROUND_CEIL`**
  - 原理：向正无穷大（数轴右侧）舍入。
  - 示例：`1.1` → `2`，`-1.9` → `-1`。
  - 场景：库存补货。如果计算需要 1.1 个箱子，你必须准备 2 个。

- **`ROUND_FLOOR`**
  - 原理：向负无穷大（数轴左侧）舍入。
  - 示例：`1.9` → `1`，`-1.1` → `-2`。
  - 场景：游戏得分/分级。必须完全达到下一级的分数才能升级，否则向下对齐。

#### 3. 金融与进阶舍入

这些模式用于处理更复杂的统计平衡和特定的数学逻辑。

- **`ROUND_HALF_EVEN`** 银行家舍入
  - 原理：向最近的数字舍入；如果距离相等（5），则向偶数舍入。
  - 示例：`2.5` → `2`，`3.5` → `4`。
  - 场景：高频金融结算。长期来看，这种方式能让进位和舍去的次数各占一半，误差几乎为零。

- **`ROUND_HALF_CEIL`**
  - 原理：遇到 5，向正无穷大方向舍入。
  - 示例：`1.5` → `2`，`-1.5` → `-1`（注意这里和 HALF_UP 的区别，-1 比 -1.5 大）。
  - 场景：需要保证 5 永远增加数值（即使是负数）的逻辑。

- **`ROUND_HALF_FLOOR`**
  - 原理：遇到 5，向负无穷大方向舍入。
  - 示例：`1.5` → `1`，`-1.5` → `-2`。
  - 场景：需要保证 5 永远减小数值的逻辑。
