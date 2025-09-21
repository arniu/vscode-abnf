import { Messages } from './types';

export const zhCN: Messages = {
    coreRules: {
        'ALPHA': {
            description: '字母字符 (A-Z, a-z)',
            definition: '%x41-5A / %x61-7A'
        },
        'BIT': {
            description: '二进制位 (0 或 1)',
            definition: '"0" / "1"'
        },
        'CHAR': {
            description: '7位ASCII字符 (排除NUL)',
            definition: '%x01-7F'
        },
        'CR': {
            description: '回车符',
            definition: '%x0D'
        },
        'CRLF': {
            description: 'Internet 标准换行符',
            definition: 'CR LF'
        },
        'CTL': {
            description: '控制字符',
            definition: '%x00-1F / %x7F'
        },
        'DIGIT': {
            description: '数字字符 (0-9)',
            definition: '%x30-39'
        },
        'DQUOTE': {
            description: '双引号字符',
            definition: '%x22'
        },
        'HEXDIG': {
            description: '十六进制数字字符 (0-9, A-F)',
            definition: 'DIGIT / "A" / "B" / "C" / "D" / "E" / "F"'
        },
        'HTAB': {
            description: '水平制表符',
            definition: '%x09'
        },
        'LF': {
            description: '换行符',
            definition: '%x0A'
        },
        'LWSP': {
            description: '线性空白字符 (谨慎使用)',
            definition: '*(WSP / CRLF WSP)'
        },
        'OCTET': {
            description: '8位数据',
            definition: '%x00-FF'
        },
        'SP': {
            description: '空格字符',
            definition: '%x20'
        },
        'VCHAR': {
            description: '可见(可打印)字符',
            definition: '%x21-7E'
        },
        'WSP': {
            description: '空白字符 (空格或制表符)',
            definition: 'SP / HTAB'
        }
    },
    ui: {
        hover: {
            coreRuleTitle: 'ABNF核心规则',
            userRuleTitle: 'ABNF规则',
            userRuleHint: '点击查看定义，或使用 F2 重命名。',
            source: 'RFC 5234'
        },
        rename: {
            invalidRuleName: '无效的规则名称。规则名称必须以字母开头，只能包含字母、数字和连字符。',
            ruleNotDefined: '规则 "{0}" 未定义',
            renameFailed: '重命名失败: {0}'
        },
        general: {
            abnfRule: 'ABNF 规则'
        }
    }
};
