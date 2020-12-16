import * as vscode from 'vscode'

export class OpenRelatedFiles {
  constructor(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
      'vscode-open-files.openRelatedFiles',
      openRelatedFiles,
    )

    context.subscriptions.push(disposable)
  }
}

async function openRelatedFiles() {
  if (!vscode.workspace.workspaceFolders) {
    return vscode.window.showInformationMessage('No folder or workspace opened')
  }

  const search = await vscode.window.showInputBox({
    placeHolder: 'Glob pattern to find related files. Ex: **/*.js',
    prompt: 'Ex of patterns: *, **, ?, {abc,def}, [Aa], [a-z]',
  })

  if (search) {
    const uriArray = await vscode.workspace.findFiles(
      search,
      '**​/node_modules/**',
    )

    if (!uriArray.length) {
      return vscode.window.showInformationMessage(
        `No files found with: ${search}`,
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
