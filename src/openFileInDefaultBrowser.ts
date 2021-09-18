import * as vscode from 'vscode'
import fastGlob from 'fast-glob'
import open from 'open'
import path from 'path'

import { getActiveDocumentFsPath, getRootFolderUri } from './utils'

const canOpenInDefaultBrowser = (fsPath: string | undefined): boolean => {
  return ['.html', '.md'].some((ext) => !!fsPath?.includes(ext))
}

const selectFileToOpenInTheBrowser = async () => {
  const rootFolderUri = getRootFolderUri()

  if (!rootFolderUri) {
    vscode.window.showInformationMessage('No folder or workspace opened')
    return
  }

  const fileNames = await fastGlob('**/*.{html,md}', {
    cwd: rootFolderUri.fsPath,
    onlyFiles: true,
    ignore: ['**/node_modules/**'],
  })

  if (fileNames.length === 0) {
    vscode.window.showInformationMessage('No HTML or Markdown files found')
    return
  }

  const selectedFileName = await vscode.window.showQuickPick(fileNames, {
    title: 'Select a file',
  })

  if (selectedFileName) {
    const filePath = path.resolve(rootFolderUri.fsPath, selectedFileName)
    await open(filePath)
  }
}

const openFileInDefaultBrowser = async (uri?: vscode.Uri) => {
  try {
    const fsPath = uri?.fsPath || getActiveDocumentFsPath()

    if (fsPath && canOpenInDefaultBrowser(fsPath)) {
      await open(fsPath)
      return
    }

    await selectFileToOpenInTheBrowser()
  } catch (e: any) {
    vscode.window.showErrorMessage(e.message)
  }
}

export { openFileInDefaultBrowser }
