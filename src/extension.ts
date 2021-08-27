import * as vscode from 'vscode'

import { OpenRelatedFiles } from './openRelatedFiles'
import { OpenFileInBrowser } from './openFileInBrowser'
import { OpenAllFolderFiles } from './openAllFolderFiles'

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    new OpenRelatedFiles().disposable,
    new OpenFileInBrowser().disposable,
    new OpenAllFolderFiles().disposable,
  )
}

export function deactivate() {}
