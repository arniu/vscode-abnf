import * as vscode from 'vscode';

/**
 * ABNF 解析器
 * 负责解析 ABNF 文档，提取规则定义和引用
 */
export class AbnfParser {
    /**
     * 解析 ABNF 文件，提取所有规则定义
     */
    parseRules(document: vscode.TextDocument): Map<string, vscode.Location> {
        const rules = new Map<string, vscode.Location>();
        const text = document.getText();
        const lines = text.split('\n');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();

            // 跳过注释行和空行
            if (trimmedLine.startsWith(';') || trimmedLine === '') {
                continue;
            }

            // 匹配规则定义: rulename =/ 或 rulename =
            const ruleMatch = trimmedLine.match(/^([a-zA-Z][a-zA-Z0-9\-]*)\s*(\=\/?)/);
            if (ruleMatch) {
                const ruleName = ruleMatch[1];
                const lineStartOffset = document.offsetAt(new vscode.Position(i, 0));
                const matchOffset = text.indexOf(ruleMatch[0], lineStartOffset);
                const startPos = document.positionAt(matchOffset);
                const endPos = document.positionAt(matchOffset + ruleName.length);
                const range = new vscode.Range(startPos, endPos);
                const location = new vscode.Location(document.uri, range);
                rules.set(ruleName, location);
            }
        }

        return rules;
    }

    /**
     * 查找规则的所有引用
     */
    findRuleReferences(document: vscode.TextDocument, ruleName: string): vscode.Location[] {
        const references: vscode.Location[] = [];
        const text = document.getText();

        // 创建正则表达式来匹配规则名称
        // 规则名称可以出现在角括号中 <rulename> 或者直接使用 rulename
        const patterns = [
            new RegExp(`\\b${this.escapeRegExp(ruleName)}\\b`, 'g'),
            new RegExp(`<${this.escapeRegExp(ruleName)}>`, 'g')
        ];

        for (let i = 0; i < patterns.length; i++) {
            const pattern = patterns[i];
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const startPos = document.positionAt(match.index);
                const endPos = document.positionAt(match.index + match[0].length);
                const range = new vscode.Range(startPos, endPos);
                const location = new vscode.Location(document.uri, range);
                // 为角括号引用添加标记
                (location as any).isAngleBracket = i === 1;
                references.push(location);
            }
        }

        return references;
    }

    /**
     * 转义正则表达式特殊字符
     */
    private escapeRegExp(string: string): string {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * 验证规则名称是否符合 ABNF 规范
     */
    isValidRuleName(name: string): boolean {
        // ABNF 规则名称必须以字母开头，只能包含字母、数字和连字符
        return /^[a-zA-Z][a-zA-Z0-9\-]*$/.test(name);
    }
}
