import * as vscode from 'vscode';

import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

// following modules must be imported with 'require'
const { directoryLoader } = require('langchain/document_loaders/fs/directory');
const { textLoader } = require('langchain/document_loaders/fs/text');

let vectorStore: FaissStore;

export async function buildIndex() {

    const workspaceFolder = vscode.workspace.workspaceFolders![0].uri.fsPath;
    
    const loader = new directoryLoader.DirectoryLoader(
        workspaceFolder,
        {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            ".md": (path: string) => new textLoader.TextLoader(path),
        }
    ); 

    const docs = await loader.load();

    vectorStore = await FaissStore.fromDocuments(
        docs,
        new OpenAIEmbeddings()
      );

      vscode.window.showInformationMessage('Index built!');
}
    
export function searchIndex() {

    if (!vectorStore) {
        vscode.window.showErrorMessage('Cannot search -- Ιndex not built');
        return;
      }

    vscode.window.showInformationMessage('Search index from semanticindex2!');
}