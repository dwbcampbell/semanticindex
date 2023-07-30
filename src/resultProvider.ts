import * as vscode from 'vscode';
import * as path from 'path';

export class SearchResultProvider implements vscode.TreeDataProvider<SearchResult> {
    private _onDidChangeTreeData: vscode.EventEmitter<SearchResult | undefined | null | void> = new vscode.EventEmitter<SearchResult | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<SearchResult | undefined | null | void> = this._onDidChangeTreeData.event;
    
    constructor(private searchResults: SearchResult[]) {}
    
    setItems(items: string[]) {
        this.searchResults = items.map(item => new SearchResult(item, vscode.TreeItemCollapsibleState.None));
        this._onDidChangeTreeData.fire();
    }
    
    getTreeItem(element: SearchResult): vscode.TreeItem {
        return element;
    }
    
    getChildren(element?: SearchResult): Thenable<SearchResult[]> {
        if (element) {
            return Promise.resolve([]);
        } else {
            return Promise.resolve(this.searchResults);
        }
    }
}

export class SearchResult extends vscode.TreeItem {
    constructor(
        public readonly fileName: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
        ) {
            super(path.basename(fileName), collapsibleState);
            this.tooltip = `${this.label}`;
            this.description = fileName;

            this.command = {
                command: 'vscode.open',
                title: 'Open File',
                arguments: [vscode.Uri.file(fileName)],
                tooltip: 'Opens a file in a new editor pane'
            };
        }
        
        iconPath = {
            light: path.join(__filename, '..', '..', 'resources', 'light', 'document.svg'),
            dark: path.join(__filename, '..', '..', 'resources', 'dark', 'document.svg')
        };
    }
