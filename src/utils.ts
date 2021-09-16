import * as vscode from 'vscode'

export const getActiveDocumentFsPath = (): string | undefined => {
  return vscode.window.activeTextEditor?.document?.uri?.fsPath
}

export const getRootFolderUri = (): vscode.Uri | undefined => {
  if (vscode.workspace.workspaceFolders) {
    const [rootFolder] = vscode.workspace.workspaceFolders
    return rootFolder.uri
  }
}
