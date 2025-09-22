# ABNF Language for vscode

[![Version](https://vsmarketplacebadge.apphb.com/version/arniu.vscode-abnf.svg)](https://marketplace.visualstudio.com/items?itemName=arniu.vscode-abnf)

## Features

- [x] Syntax highlighting
- [x] Rename rules (F2 or Ctrl+F2)
- [x] Go to definition (F12)
- [x] Find all references (Shift+F12)
- [x] Document symbols (Ctrl+Shift+O)
- [x] Hover information with core rule details
- [x] Internationalization support (中文 / English)
- [x] Format files (Ctrl+Shift+I / Cmd+Shift+I)

## Usage

### Renaming Rules

1. **Using F2 key**: Place cursor on rule name and press F2 to rename
2. **Using right-click menu**: Right-click on rule name and select "Rename Symbol"
3. **Using command palette**: Press Ctrl+Shift+P and type "Rename ABNF Rule"

The rename functionality will automatically find and update:
- Rule definition lines
- All references to the rule (including angle bracket form `<rulename>` and direct reference form `rulename`)

### Formatting Documents

1. **Using keyboard shortcut**: Press Ctrl+Shift+I (Windows/Linux) or Cmd+Shift+I (macOS)
2. **Using command palette**: Press Ctrl+Shift+P and type "Format ABNF Document"
3. **Using right-click menu**: Right-click in editor and select "Format Document"

The formatting functionality will automatically:
- Normalize rule definition format
- Preserve original format of comment lines
- Ensure appropriate spacing around operators

### Other Features

- **Go to Definition**: Place cursor on rule name and press F12 or Ctrl+click
- **Find All References**: Place cursor on rule name and press Shift+F12
- **View Document Symbols**: Press Ctrl+Shift+O to view all rules in the file
- **Hover Information**: Hover mouse over rule name to view detailed information
  - Core rules show complete definition and description
  - User rules show rename hints

## Example

```abnf
; Define rules
rulelist = 1*( rule / (*c-wsp c-nl) )

rule = rulename defined-as elements c-nl

rulename = ALPHA *(ALPHA / DIGIT / "-")
```

In the example above, renaming `rulelist` to `grammar` will update all references to that rule.

## License

[Apache-2.0 License](LICENSE.txt)
