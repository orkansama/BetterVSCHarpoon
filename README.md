# BetterVSCHarpoon README

![Open VSX Downloads](https://img.shields.io/open-vsx/dt/OrkanGoekcen/BetterVSCHarpoon?color=yellow)
![GitHub License](https://img.shields.io/github/license/orkansama/BetterVSCHarpoon)

A port of ThePrimeagen's Harpoon, brought to VS Code. Mark files, jump between them instantly with dedicated keybindings.<br>
No menus, no fuzzy search, just the files you're actively working on, one keystroke away.<br>
Your marks live in a plain text file you can open and edit directly, not some fancy custom menu (I know you use vim motions).

Two modes to choose from: <br>
*  **Relative file path mode** — marks stay valid as you move around the project (paths relative to the [workspace root](https://code.visualstudio.com/docs/editing/workspaces/workspaces))
*  **Whole file mode** — pins the file by its full path

Currently, only one global list is supported.

<img width="483" height="144" alt="grafik" src="https://github.com/user-attachments/assets/42a18843-0b47-45c1-ba34-76c677d8c531" />
<img width="530" height="112" alt="grafik" src="https://github.com/user-attachments/assets/e6846e68-86fe-4a15-b0cb-0649e694f2f3" />

> Keep the last line of the marks file empty. Without it, the next mark you add won't be written on its own line.

## Motivation

There are plenty of Harpoon extensions out there already but most are either unmaintained, mark the exact line you were on (not just the file), or simply weren't what I wanted: something simple.

## Features
- **Add files** to your Harpoon list with a single keybinding
- **Jump instantly** to any of up to 9 marked files via dedicated shortcuts
- **Open the Harpoon file** directly to view or edit your marks as plain text
- **Change the file save mode** between relative file path and whole file path

## Extension Settings

| Command | Description | Default |
|---|---|---|
| `bettervscharpoon.open_harpoon_list` | Open the Harpoon file | none |
| `bettervscharpoon.add_to_harpoon_list` | Add the current file to the Harpoon list | none |
| `bettervscharpoon.navigate_1` | Jump to marked file 1 (goes up to `navigate_9`) | none |
| `BetterVSCHarpoon.DisableRelativeFilePath` | Disable relative file path mode and use whole file path instead | `false` |

None of these commands come with a default keybinding — assign the ones you actually use.

## Dependencies

None

## Known Issues
- The last line of the marks file must be left **empty**, otherwise the last entry won't be picked up correctly. I'll fix this properly at some point, but I need the extension working for myself right now, so it stays as is for the time being.

## Contributing

Found a bug or have an idea for a feature? Issues and pull requests are welcome on [GitHub](https://github.com/orkansama/BetterVSCHarpoon).

This is a small side project I built mainly for myself, so response times might vary but feedback is always appreciated.
