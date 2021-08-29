import path from 'path'
import * as vscode from 'vscode'
import fastGlob from 'fast-glob'

export class OpenRelatedFiles {
  public disposable: vscode.Disposable

  private _getActiveDocumentFsPath(): string | undefined {
    return vscode.window.activeTextEditor?.document?.uri?.fsPath
  }

  private _getFileNamesToSearchAndPathToIgnore(
    rootPath: string,
    filePath: string,
  ) {
    const { name } = path.parse(filePath)
    const nameParts = name.split('.')
    const filesNamesToSearch = nameParts.map((_, index) =>
      nameParts.slice(0, index + 1).join('.'),
    )

    const pathToIgnore = path.relative(rootPath, filePath)
    const pathToIgnoreFormatted = pathToIgnore.replace(/\\/g, '/')

    return {
      filesNamesToSearch,
      pathToIgnore: pathToIgnoreFormatted,
    }
  }

  private async _findRelatedFilesAndOpen(
    rootPath: string,
    filesNamesToSearch: string[],
    pathToIgnore?: string,
  ) {
    const filesNames = await fastGlob(
      filesNamesToSearch.map((fileName) => {
        return `**/${fileName}*.*`
      }),
      {
        unique: true,
        cwd: rootPath,
        onlyFiles: true,
        ignore: pathToIgnore
          ? ['node_modules', pathToIgnore]
          : ['node_modules'],
      },
    )

    if (!filesNames.length) {
      vscode.window.showInformationMessage('No related files found')
      return
    }

    const selectedFilePath = await vscode.window.showQuickPick(filesNames, {
      title: 'Select Files To Open',
    })

    if (!selectedFilePath) return

    const uri = vscode.Uri.from({
      scheme: 'file',
      path: path.resolve(rootPath, selectedFilePath),
    })

    await vscode.commands.executeCommand('vscode.open', uri, {
      preview: false,
      preserveFocus: true,
    })
  }

  private async _openRelatedFiles(params?: vscode.Uri) {
    try {
      if (!vscode.workspace.workspaceFolders) {
        vscode.window.showInformationMessage('No folder or workspace opened')
        return
      }

      const [rootFolder] = vscode.workspace.workspaceFolders
      const fileFsPath = params?.fsPath || this._getActiveDocumentFsPath()

      if (fileFsPath) {
        const { filesNamesToSearch, pathToIgnore } =
          this._getFileNamesToSearchAndPathToIgnore(
            rootFolder.uri.fsPath,
            fileFsPath,
          )

        await this._findRelatedFilesAndOpen(
          rootFolder.uri.fsPath,
          filesNamesToSearch,
          pathToIgnore,
        )

        return
      }

      const fileNameToSearch = await vscode.window.showInputBox({
        placeHolder: 'File name without extension. Ex: component',
        prompt: 'Glob patterns are not allowed',
        validateInput(value) {
          if (fastGlob.isDynamicPattern(value)) {
            return 'Glob patterns are not allowed'
          }
        },
      })

      if (!fileNameToSearch) return

      await this._findRelatedFilesAndOpen(rootFolder.uri.fsPath, [
        fileNameToSearch,
      ])
    } catch (e) {
      vscode.window.showErrorMessage(e.message)
    }
  }

  constructor() {
    this.disposable = vscode.commands.registerCommand(
      'vscode-open-files.openRelatedFiles',
      this._openRelatedFiles,
      this,
    )
  }
}
