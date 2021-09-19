# Changelog

This file documents all version releases.

## 0.2.0 - 2021-09-19

**New Features**

- Create command to open all folder files not recursively and another command to open recursively
- The "Open file in default browser" command shows the quick pick dialog to select a HTML or Markdown file to open instead of opening the input box
- Nested node_modules folders are ignored by default when opening all files from a folder
- Show commands in the editor title context menu
- Show commands to open all folder files for files in the explorer context menu

**Fixes**

- Running the "Open all folder files" command in an untitled file does not open a VsCode internal folder anymore
- Running the "Open related files" command in in an untitled file does not shows an info message saying that no related files were found
- Make the "Open related files" command works well with file names starting with a dot or with multiple dots in the name
- The "Open all folder files" command can open files starting with a dot

## 0.1.0 - 2021-08-29

Initial release of the extension.

**Features**

- Open related files
- Open all folder files
- Open file in default browser
