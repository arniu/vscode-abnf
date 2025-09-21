import * as vscode from 'vscode';
import { AbnfLanguageServer } from './abnfLanguageServer';

let languageServer: AbnfLanguageServer;

export function activate(context: vscode.ExtensionContext) {
    console.log('ABNF语言扩展已激活');

    // 创建语言服务器实例
    languageServer = new AbnfLanguageServer(context);

    // 注册重命名提供者
    const renameProvider = vscode.languages.registerRenameProvider(
        { scheme: 'file', language: 'abnf' },
        {
            provideRenameEdits(document: vscode.TextDocument, position: vscode.Position, newName: string, token: vscode.CancellationToken) {
                try {
                    return languageServer.provideRenameEdits(document, position, newName);
                } catch (error) {
                    console.error('重命名错误:', error);
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    vscode.window.showErrorMessage(`重命名失败: ${errorMessage}`);
                    return null;
                }
            }
        }
    );

    // 注册定义提供者
    const definitionProvider = vscode.languages.registerDefinitionProvider(
        { scheme: 'file', language: 'abnf' },
        {
            provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
                return languageServer.provideDefinition(document, position);
            }
        }
    );

    // 注册引用提供者
    const referenceProvider = vscode.languages.registerReferenceProvider(
        { scheme: 'file', language: 'abnf' },
        {
            provideReferences(document: vscode.TextDocument, position: vscode.Position, context: vscode.ReferenceContext, token: vscode.CancellationToken) {
                return languageServer.provideReferences(document, position);
            }
        }
    );

    // 注册文档符号提供者
    const documentSymbolProvider = vscode.languages.registerDocumentSymbolProvider(
        { scheme: 'file', language: 'abnf' },
        {
            provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken) {
                return languageServer.provideDocumentSymbols(document);
            }
        }
    );

    // 注册悬停提供者
    const hoverProvider = vscode.languages.registerHoverProvider(
        { scheme: 'file', language: 'abnf' },
        {
            provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
                return languageServer.provideHover(document, position);
            }
        }
    );

    // 注册重命名命令
    const renameCommand = vscode.commands.registerCommand('abnf.renameRule', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.languageId !== 'abnf') {
            return;
        }

        const position = editor.selection.active;
        const wordRange = editor.document.getWordRangeAtPosition(position);
        if (!wordRange) {
            vscode.window.showWarningMessage('请选择一个规则名称');
            return;
        }

        vscode.commands.executeCommand('editor.action.rename');
    });

    // 将所有提供者添加到上下文
    context.subscriptions.push(
        renameProvider,
        definitionProvider,
        referenceProvider,
        documentSymbolProvider,
        hoverProvider,
        renameCommand
    );
}

export function deactivate() {
    console.log('ABNF语言扩展已停用');
}
