# Change Log

All notable changes to the "abnf" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

## [0.3.1] - 2025-09-22

### Fixed

- Fixed extension activation failure due to module system incompatibility
- Fixed VSCode version compatibility (now supports VSCode 1.15.0+)
- Corrected activation events configuration

## [0.3.0] - 2025-09-22

### Added

- ABNF rule renaming support (F2 key)
- Go to definition functionality (F12 key)
- Find all references functionality (Shift+F12 key)
- Document symbols support (Ctrl+Shift+O)
- Hover information display (core rule details)
- Rule name validation
- Support for angle bracket rule references (`<rulename>`)
- Internationalization support (中文 / English)
- Document formatting functionality (Ctrl+Shift+I / Cmd+Shift+I)
- Modular architecture refactoring for improved code maintainability and extensibility

### Changed

- Improved language server functionality

## [0.2.0] - 2022-12-09

### Added

- Add syntax highlights in markdown codeblocks ([#2])

[#2]: https://github.com/arniu/vscode-abnf/pull/2

## [0.1.2] - 2022-11-26

### Changed

- Remake icon
- Rename samples => example

## [0.1.1] - 2022-11-26

### Added

- Add icon

## [0.1.0] - 2022-11-26

### Added

- ABNF highlight
