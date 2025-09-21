# 开发说明

## 安装依赖

```bash
npm install
```

## 编译

```bash
npm run compile
```

## 开发模式

```bash
npm run watch
```

## 测试

1. 在VSCode中按F5启动扩展开发主机
2. 打开 `example/abnf-lang.abnf` 文件
3. 测试以下功能：
   - 将光标放在 `rulelist` 上，按F2重命名
   - 将光标放在 `rule` 上，按F12跳转到定义
   - 将光标放在 `rulename` 上，按Shift+F12查找所有引用
   - 按Ctrl+Shift+O查看文档符号

## 功能说明

### 重命名功能
- 支持重命名ABNF规则定义
- 自动更新所有引用（包括角括号形式 `<rulename>` 和直接引用形式 `rulename`）
- 验证新规则名称是否符合ABNF规范

### 其他功能
- **跳转到定义**: F12键
- **查找所有引用**: Shift+F12键
- **文档符号**: Ctrl+Shift+O
- **悬停信息**: 鼠标悬停显示规则信息

## 文件结构

```
src/
├── extension.ts          # 扩展主入口
├── abnfLanguageServer.ts # 语言服务器实现
example/
├── abnf-core.abnf       # ABNF核心规则示例
├── abnf-lang.abnf       # ABNF语言定义示例
├── abnf-lang-codeblock.md # Markdown代码块示例
└── toml-lang.abnf       # TOML语言定义示例
```
