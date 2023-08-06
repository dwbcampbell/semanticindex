// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { buildIndex, searchIndex, deleteIndex } from './commands';
import { SearchResultProvider as SearchResultProvider } from './resultProvider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const searchResultProvider = new SearchResultProvider([]);
	vscode.window.registerTreeDataProvider('similarity', searchResultProvider);

	context.subscriptions.push(vscode.commands.registerCommand('semanticindex.buildIndex', buildIndex));
	context.subscriptions.push(vscode.commands.registerCommand('semanticindex.searchIndex', () => {
			searchIndex(searchResultProvider);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('semanticindex.deleteIndex', deleteIndex));
	context.subscriptions.push(vscode.commands.registerCommand('getContext', () => context));
}

// This method is called when your extension is deactivated
export function deactivate() {}
