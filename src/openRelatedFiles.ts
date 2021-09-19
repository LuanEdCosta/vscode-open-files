import path from 'path'
import * as vscode from 'vscode'
import fastGlob from 'fast-glob'

import { getActiveDocumentUri, getRootFolderUri } from './utils'

const getFileNamesToSearchAndPathToIgnore = (
  rootPath: string,
  filePath: string,
) => {
  const { name } = path.parse(filePath)
  const nameParts = name.split('.').filter((namePart) => !!namePart.trim())

  const filesNamesToSearch = nameParts.map((_, index) =>
    nameParts.slice(0, index + 1).join('.'),
  )

  const pathToIgnore = path.relative(rootPath, filePath)
  const pathToIgnoreFormatted = pathToIgnore.replace(/\\/g, '/')

  return {
    filesNamesToSearch,
    pathToIgnore: pathToIgnoreFormatted,
  }
}

const findRelatedFilesAndOpen = async (
  rootPath: string,
  filesNamesToSearch: string[],
  pathToIgnore?: string,
) => {
  const filesNames = await fastGlob(
    filesNamesToSearch.map((fileName) => {
      return `**/${fileName}*`
    }),
    {
      unique: true,
      cwd: rootPath,
      onlyFiles: true,
      ignore: pathToIgnore
        ? ['**/node_modules/**', pathToIgnore]
        : ['**/node_modules/**'],
    },
  )

  if (!filesNames.length) {
    vscode.window.showInformationMessage('No related files found')
    return
  }

  const selectedFilePath = await vscode.window.showQuickPick(filesNames, {
    title: 'Select files to open',
  })

  if (!selectedFilePath) return

  const uri = vscode.Uri.from({
    scheme: 'file',
    path: path.resolve(rootPath, selectedFilePath),
  })

  await vscode.commands.executeCommand('vscode.open', uri, {
    preview: false,
    preserveFocus: true,
  })
}

const openRelatedFiles = async (uri?: vscode.Uri) => {
  try {
    if (!vscode.workspace.workspaceFolders) {
      vscode.window.showInformationMessage('No folder or workspace opened')
      return
    }

    const rootFolderUri = getRootFolderUri() as vscode.Uri
    const fileUri = uri || getActiveDocumentUri()

    if (fileUri && fileUri?.scheme !== 'untitled') {
      const { filesNamesToSearch, pathToIgnore } =
        getFileNamesToSearchAndPathToIgnore(
          rootFolderUri.fsPath,
          fileUri.fsPath,
        )

      await findRelatedFilesAndOpen(
        rootFolderUri.fsPath,
        filesNamesToSearch,
        pathToIgnore,
      )

      return
    }

    const fileNameToSearch = await vscode.window.showInputBox({
      placeHolder: 'File name without extension. Ex: component',
      prompt: 'Glob patterns are not allowed',
      validateInput(value) {
        if (fastGlob.isDynamicPattern(value)) {
          return 'Glob patterns are not allowed'
        }
      },
    })

    if (!fileNameToSearch) return

    await findRelatedFilesAndOpen(rootFolderUri.fsPath, [fileNameToSearch])
  } catch (e: any) {
    vscode.window.showErrorMessage(e.message)
  }
}

export { openRelatedFiles }
