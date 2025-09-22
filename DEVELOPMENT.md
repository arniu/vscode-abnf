# Development Guide

## Install Dependencies

```bash
npm install
```

## Compile

```bash
npm run compile
```

## Development Mode

```bash
npm run watch
```

## Testing

1. Press F5 in VSCode to launch the extension development host
2. Open the `example/abnf-lang.abnf` file
3. Test the following features:
   - Place cursor on `rulelist` and press F2 to rename
   - Place cursor on `rule` and press F12 to go to definition
   - Place cursor on `rulename` and press Shift+F12 to find all references
   - Press Ctrl+Shift+O to view document symbols
   - Press Ctrl+Shift+I to format document

## Feature Description

### Rename Functionality
- Supports renaming ABNF rule definitions
- Automatically updates all references (including angle bracket form `<rulename>` and direct reference form `rulename`)
- Validates new rule names for ABNF specification compliance

### Formatting Functionality
- **Format Document**: Ctrl+Shift+I key
- Normalizes rule definition format
- Preserves original format of comment lines
- Ensures appropriate spacing around operators

### Other Features
- **Go to Definition**: F12 key
- **Find All References**: Shift+F12 key
- **Document Symbols**: Ctrl+Shift+O
- **Hover Information**: Mouse hover displays rule information
  - Core rules show complete definition and description
  - User rules show rename hints

## Architecture Design

### Modular Architecture

The project adopts a modular design that separates functionality by responsibility:

- **`abnfLanguageServer.ts`**: Language server coordinator responsible for coordinating various modules
- **`parser/`**: Parser module responsible for parsing ABNF documents
- **`providers/`**: Provider module containing all language server providers
- **`i18n/`**: Internationalization module providing multi-language support

### Extensibility

This design makes adding new features simple:

1. **Add new parsing functionality**: Create new parsers in the `parser/` directory
2. **Add new language features**: Add new providers in the `providers/` directory
3. **Add new core rules**: Extend core rule information in the `i18n/` directory

## File Structure

```
src/
├── extension.ts            # Extension main entry point
├── abnfLanguageServer.ts   # Language server coordinator
├── parser/                 # Parser module
│   └── abnfParser.ts       # ABNF parser
├── providers/              # Provider module
│   ├── renameProvider.ts   # Rename provider
│   ├── formatProvider.ts   # Format provider
│   ├── hoverProvider.ts    # Hover provider
│   └── symbolProvider.ts   # Symbol provider
└── i18n/                   # Internationalization module
    ├── index.ts            # Message manager
    ├── types.ts            # Type definitions
    ├── zh-CN.ts            # Chinese messages
    └── en.ts               # English messages
example/
├── abnf-core.abnf          # ABNF core rules example
├── abnf-lang.abnf          # ABNF language definition example
├── abnf-lang-codeblock.md  # Markdown code block example
└── toml-lang.abnf          # TOML language definition example
```
