import * as vscode from 'vscode'
import open from 'open'

import { getActiveDocumentFsPath } from './utils'

const canOpenInDefaultBrowser = (fsPath: string | undefined): boolean => {
  return ['.html', '.md'].some((ext) => !!fsPath?.includes(ext))
}

const openFileInDefaultBrowser = async (uri?: vscode.Uri) => {
  try {
    const fsPath = uri?.fsPath || getActiveDocumentFsPath()

    if (fsPath && canOpenInDefaultBrowser(fsPath)) {
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

    if (foundFileUri && canOpenInDefaultBrowser(foundFileUri.fsPath)) {
      await open(foundFileUri.fsPath)
      return
    }

    vscode.window.showInformationMessage(
      `The file "${typedFilePath}" was not found`,
    )
  } catch (e: any) {
    vscode.window.showErrorMessage(e.message)
  }
}

export { openFileInDefaultBrowser }
