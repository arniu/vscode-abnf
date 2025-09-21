import * as vscode from 'vscode';
import { AbnfParser } from '../parser/abnfParser';
import { getMessages } from '../i18n';

/**
 * 符号提供者
 * 负责处理 ABNF 文档的符号功能（定义、引用、文档符号）
 */
export class SymbolProvider {
    private parser: AbnfParser;

    constructor(parser: AbnfParser) {
        this.parser = parser;
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
        const rules = this.parser.parseRules(document);

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
        return this.parser.findRuleReferences(document, ruleName);
    }

    /**
     * 提供符号信息（用于显示规则定义和引用）
     */
    provideDocumentSymbols(document: vscode.TextDocument): vscode.DocumentSymbol[] {
        const symbols: vscode.DocumentSymbol[] = [];
        const rules = this.parser.parseRules(document);
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
}
