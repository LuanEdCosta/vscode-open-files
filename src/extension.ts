import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
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
          vscode.window.showTextDocument(document, 1, false)
        },
        (error: any) => {
          console.error(error)
        },
      )
    },
  )

  context.subscriptions.push(disposable)
}

export function deactivate() {}
