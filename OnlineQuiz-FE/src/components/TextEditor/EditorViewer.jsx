import { EditorContent, useEditor } from '@tiptap/react';
import { Extensions } from './helper';
import PropTypes from 'prop-types';

export default function EditorViewer({ content }) {
  const editor = useEditor({
    extensions: Extensions,
    editable: false,
    content: content,
  });

  return <EditorContent editor={editor} translate="yes" />;
}

EditorViewer.propTypes = {
  content: PropTypes.string,
};
