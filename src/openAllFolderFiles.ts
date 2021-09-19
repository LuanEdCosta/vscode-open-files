import * as vscode from 'vscode'
import fastGlob from 'fast-glob'
import path from 'path'

import { getActiveDocumentUri, getRootFolderUri } from './utils'

interface OpenAllFolderFilesOptions {
  recursive: boolean
}

const findFilesAndOpen = async (
  folderPath: string,
  options?: OpenAllFolderFilesOptions,
) => {
  const rootFolderUri = getRootFolderUri() as vscode.Uri
  const shouldFindFilesRecursively = options?.recursive || false
  const folderFsPath = path.resolve(rootFolderUri.fsPath, folderPath)

  const fileNames = await fastGlob(shouldFindFilesRecursively ? '**/*' : '*', {
    cwd: folderFsPath,
    onlyFiles: true,
    ignore: ['**/node_modules/**'],
  })

  if (!fileNames.length) {
    vscode.window.showInformationMessage('The selected folder is empty')
    return
  }

  fileNames.forEach((fileName) => {
    const filePath = path.resolve(folderFsPath, fileName)
    const fileUri = vscode.Uri.file(filePath)
    vscode.commands.executeCommand('vscode.open', fileUri, {
      preview: false,
      preserveFocus: true,
    })
  })
}

const selectFolderToOpen = async (options?: OpenAllFolderFilesOptions) => {
  const rootFolderUri = getRootFolderUri() as vscode.Uri

  const folderNames = await fastGlob('**', {
    cwd: rootFolderUri.fsPath,
    onlyDirectories: true,
    ignore: ['**/node_modules/**'],
  })

  const selectedFolder = await vscode.window.showQuickPick(folderNames, {
    title: 'Select a folder',
  })

  if (!selectedFolder) return

  await findFilesAndOpen(selectedFolder, options)
}

const openAllFolderFiles = async (
  uri?: vscode.Uri,
  options?: OpenAllFolderFilesOptions,
) => {
  try {
    if (!vscode.workspace.workspaceFolders) {
      vscode.window.showInformationMessage('No folder or workspace opened')
      return
    }

    const activeDocumentUri = getActiveDocumentUri()

    let fsPath = ''

    if (uri && uri.scheme !== 'untitled') {
      const { type } = await vscode.workspace.fs.stat(uri)
      const isFile = type === vscode.FileType.File
      fsPath = isFile ? path.dirname(uri.fsPath) : uri.fsPath
    } else if (activeDocumentUri && activeDocumentUri.scheme !== 'untitled') {
      fsPath = path.dirname(activeDocumentUri.fsPath)
    }

    if (fsPath) {
      const rootFolderUri = getRootFolderUri() as vscode.Uri
      const folderPath = path.relative(rootFolderUri.fsPath, fsPath)
      await findFilesAndOpen(folderPath, options)
      return
    }

    await selectFolderToOpen(options)
  } catch (e: any) {
    vscode.window.showErrorMessage(e.message)
  }
}

export { openAllFolderFiles }
