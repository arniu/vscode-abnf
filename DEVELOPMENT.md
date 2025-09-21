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

1. 在 VSCode 中按 F5 启动扩展开发主机
2. 打开 `example/abnf-lang.abnf` 文件
3. 测试以下功能：
   - 将光标放在 `rulelist` 上，按 F2 重命名
   - 将光标放在 `rule` 上，按 F12 跳转到定义
   - 将光标放在 `rulename` 上，按 Shift+F12 查找所有引用
   - 按 Ctrl+Shift+O 查看文档符号
   - 按 Ctrl+Shift+I 格式化文档

## 功能说明

### 重命名功能
- 支持重命名 ABNF 规则定义
- 自动更新所有引用（包括角括号形式 `<rulename>` 和直接引用形式 `rulename`）
- 验证新规则名称是否符合 ABNF 规范

### 格式化功能
- **格式化文档**: Ctrl+Shift+I 键
- 规范化规则定义格式
- 保持注释行原始格式
- 确保操作符周围适当空格

### 其他功能
- **跳转到定义**: F12 键
- **查找所有引用**: Shift+F12 键
- **文档符号**: Ctrl+Shift+O
- **悬停信息**: 鼠标悬停显示规则信息
  - 核心规则显示完整定义和说明
  - 用户规则显示重命名提示

## 架构设计

### 模块化架构

项目采用模块化设计，将功能按职责分离：

- **`abnfLanguageServer.ts`**: 语言服务器协调器，负责协调各个模块
- **`parser/`**: 解析器模块，负责解析 ABNF 文档
- **`providers/`**: 提供者模块，包含所有语言服务器提供者
- **`i18n/`**: 国际化模块，提供多语言支持

### 扩展性

这种设计使得添加新功能变得简单：

1. **添加新的解析功能**: 在 `parser/` 目录下创建新的解析器
2. **添加新的语言功能**: 在 `providers/` 目录下添加新的提供者
3. **添加新的核心规则**: 在 `i18n/` 目录下扩展核心规则信息

## 文件结构

```
src/
├── extension.ts            # 扩展主入口
├── abnfLanguageServer.ts   # 语言服务器协调器
├── parser/                 # 解析器模块
│   └── abnfParser.ts       # ABNF 解析器
├── providers/              # 提供者模块
│   ├── renameProvider.ts   # 重命名提供者
│   ├── formatProvider.ts   # 格式化提供者
│   ├── hoverProvider.ts    # 悬停提供者
│   └── symbolProvider.ts   # 符号提供者
└── i18n/                   # 国际化模块
    ├── index.ts            # 消息管理器
    ├── types.ts            # 类型定义
    ├── zh-CN.ts            # 中文消息
    └── en.ts               # 英文消息
example/
├── abnf-core.abnf          # ABNF核心规则示例
├── abnf-lang.abnf          # ABNF语言定义示例
├── abnf-lang-codeblock.md  # Markdown 代码块示例
└── toml-lang.abnf          # TOML语言定义示例
```
