import * as vscode from 'vscode'

import { OpenRelatedFiles } from './openRelatedFiles'
import { OpenAllFolderFiles } from './openAllFolderFiles'
import { OpenFileInDefaultBrowser } from './openFileInDefaultBrowser'

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    new OpenRelatedFiles().disposable,
    new OpenAllFolderFiles().disposable,
    new OpenFileInDefaultBrowser().disposable,
  )
}

export function deactivate() {}
