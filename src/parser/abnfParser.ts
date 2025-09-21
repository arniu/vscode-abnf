import * as vscode from 'vscode';
import { DocumentCache } from './documentCache';

/**
 * ABNF 解析器
 * 负责解析 ABNF 文档，提取规则定义和引用
 */
export class AbnfParser {
    private cache: DocumentCache;

    constructor() {
        this.cache = new DocumentCache();
    }
    /**
     * 解析 ABNF 文件，提取所有规则定义
     * 使用缓存机制避免重复解析
     */
    parseRules(document: vscode.TextDocument): Map<string, vscode.Location> {
        // 先尝试从缓存获取
        const cachedRules = this.cache.getCachedRules(document);
        if (cachedRules) {
            return cachedRules;
        }

        // 缓存未命中，执行解析
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

        // 缓存解析结果
        this.cache.setCachedRules(document, rules);
        return rules;
    }

    /**
     * 查找规则的所有引用
     * 使用缓存机制避免重复解析
     */
    findRuleReferences(document: vscode.TextDocument, ruleName: string): vscode.Location[] {
        // 先尝试从缓存获取
        const cachedReferences = this.cache.getCachedReferences(document, ruleName);
        if (cachedReferences) {
            return cachedReferences;
        }

        // 缓存未命中，执行解析
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

        // 缓存解析结果
        this.cache.setCachedReferences(document, ruleName, references);
        return references;
    }

    /**
     * 清除文档缓存
     */
    clearDocumentCache(document: vscode.TextDocument): void {
        this.cache.clearDocumentCache(document);
    }

    /**
     * 清除所有缓存
     */
    clearAllCache(): void {
        this.cache.clearAllCache();
    }

    /**
     * 获取缓存统计信息
     */
    getCacheStats(): {
        rulesCache: { size: number; max: number; ttl: number };
        referencesCache: { size: number; max: number; ttl: number };
        entries: Array<{ uri: string; version: number; timestamp: number }>;
    } {
        return this.cache.getCacheStats();
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
