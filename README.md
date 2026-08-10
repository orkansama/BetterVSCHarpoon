# BetterVSCHarpoon README

A port of ThePrimeagen's Harpoon, brought to VS Code. Mark files, jump between them instantly with dedicated keybindings.<br>
No menus, no fuzzy search, just the files you're actively working on, one keystroke away.<br>
Your marks live in a plain text file you can open and edit directly, not some fancy custom menu (I know you use vim motions).

> Leave the last line of the marks file **empty**. Otherwise the last entry won't be picked up correctly.

## Motivation

There are plenty of Harpoon extensions out there already — but most are either unmaintained, mark the exact line you were on (not just the file), or simply weren't what I wanted: something simple.

## Features

- **Add files** to your Harpoon list with a single keybinding
- **Jump instantly** to any of up to 9 marked files via dedicated shortcuts
- **Open the Harpoon file** directly to view or edit your marks as plain text

## Extension Settings

| Command | Description |
|---|---|
| `bettervscharpoon.open_harpoon_list` | Open the Harpoon file |
| `bettervscharpoon.add_to_harpoon_list` | Add the current file to the Harpoon list |
| `bettervscharpoon.navigate_1` | Jump to marked file 1 (goes up to `navigate_9`) |

None of these commands come with a default keybinding — assign the ones you actually use.

## Dependencies

None

## Known Issues

- The last line of the marks file must be left **empty**, otherwise the last entry won't be picked up correctly. I'll fix this properly at some point, but I need the extension working for myself right now, so it stays as is for the time being.

## Contributing

Found a bug or have an idea for a feature? Issues and pull requests are welcome on [GitHub](https://github.com/orkansama/BetterVSCHarpoon).

This is a small side project I built mainly for myself, so response times might vary — but feedback is always appreciated.