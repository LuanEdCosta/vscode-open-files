import * as vscode from 'vscode'

export class OpenFileInBrowser {
  constructor(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
      'vscode-open-files.openFileInBrowser',
      async () => {},
    )

    context.subscriptions.push(disposable)
  }
}
