# README

The file [abnf.tmLanguage](./abnf.tmLanguage) was originally copied from
<https://github.com/sanssecours/ABNF.tmbundle>
, which was developed by [René Schwaiger](https://github.com/sanssecours).

## Modifications

- Fixed typo: `OCTECT` → `OCTET`
- Improved core rule matching priority to ensure ABNF core rules (ALPHA, DIGIT, CRLF, etc.) are highlighted differently from user-defined rules
- Core rules use `support.constant.core-rule` scope
- User rules use `variable.other.rule` scope
