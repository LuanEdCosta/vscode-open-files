import path from 'path'
import * as vscode from 'vscode'
import fastGlob from 'fast-glob'
export class OpenAllFolderFiles {
  public disposable: vscode.Disposable

  private async _findFilesAndOpen(folderName: string) {
    const uriArray = await vscode.workspace.findFiles(
      `${folderName}/**`,
      '**​/node_modules/**',
    )

    if (!uriArray.length) {
      vscode.window.showInformationMessage('The selected folder is empty')
      return
    }

    uriArray.forEach((uri) => {
      vscode.commands.executeCommand('vscode.open', uri, {
        preview: false,
        preserveFocus: true,
      })
    })
  }

  private async _selectFolderToOpen() {
    const [rootFolder] = vscode.workspace.workspaceFolders || []

    if (!rootFolder) return

    const folderNames = await fastGlob('**', {
      cwd: rootFolder.uri.fsPath,
      onlyDirectories: true,
      ignore: ['**/node_modules/**'],
    })

    const selectedFolder = await vscode.window.showQuickPick(folderNames, {
      title: 'Select a Folder',
    })

    if (!selectedFolder) return

    await this._findFilesAndOpen(selectedFolder)
  }

  private async _openAllFolderFiles(uri?: vscode.Uri) {
    try {
      if (!vscode.workspace.workspaceFolders) {
        vscode.window.showInformationMessage('No folder or workspace opened')
        return
      }

      if (uri) {
        const [rootFolder] = vscode.workspace.workspaceFolders
        const folderPath = path.relative(rootFolder.uri.fsPath, uri.fsPath)
        await this._findFilesAndOpen(folderPath)
        return
      }

      await this._selectFolderToOpen()
    } catch (e: any) {
      vscode.window.showErrorMessage(e.message)
    }
  }

  constructor() {
    this.disposable = vscode.commands.registerCommand(
      'vscode-open-files.openAllFolderFiles',
      this._openAllFolderFiles,
      this,
    )
  }
}
