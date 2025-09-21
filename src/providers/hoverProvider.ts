import * as vscode from 'vscode';
import { AbnfParser } from '../parser/abnfParser';
import { getMessages } from '../i18n';

/**
 * 悬停提供者
 * 负责处理 ABNF 规则的悬停提示功能
 */
export class HoverProvider {
    private parser: AbnfParser;

    constructor(parser: AbnfParser) {
        this.parser = parser;
    }

    /**
     * 提供悬停信息
     * 优化：先检查核心规则，避免不必要的解析
     */
    provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.Hover | null {
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            return null;
        }

        const ruleName = document.getText(wordRange);
        const messages = getMessages();

        // 优先检查是否是核心规则（无需解析文档）
        const coreRuleInfo = this.getCoreRuleInfo(ruleName);
        if (coreRuleInfo) {
            const markdown = new vscode.MarkdownString();
            markdown.appendMarkdown(`**${messages.ui.hover.coreRuleTitle}: ${ruleName}**\n\n`);
            markdown.appendMarkdown(`${coreRuleInfo.description}\n\n`);
            markdown.appendMarkdown(`**${messages.ui.hover.definition}**: \`${coreRuleInfo.definition}\`\n\n`);
            markdown.appendMarkdown(`**${messages.ui.hover.sourceLabel}**: ${messages.ui.hover.source}`);
            return new vscode.Hover(markdown);
        }

        // 只有在不是核心规则时才解析文档（使用缓存）
        const rules = this.parser.parseRules(document);
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
