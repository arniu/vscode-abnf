import * as vscode from "vscode";

/**
 * 格式化提供者
 * 负责处理 ABNF 文档的格式化功能
 */
export class FormatProvider {
  /**
   * 提供文档格式化功能
   */
  provideDocumentFormattingEdits(
    document: vscode.TextDocument,
  ): vscode.TextEdit[] {
    const text = document.getText();
    const lines = text.split("\n");
    const formattedLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // 跳过空行
      if (trimmedLine === "") {
        formattedLines.push("");
        continue;
      }

      // 处理注释行
      if (trimmedLine.startsWith(";")) {
        formattedLines.push(line); // 保持注释行的原始格式
        continue;
      }

      // 处理规则定义
      const ruleMatch = trimmedLine.match(
        /^([a-zA-Z][a-zA-Z0-9-]*)\s*([=/])\s*(.*)$/,
      );
      if (ruleMatch) {
        const [, ruleName, operator, definition] = ruleMatch;

        // 格式化规则定义
        const formattedRule = this.formatRuleDefinition(
          ruleName,
          operator,
          definition,
        );
        formattedLines.push(formattedRule);
        continue;
      }

      // 处理其他行（保持原格式）
      formattedLines.push(line);
    }

    const formattedText = formattedLines.join("\n");
    if (formattedText !== text) {
      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(text.length),
      );
      return [vscode.TextEdit.replace(fullRange, formattedText)];
    }

    return [];
  }

  /**
   * 格式化规则定义
   */
  private formatRuleDefinition(
    ruleName: string,
    operator: string,
    definition: string,
  ): string {
    const trimmedDefinition = definition.trim();

    // 基本格式化：规则名 + 操作符 + 定义
    let formatted = `${ruleName} ${operator}`;

    if (trimmedDefinition) {
      // 添加适当的缩进
      formatted += ` ${trimmedDefinition}`;
    }

    return formatted;
  }
}
