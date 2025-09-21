import * as vscode from 'vscode';
import { RenameProvider } from './providers/renameProvider';
import { FormatProvider } from './providers/formatProvider';
import { HoverProvider } from './providers/hoverProvider';
import { SymbolProvider } from './providers/symbolProvider';
import { AbnfParser } from './parser/abnfParser';

/**
 * ABNF 语言服务器
 * 作为各种提供者的协调器，管理共享的解析器实例
 */
export class AbnfLanguageServer {
    private sharedParser: AbnfParser;
    private renameProvider: RenameProvider;
    private formatProvider: FormatProvider;
    private hoverProvider: HoverProvider;
    private symbolProvider: SymbolProvider;

    constructor(context: vscode.ExtensionContext) {
        // 创建共享的解析器实例
        this.sharedParser = new AbnfParser();

        // 所有提供者共享同一个解析器实例
        this.renameProvider = new RenameProvider(this.sharedParser);
        this.hoverProvider = new HoverProvider(this.sharedParser);
        this.symbolProvider = new SymbolProvider(this.sharedParser);
        this.formatProvider = new FormatProvider();
    }

    /**
     * 提供重命名功能
     */
    provideRenameEdits(document: vscode.TextDocument, position: vscode.Position, newName: string): vscode.WorkspaceEdit | null {
        return this.renameProvider.provideRenameEdits(document, position, newName);
    }

    /**
     * 提供符号信息（用于显示规则定义和引用）
     */
    provideDocumentSymbols(document: vscode.TextDocument): vscode.DocumentSymbol[] {
        return this.symbolProvider.provideDocumentSymbols(document);
    }

    /**
     * 提供定义信息
     */
    provideDefinition(document: vscode.TextDocument, position: vscode.Position): vscode.Definition | null {
        return this.symbolProvider.provideDefinition(document, position);
    }

    /**
     * 提供引用信息
     */
    provideReferences(document: vscode.TextDocument, position: vscode.Position): vscode.Location[] {
        return this.symbolProvider.provideReferences(document, position);
    }

    /**
     * 提供悬停信息
     */
    provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.Hover | null {
        return this.hoverProvider.provideHover(document, position);
    }

    /**
     * 提供文档格式化功能
     */
    provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
        return this.formatProvider.provideDocumentFormattingEdits(document);
    }

    /**
     * 清除文档缓存
     */
    clearDocumentCache(document: vscode.TextDocument): void {
        this.sharedParser.clearDocumentCache(document);
    }

    /**
     * 清除所有缓存
     */
    clearAllCache(): void {
        this.sharedParser.clearAllCache();
    }
}
