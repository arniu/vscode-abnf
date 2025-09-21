import * as vscode from 'vscode';
import { RenameProvider } from './providers/renameProvider';
import { FormatProvider } from './providers/formatProvider';
import { HoverProvider } from './providers/hoverProvider';
import { SymbolProvider } from './providers/symbolProvider';

/**
 * ABNF 语言服务器
 * 作为各种提供者的协调器
 */
export class AbnfLanguageServer {
    private renameProvider: RenameProvider;
    private formatProvider: FormatProvider;
    private hoverProvider: HoverProvider;
    private symbolProvider: SymbolProvider;

    constructor(context: vscode.ExtensionContext) {
        this.renameProvider = new RenameProvider();
        this.formatProvider = new FormatProvider();
        this.hoverProvider = new HoverProvider();
        this.symbolProvider = new SymbolProvider();
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
}
