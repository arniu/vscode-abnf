# ABNF重命名功能使用说明

## 安装

1. 在VSCode中打开扩展开发主机（F5）
2. 或者打包扩展并安装

## 使用方法

### 重命名规则

1. **F2键重命名**：
   - 将光标放在要重命名的规则名称上
   - 按F2键
   - 输入新的规则名称
   - 按Enter确认

2. **右键菜单**：
   - 右键点击规则名称
   - 选择"重命名符号"
   - 输入新的规则名称

3. **命令面板**：
   - 按Ctrl+Shift+P
   - 输入"重命名ABNF规则"
   - 输入新的规则名称

### 其他功能

- **F12**: 跳转到规则定义
- **Shift+F12**: 查找所有引用
- **Ctrl+Shift+O**: 查看文档符号
- **鼠标悬停**: 显示规则信息

## 示例

```abnf
; 定义规则
rulelist = 1*( rule / (*c-wsp c-nl) )

rule = rulename defined-as elements c-nl

rulename = ALPHA *(ALPHA / DIGIT / "-")
```

重命名 `rulelist` 为 `grammar` 后：

```abnf
; 定义规则
grammar = 1*( rule / (*c-wsp c-nl) )

rule = rulename defined-as elements c-nl

rulename = ALPHA *(ALPHA / DIGIT / "-")
```

## 注意事项

- 规则名称必须以字母开头
- 只能包含字母、数字和连字符
- 重命名会更新所有引用（包括角括号形式）
- 支持多行规则定义
