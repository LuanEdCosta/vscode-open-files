import * as vscode from 'vscode'

export class OpenAllFolderFiles {
  constructor(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
      'vscode-open-files.openAllFolderFiles',
      async () => {
        const [rootPathUri] = vscode.workspace.workspaceFolders
          ? vscode.workspace.workspaceFolders
          : []

        const workspacePath = rootPathUri.uri.fsPath

        const uri = vscode.Uri.file(`${workspacePath}/javascript.js`)

        vscode.workspace.openTextDocument(uri).then(
          (document: vscode.TextDocument) => {
            vscode.window.showTextDocument(document, 1, true)
          },
          (error) => {
            vscode.window.showErrorMessage(error.message)
          },
        )
      },
    )

    context.subscriptions.push(disposable)
  }
}
