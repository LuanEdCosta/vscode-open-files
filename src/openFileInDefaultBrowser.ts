import * as vscode from 'vscode'

type Params = {
  fsPath: string
  path: string
  scheme: string
}

export class OpenFileInDefaultBrowser {
  disposable: vscode.Disposable

  private async _openFileInDefaultBrowser(params?: Params) {
    if (params) {
      await vscode.env.openExternal(vscode.Uri.parse(`file://${params.path}`))
      return
    }

    if (!vscode.window.activeTextEditor) {
      return vscode.window.showInformationMessage(
        'You need to open a file and focus it in the VsCode to execute this command',
      )
    }

    const openedFileUri = vscode.window.activeTextEditor.document.uri
    await vscode.env.openExternal(openedFileUri)
  }

  constructor() {
    this.disposable = vscode.commands.registerCommand(
      'vscode-open-files.openFileInDefaultBrowser',
      this._openFileInDefaultBrowser,
    )
  }
}
