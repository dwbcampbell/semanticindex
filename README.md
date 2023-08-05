
# Semantic Index: Document Embeddings Database Extension for VS Code

This extension builds a vector database for documents in a workspace using OpenAI's language embeddings and allows for semantic searching within the documents.

## Features

- Builds an index of vector representations for all documents in the workspace.
- Allows for semantic searching of text snippets within the vector index.
- Provides an easy-to-use interface in the form of a custom Tree Data Provider to display search results.

## Usage

1. After installing the extension, use the command "Build Index" to create the vector index of your workspace documents.
2. Once the index is built, use the command "Search Index" to perform a semantic search. Select the text you want to search for and run the command.

## Requirements

The extension requires the OpenAI embeddings and Langchain packages to function. These packages will be automatically installed with the extension.

## Extension Commands

This extension contributes the following commands:

- `semanticindex.buildIndex`: Build a vector index from the workspace documents.
- `semanticindex.searchIndex`: Perform a semantic search within the built index.

## Known Issues

If you encounter any bugs or have feature requests, please file them in the [issue tracker](https://github.com/dwbcampbell/semanticindex/issues).

## Release Notes

### 0.1.0

Initial release of Semantic Index

## Contributors

[Douglas Campbell](https://github.com/dwbcampbell)

## License

[MIT](LICENSE)

