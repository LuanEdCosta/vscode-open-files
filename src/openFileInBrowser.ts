import * as vscode from 'vscode'

type Params = {
  fsPath: string
  path: string
  scheme: string
}

export class OpenFileInBrowser {
  constructor(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
      'vscode-open-files.openFileInBrowser',
      openFileInBrowser,
    )

    context.subscriptions.push(disposable)
  }
}

async function openFileInBrowser(params?: Params) {
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
