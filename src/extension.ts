import * as vscode from 'vscode'

import { openRelatedFiles } from './openRelatedFiles'
import { openAllFolderFiles } from './openAllFolderFiles'
import { openFileInDefaultBrowser } from './openFileInDefaultBrowser'
import { openAllFolderFilesRecursively } from './openAllFolderFilesRecursively'

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'vscode-open-files.openRelatedFiles',
      openRelatedFiles,
    ),
    vscode.commands.registerCommand(
      'vscode-open-files.openAllFolderFiles',
      openAllFolderFiles,
    ),
    vscode.commands.registerCommand(
      'vscode-open-files.openFileInDefaultBrowser',
      openFileInDefaultBrowser,
    ),
    vscode.commands.registerCommand(
      'vscode-open-files.openAllFolderFilesRecursively',
      openAllFolderFilesRecursively,
    ),
  )
}

export function deactivate() {}
