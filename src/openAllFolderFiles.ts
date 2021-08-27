import * as vscode from 'vscode'

export class OpenAllFolderFiles {
  public disposable: vscode.Disposable

  private async _openAllFolderFiles() {
    if (!vscode.workspace.workspaceFolders) {
      return vscode.window.showInformationMessage(
        'No folder or workspace opened',
      )
    }

    const search = await vscode.window.showInputBox({
      placeHolder: 'Folder path (allow nested folders). Ex: src/components',
      prompt: 'To open all files in the root directory type: **',
      validateInput(value) {
        const firstChar = value.trim().charAt(0)

        if (firstChar === '.' || firstChar === '/' || firstChar === '\\') {
          return 'Do not put slash or a dot at the beginning of the path'
        }

        return null
      },
    })

    const trimmedSearch = search?.trim()

    if (trimmedSearch) {
      const lastChar = trimmedSearch.charAt(trimmedSearch.length - 1)
      const hasSlashAtTheEnd = lastChar === '/' || lastChar === '\\'

      const uriArray = await vscode.workspace.findFiles(
        `${trimmedSearch}${hasSlashAtTheEnd ? '**' : '/**'}`,
        '**​/node_modules/**',
      )

      if (!uriArray.length) {
        return vscode.window.showInformationMessage(
          `No files found inside the folder "${trimmedSearch}"`,
        )
      }

      uriArray.forEach((uri) => {
        vscode.workspace.openTextDocument(uri).then(
          (document: vscode.TextDocument) => {
            vscode.window.showTextDocument(document, {
              preview: false,
              preserveFocus: true,
              viewColumn: 1,
            })
          },
          (error) => {
            vscode.window.showErrorMessage(error.message)
          },
        )
      })
    }
  }

  constructor() {
    this.disposable = vscode.commands.registerCommand(
      'vscode-open-files.openAllFolderFiles',
      this._openAllFolderFiles,
    )
  }
}
