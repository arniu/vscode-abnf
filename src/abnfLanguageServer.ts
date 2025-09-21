import * as vscode from 'vscode';
import { getMessages, formatMessage } from './i18n';

export class AbnfLanguageServer {
    constructor(context: vscode.ExtensionContext) {
        // context 参数保留以备将来使用
    }

    /**
     * 解析ABNF文件，提取所有规则定义
     */
    private parseAbnfRules(document: vscode.TextDocument): Map<string, vscode.Location> {
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
    private findRuleReferences(document: vscode.TextDocument, ruleName: string): vscode.Location[] {
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
     * 提供重命名功能
     */
    provideRenameEdits(document: vscode.TextDocument, position: vscode.Position, newName: string): vscode.WorkspaceEdit | null {
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            return null;
        }

        const currentName = document.getText(wordRange);

        const messages = getMessages();

        // 验证新名称是否符合ABNF规则名称规范
        if (!this.isValidRuleName(newName)) {
            throw new Error(messages.ui.rename.invalidRuleName);
        }

        // 检查当前名称是否是已定义的规则
        const rules = this.parseAbnfRules(document);
        if (!rules.has(currentName)) {
            throw new Error(formatMessage(messages.ui.rename.ruleNotDefined, currentName));
        }

        const workspaceEdit = new vscode.WorkspaceEdit();

        // 查找所有引用并添加编辑
        const references = this.findRuleReferences(document, currentName);

        // 按位置排序并处理重叠范围
        const sortedReferences = references.sort((a, b) => {
            if (a.range.start.line !== b.range.start.line) {
                return a.range.start.line - b.range.start.line;
            }
            return a.range.start.character - b.range.start.character;
        });

        const processedRanges: vscode.Range[] = [];

        for (const reference of sortedReferences) {
            const currentText = document.getText(reference.range);
            const isAngleBracket = currentText.startsWith('<') && currentText.endsWith('>');

            // 检查是否与已处理的范围重叠
            const hasOverlap = processedRanges.some(range =>
                reference.range.start.isBeforeOrEqual(range.end) &&
                reference.range.end.isAfterOrEqual(range.start)
            );

            if (!hasOverlap) {
                const replacement = isAngleBracket ? `<${newName}>` : newName;
                workspaceEdit.replace(document.uri, reference.range, replacement);
                processedRanges.push(reference.range);
            }
        }

        return workspaceEdit;
    }

    /**
     * 验证规则名称是否符合ABNF规范
     */
    private isValidRuleName(name: string): boolean {
        // ABNF规则名称必须以字母开头，只能包含字母、数字和连字符
        return /^[a-zA-Z][a-zA-Z0-9\-]*$/.test(name);
    }

    /**
     * 提供符号信息（用于显示规则定义和引用）
     */
    provideDocumentSymbols(document: vscode.TextDocument): vscode.DocumentSymbol[] {
        const symbols: vscode.DocumentSymbol[] = [];
        const rules = this.parseAbnfRules(document);
        const messages = getMessages();

        for (const [ruleName, location] of rules) {
            const symbol = new vscode.DocumentSymbol(
                ruleName,
                messages.ui.general.abnfRule,
                vscode.SymbolKind.Function,
                location.range,
                location.range
            );
            symbols.push(symbol);
        }

        return symbols;
    }

    /**
     * 提供定义信息
     */
    provideDefinition(document: vscode.TextDocument, position: vscode.Position): vscode.Definition | null {
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            return null;
        }

        const ruleName = document.getText(wordRange);
        const rules = this.parseAbnfRules(document);

        return rules.get(ruleName) || null;
    }

    /**
     * 提供引用信息
     */
    provideReferences(document: vscode.TextDocument, position: vscode.Position): vscode.Location[] {
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            return [];
        }

        const ruleName = document.getText(wordRange);
        return this.findRuleReferences(document, ruleName);
    }

    /**
     * 提供悬停信息
     */
    provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.Hover | null {
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            return null;
        }

        const ruleName = document.getText(wordRange);
        const rules = this.parseAbnfRules(document);
        const messages = getMessages();

        // 检查是否是核心规则
        const coreRuleInfo = this.getCoreRuleInfo(ruleName);
        if (coreRuleInfo) {
            const markdown = new vscode.MarkdownString();
            markdown.appendMarkdown(`**${messages.ui.hover.coreRuleTitle}: ${ruleName}**\n\n`);
            markdown.appendMarkdown(`${coreRuleInfo.description}\n\n`);
            markdown.appendMarkdown(`**${messages.ui.hover.definition}**: \`${coreRuleInfo.definition}\`\n\n`);
            markdown.appendMarkdown(`**${messages.ui.hover.sourceLabel}**: ${messages.ui.hover.source}`);
            return new vscode.Hover(markdown);
        }

        // 检查是否是用户定义的规则
        if (rules.has(ruleName)) {
            const markdown = new vscode.MarkdownString();
            markdown.appendMarkdown(`**${messages.ui.hover.userRuleTitle}: ${ruleName}**\n\n`);
            markdown.appendMarkdown(messages.ui.hover.userRuleHint);
            return new vscode.Hover(markdown);
        }

        return null;
    }

    /**
     * 获取核心规则信息
     */
    private getCoreRuleInfo(ruleName: string): { description: string; definition: string } | null {
        const messages = getMessages();
        return messages.coreRules[ruleName] || null;
    }
}
