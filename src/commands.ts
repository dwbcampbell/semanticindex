import * as vscode from 'vscode';

import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SearchResult, SearchResultProvider } from './resultProvider';

// following modules must be imported with 'require'
const { DirectoryLoader } = require('langchain/document_loaders/fs/directory');
const { TextLoader } = require('langchain/document_loaders/fs/text');

let vectorStore: FaissStore;

export async function buildIndex() {

    const workspaceFolder = vscode.workspace.workspaceFolders![0].uri.fsPath;
    
    const loader = new DirectoryLoader(
        workspaceFolder,
        {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            ".md": (path: string) => new TextLoader(path),
        }
    ); 

    const docs = await loader.load();

    vectorStore = await FaissStore.fromDocuments(
        docs,
        new OpenAIEmbeddings()
    );

    const context = await vscode.commands.executeCommand("getContext") as vscode.ExtensionContext;

    if (!context.storageUri) {
      return;
    }

    vectorStore.save(context.storageUri.fsPath + "/index.faiss");

    console.log(context.storageUri.fsPath);

    vscode.window.showInformationMessage('Index built!');
}
    
export async function searchIndex(provider: SearchResultProvider) {

    if (!vectorStore) {
        vscode.window.showErrorMessage('Cannot search -- Ιndex not built');
        return;
    }
      
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const selection = editor.selection;
        const text = editor.document.getText(selection);

        if (text) {
            const results = await vectorStore.similaritySearch(text, 5);
            const items = results.map((x) => x.metadata.source);
            provider.setItems(items);

            vscode.window.showInformationMessage("Results: " + results.length);
        } else {
            vscode.window.showErrorMessage('No text selected');
        }
    }
}