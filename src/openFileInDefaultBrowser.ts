import * as vscode from 'vscode'
import open from 'open'
export class OpenFileInDefaultBrowser {
  public disposable: vscode.Disposable

  private _getActiveDocumentFsPath(): string | undefined {
    return vscode.window.activeTextEditor?.document?.uri?.fsPath
  }

  private _canOpenInDefaultBrowser(fsPath: string | undefined): boolean {
    return ['.html', '.md'].some((ext) => !!fsPath?.includes(ext))
  }

  private async _openFileInDefaultBrowser(params?: vscode.Uri) {
    try {
      const fsPath = params?.fsPath || this._getActiveDocumentFsPath()

      if (fsPath && this._canOpenInDefaultBrowser(fsPath)) {
        await open(fsPath)
        return
      }

      const typedFilePath = await vscode.window.showInputBox({
        placeHolder: 'Type the file path. Ex: public/index.html',
        prompt: 'You can only open one HTML or Markdown file',
      })

      if (!typedFilePath) return

      const [foundFileUri] = await vscode.workspace.findFiles(
        typedFilePath.trim(),
        '**​/node_modules/**',
        1,
      )

      if (foundFileUri && this._canOpenInDefaultBrowser(foundFileUri.fsPath)) {
        await open(foundFileUri.fsPath)
        return
      }

      vscode.window.showInformationMessage(
        `The file "${typedFilePath}" was not found`,
      )
    } catch (e) {
      vscode.window.showErrorMessage(e.message)
    }
  }

  constructor() {
    this.disposable = vscode.commands.registerCommand(
      'vscode-open-files.openFileInDefaultBrowser',
      this._openFileInDefaultBrowser,
      this,
    )
  }
}
