import * as vscode from 'vscode';

import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SearchResult, SearchResultProvider } from './resultProvider';

// following modules must be imported with 'require'
const { DirectoryLoader } = require('langchain/document_loaders/fs/directory');
const { TextLoader } = require('langchain/document_loaders/fs/text');

var vectorStore: FaissStore | null = null;

export async function buildIndex() {

    if (vscode.workspace.workspaceFolders === undefined) {
        vscode.window.showErrorMessage('No workspace open');
        return;
    }

    const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
    
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

    // Save the index to the extension context storage

    const context = await vscode.commands.executeCommand("getContext") as vscode.ExtensionContext;

    if (context.storageUri === undefined) {
      return;
    }

    vectorStore.save(context.storageUri.fsPath + "/index.faiss");

    console.log("Saving index: " + context.storageUri.fsPath);

    vscode.window.showInformationMessage('Index built!');
}
    
export async function searchIndex(provider: SearchResultProvider) {

    if (vectorStore === null) {
        const context = await vscode.commands.executeCommand("getContext") as vscode.ExtensionContext;

        if (context.storageUri === undefined) {
            vscode.window.showErrorMessage('Ιndex not built for this workspace');
            return;
        }

        // if index file exists, load it
        const indexFile = context.storageUri.fsPath + "/index.faiss";

        try {
            await vscode.workspace.fs.stat(vscode.Uri.file(indexFile));
            vectorStore = await FaissStore.load(indexFile, new OpenAIEmbeddings());
        }
        catch (e) {
            vscode.window.showErrorMessage('Ιndex not built for this workspace');
            return;
        }
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

export async function deleteIndex(provider: SearchResultProvider) {
    const context = await vscode.commands.executeCommand("getContext") as vscode.ExtensionContext;

    if (context.storageUri === undefined) {
        vscode.window.showErrorMessage('Ιndex not built for this workspace');
        return;
    }

    // if index file exists, delete it
    const indexFile = context.storageUri.fsPath + "/index.faiss";

    try {
        console.log("Deleting index: " + indexFile);
        await vscode.workspace.fs.stat(vscode.Uri.file(indexFile));

        await vscode.workspace.fs.delete(vscode.Uri.file(indexFile), {recursive: true});

        vectorStore = null;

        if (provider) {
            provider.setItems([]);
        }

        vscode.window.showInformationMessage('Index deleted!');
    }
    catch (e) {
        vscode.window.showErrorMessage('Ιndex not built for this workspace');
    }
}