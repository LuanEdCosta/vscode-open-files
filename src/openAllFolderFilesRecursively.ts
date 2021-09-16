import * as vscode from 'vscode'

const openAllFolderFilesRecursively = (uri: vscode.Uri) => {
  vscode.commands.executeCommand('vscode-open-files.openAllFolderFiles', uri, {
    recursive: true,
  })
}

export { openAllFolderFilesRecursively }
