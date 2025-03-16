import React, { useState } from 'react';
import { MDXEditor, UndoRedo,tablePlugin,InsertSandpack,listsPlugin , ListsToggle, BoldItalicUnderlineToggles, BlockTypeSelect, toolbarPlugin ,Select, headingsPlugin, CodeToggle, imagePlugin, InsertImage, linkPlugin ,InsertCodeBlock, linkDialogPlugin, InsertTable, CreateLink } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css';

export default function RichTextEditor() {
 

  return (
    <MDXEditor markdown={''} plugins={[
        toolbarPlugin({
          toolbarClassName: 'my-classname',
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BlockTypeSelect/>
              <BoldItalicUnderlineToggles />
              <InsertSandpack/>
              <InsertImage />
              <InsertTable />
              <CreateLink/>
              <CodeToggle/>
              <InsertCodeBlock/>
              <ListsToggle/>
             
            </>
          )
        }),listsPlugin(), headingsPlugin(),
       
          imagePlugin({
            imageUploadHandler: () => {
              return Promise.resolve('https://picsum.photos/200/300')
            },
            imageAutocompleteSuggestions: ['https://picsum.photos/200/300', 'https://picsum.photos/200']
          }),tablePlugin(),
          linkPlugin(),   linkDialogPlugin({
            linkAutocompleteSuggestions: ['https://virtuoso.dev', 'https://mdxeditor.dev']
          })
      ]} />
  );
}
