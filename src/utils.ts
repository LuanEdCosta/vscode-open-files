import * as vscode from 'vscode'

export const getActiveDocumentFsPath = (): string | undefined => {
  return vscode.window.activeTextEditor?.document?.uri?.fsPath
}
