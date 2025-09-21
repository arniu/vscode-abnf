import * as vscode from 'vscode';
import { AbnfLanguageServer } from './abnfLanguageServer';
import { initializeMessages, getMessages, formatMessage } from './i18n';

let languageServer: AbnfLanguageServer;

export function activate(context: vscode.ExtensionContext) {
    console.log('ABNF语言扩展已激活');

    // 初始化国际化消息
    initializeMessages(vscode.env.language);

    // 创建语言服务器实例
    languageServer = new AbnfLanguageServer(context);

    // 监听文档变化，自动清除缓存
    const documentChangeListener = vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.document.languageId === 'abnf') {
            // 清除该文档的缓存
            languageServer.clearDocumentCache(event.document);
        }
    });

    // 监听文档关闭，清除缓存
    const documentCloseListener = vscode.workspace.onDidCloseTextDocument((document) => {
        if (document.languageId === 'abnf') {
            languageServer.clearDocumentCache(document);
        }
    });

    // 注册重命名提供者
    const renameProvider = vscode.languages.registerRenameProvider(
        { scheme: 'file', language: 'abnf' },
        {
            provideRenameEdits(document: vscode.TextDocument, position: vscode.Position, newName: string, token: vscode.CancellationToken) {
                try {
                    return languageServer.provideRenameEdits(document, position, newName);
                } catch (error) {
                    console.error('重命名错误:', error);
                    const messages = getMessages();
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    vscode.window.showErrorMessage(formatMessage(messages.ui.rename.renameFailed, errorMessage));
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

    // 注册格式化提供者
    const formattingProvider = vscode.languages.registerDocumentFormattingEditProvider(
        { scheme: 'file', language: 'abnf' },
        {
            provideDocumentFormattingEdits(document: vscode.TextDocument) {
                return languageServer.provideDocumentFormattingEdits(document);
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
            const messages = getMessages();
            vscode.window.showWarningMessage(messages.ui.hover.userRuleHint);
            return;
        }

        vscode.commands.executeCommand('editor.action.rename');
    });

    // 注册格式化命令
    const formatCommand = vscode.commands.registerCommand('abnf.formatDocument', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.languageId !== 'abnf') {
            return;
        }
        vscode.commands.executeCommand('editor.action.formatDocument');
    });

    // 将所有提供者添加到上下文
    context.subscriptions.push(
        renameProvider,
        definitionProvider,
        referenceProvider,
        documentSymbolProvider,
        hoverProvider,
        formattingProvider,
        renameCommand,
        formatCommand,
        documentChangeListener,
        documentCloseListener
    );
}

export function deactivate() {
    console.log('ABNF语言扩展已停用');
}
