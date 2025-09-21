import * as vscode from 'vscode';
import { LRUCache } from 'lru-cache';

/**
 * 文档缓存管理器
 * 使用 LRU 缓存算法管理解析结果，避免重复解析
 */
export class DocumentCache {
    private rulesCache: LRUCache<string, CacheEntry>;
    private referencesCache: LRUCache<string, Map<string, vscode.Location[]>>;

    constructor() {
        // 初始化 LRU 缓存，最大容量 100 个文档
        this.rulesCache = new LRUCache<string, CacheEntry>({
            max: 100,
            ttl: 1000 * 60 * 30, // 30 分钟 TTL
            updateAgeOnGet: true, // 访问时更新年龄
            updateAgeOnHas: true  // 检查时更新年龄
        });

        this.referencesCache = new LRUCache<string, Map<string, vscode.Location[]>>({
            max: 100,
            ttl: 1000 * 60 * 30, // 30 分钟 TTL
            updateAgeOnGet: true,
            updateAgeOnHas: true
        });
    }

    /**
     * 获取缓存的解析结果
     */
    getCachedRules(document: vscode.TextDocument): Map<string, vscode.Location> | null {
        const key = this.getDocumentKey(document);
        const entry = this.rulesCache.get(key);

        if (!entry) {
            return null;
        }

        // 检查文档是否已修改
        if (entry.version !== document.version) {
            this.rulesCache.delete(key);
            return null;
        }

        return entry.rules;
    }

    /**
     * 缓存解析结果
     */
    setCachedRules(document: vscode.TextDocument, rules: Map<string, vscode.Location>): void {
        const key = this.getDocumentKey(document);

        // LRU 缓存会自动管理容量，无需手动处理
        this.rulesCache.set(key, {
            rules: new Map(rules), // 深拷贝
            version: document.version,
            timestamp: Date.now()
        });
    }

    /**
     * 获取缓存的引用结果
     */
    getCachedReferences(document: vscode.TextDocument, ruleName: string): vscode.Location[] | null {
        const key = this.getDocumentKey(document);
        const referencesMap = this.referencesCache.get(key);

        if (!referencesMap) {
            return null;
        }

        return referencesMap.get(ruleName) || null;
    }

    /**
     * 缓存引用结果
     */
    setCachedReferences(document: vscode.TextDocument, ruleName: string, references: vscode.Location[]): void {
        const key = this.getDocumentKey(document);
        let referencesMap = this.referencesCache.get(key);

        if (!referencesMap) {
            referencesMap = new Map();
            this.referencesCache.set(key, referencesMap);
        }

        referencesMap.set(ruleName, [...references]); // 深拷贝
    }

    /**
     * 清除文档缓存
     */
    clearDocumentCache(document: vscode.TextDocument): void {
        const key = this.getDocumentKey(document);
        this.rulesCache.delete(key);
        this.referencesCache.delete(key);
    }

    /**
     * 清除所有缓存
     */
    clearAllCache(): void {
        this.rulesCache.clear();
        this.referencesCache.clear();
    }

    /**
     * 获取缓存统计信息
     */
    getCacheStats(): {
        rulesCache: { size: number; max: number; ttl: number };
        referencesCache: { size: number; max: number; ttl: number };
        entries: Array<{ uri: string; version: number; timestamp: number }>;
    } {
        const entries: Array<{ uri: string; version: number; timestamp: number }> = [];

        // 收集规则缓存条目
        for (const [key, entry] of this.rulesCache.entries()) {
            entries.push({
                uri: key,
                version: entry.version,
                timestamp: entry.timestamp
            });
        }

        return {
            rulesCache: {
                size: this.rulesCache.size,
                max: this.rulesCache.max,
                ttl: this.rulesCache.ttl
            },
            referencesCache: {
                size: this.referencesCache.size,
                max: this.referencesCache.max,
                ttl: this.referencesCache.ttl
            },
            entries
        };
    }

    /**
     * 生成文档的唯一键
     */
    private getDocumentKey(document: vscode.TextDocument): string {
        return `${document.uri.toString()}`;
    }
}

/**
 * 缓存条目接口
 */
interface CacheEntry {
    rules: Map<string, vscode.Location>;
    references?: Map<string, vscode.Location[]>;
    version: number;
    timestamp: number;
}
