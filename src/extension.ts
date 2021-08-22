import * as vscode from 'vscode'

import { OpenRelatedFiles } from './openRelatedFiles'
import { OpenFileInBrowser } from './openFileInBrowser'
import { OpenAllFolderFiles } from './openAllFolderFiles'
import { RelatedFilesTreeView } from './relatedFilesTreeView'

export function activate(context: vscode.ExtensionContext) {
  new OpenRelatedFiles(context)
  new OpenFileInBrowser(context)
  new OpenAllFolderFiles(context)
  new RelatedFilesTreeView(context)
}

export function deactivate() {}
