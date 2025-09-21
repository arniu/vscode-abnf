# ABNF Language for vscode

[![Version](https://vsmarketplacebadge.apphb.com/version/arniu.vscode-abnf.svg)](https://marketplace.visualstudio.com/items?itemName=arniu.vscode-abnf)

## Features

- [x] Syntax highlighting
- [x] Rename rules (F2 or Ctrl+F2)
- [x] Go to definition (F12)
- [x] Find all references (Shift+F12)
- [x] Document symbols (Ctrl+Shift+O)
- [x] Hover information
- [ ] Format files

## Usage

### Renaming Rules

1. **使用F2键**: 将光标放在规则名称上，按F2键即可重命名
2. **使用右键菜单**: 右键点击规则名称，选择"重命名符号"
3. **使用命令面板**: 按Ctrl+Shift+P，输入"重命名ABNF规则"

重命名功能会自动找到并更新：
- 规则定义行
- 所有引用该规则的地方（包括角括号形式 `<rulename>` 和直接引用形式 `rulename`）

### 其他功能

- **跳转到定义**: 将光标放在规则名称上，按F12或Ctrl+点击
- **查找所有引用**: 将光标放在规则名称上，按Shift+F12
- **查看文档符号**: 按Ctrl+Shift+O查看文件中的所有规则
- **悬停信息**: 将鼠标悬停在规则名称上查看信息

## Example

```abnf
; 定义规则
rulelist = 1*( rule / (*c-wsp c-nl) )

rule = rulename defined-as elements c-nl

rulename = ALPHA *(ALPHA / DIGIT / "-")
```

在上面的例子中，重命名 `rulelist` 为 `grammar` 将会更新所有引用该规则的地方。

## License

[Apache-2.0 License](LICENSE.txt)
