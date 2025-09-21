import * as vscode from 'vscode';
import { AbnfParser } from '../parser/abnfParser';
import { getMessages, formatMessage } from '../i18n';

/**
 * 重命名提供者
 * 负责处理 ABNF 规则的重命名功能
 */
export class RenameProvider {
    private parser: AbnfParser;

    constructor(parser: AbnfParser) {
        this.parser = parser;
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

        // 验证新名称是否符合 ABNF 规则名称规范
        if (!this.parser.isValidRuleName(newName)) {
            throw new Error(messages.ui.rename.invalidRuleName);
        }

        // 检查当前名称是否是已定义的规则
        const rules = this.parser.parseRules(document);
        if (!rules.has(currentName)) {
            throw new Error(formatMessage(messages.ui.rename.ruleNotDefined, currentName));
        }

        const workspaceEdit = new vscode.WorkspaceEdit();

        // 查找所有引用并添加编辑
        const references = this.parser.findRuleReferences(document, currentName);

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
}
