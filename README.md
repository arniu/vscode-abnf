# ABNF Language for vscode

[![Version](https://vsmarketplacebadge.apphb.com/version/arniu.vscode-abnf.svg)](https://marketplace.visualstudio.com/items?itemName=arniu.vscode-abnf)

## Features

- [x] Syntax highlighting
- [x] Rename rules (F2 or Ctrl+F2)
- [x] Go to definition (F12)
- [x] Find all references (Shift+F12)
- [x] Document symbols (Ctrl+Shift+O)
- [x] Hover information with core rule details
- [x] Internationalization support (中文 / English)
- [x] Format files (Ctrl+Shift+I / Cmd+Shift+I)

## Usage

### Renaming Rules

1. **使用 F2 键**: 将光标放在规则名称上，按 F2 键即可重命名
2. **使用右键菜单**: 右键点击规则名称，选择"重命名符号"
3. **使用命令面板**: 按 Ctrl+Shift+P，输入"重命名 ABNF 规则"

重命名功能会自动找到并更新：
- 规则定义行
- 所有引用该规则的地方（包括角括号形式 `<rulename>` 和直接引用形式 `rulename`）

### 格式化文档

1. **使用快捷键**: 按 Ctrl+Shift+I (Windows/Linux) 或 Cmd+Shift+I (macOS)
2. **使用命令面板**: 按 Ctrl+Shift+P，输入"格式化 ABNF 文档"
3. **使用右键菜单**: 右键点击编辑器，选择"格式化文档"

格式化功能会自动：
- 规范化规则定义的格式
- 保持注释行的原始格式
- 确保操作符周围有适当的空格

### 其他功能

- **跳转到定义**: 将光标放在规则名称上，按 F12 或 Ctrl+点击
- **查找所有引用**: 将光标放在规则名称上，按 Shift+F12
- **查看文档符号**: 按 Ctrl+Shift+O 查看文件中的所有规则
- **悬停信息**: 将鼠标悬停在规则名称上查看详细信息
  - 核心规则显示完整定义和说明
  - 用户规则显示重命名提示

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
