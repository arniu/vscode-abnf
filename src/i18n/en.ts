import { Messages } from './types';

export const en: Messages = {
    coreRules: {
        'ALPHA': {
            description: 'Alphabetic characters (A-Z, a-z)',
            definition: '%x41-5A / %x61-7A'
        },
        'BIT': {
            description: 'Binary digit (0 or 1)',
            definition: '"0" / "1"'
        },
        'CHAR': {
            description: '7-bit ASCII character (excluding NUL)',
            definition: '%x01-7F'
        },
        'CR': {
            description: 'Carriage return',
            definition: '%x0D'
        },
        'CRLF': {
            description: 'Internet standard newline',
            definition: 'CR LF'
        },
        'CTL': {
            description: 'Control characters',
            definition: '%x00-1F / %x7F'
        },
        'DIGIT': {
            description: 'Decimal digits (0-9)',
            definition: '%x30-39'
        },
        'DQUOTE': {
            description: 'Double quote character',
            definition: '%x22'
        },
        'HEXDIG': {
            description: 'Hexadecimal digits (0-9, A-F)',
            definition: 'DIGIT / "A" / "B" / "C" / "D" / "E" / "F"'
        },
        'HTAB': {
            description: 'Horizontal tab',
            definition: '%x09'
        },
        'LF': {
            description: 'Line feed',
            definition: '%x0A'
        },
        'LWSP': {
            description: 'Linear white space (use with caution)',
            definition: '*(WSP / CRLF WSP)'
        },
        'OCTET': {
            description: '8 bits of data',
            definition: '%x00-FF'
        },
        'SP': {
            description: 'Space character',
            definition: '%x20'
        },
        'VCHAR': {
            description: 'Visible (printing) characters',
            definition: '%x21-7E'
        },
        'WSP': {
            description: 'White space (space or tab)',
            definition: 'SP / HTAB'
        }
    },
    ui: {
        hover: {
            coreRuleTitle: 'ABNF Core Rule',
            userRuleTitle: 'ABNF Rule',
            userRuleHint: 'Click to view definition, or use F2 to rename.',
            source: 'RFC 5234'
        },
        rename: {
            invalidRuleName: 'Invalid rule name. Rule names must start with a letter and can only contain letters, digits, and hyphens.',
            ruleNotDefined: 'Rule "{0}" is not defined',
            renameFailed: 'Rename failed: {0}'
        },
        general: {
            abnfRule: 'ABNF Rule'
        }
    }
};
