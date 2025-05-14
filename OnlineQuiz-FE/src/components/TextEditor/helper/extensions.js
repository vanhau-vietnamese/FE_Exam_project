import Bold from '@tiptap/extension-bold';
import Code from '@tiptap/extension-code';
import Document from '@tiptap/extension-document';
import Heading from '@tiptap/extension-heading';
import History from '@tiptap/extension-history';
import Italic from '@tiptap/extension-italic';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Strike from '@tiptap/extension-strike';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';

export default [
  Document,
  History,
  Paragraph,
  Text,
  Bold,
  Underline,
  Italic,
  Strike,
  Code,
  ListItem,
  Heading.configure({ levels: [1, 2, 3] }),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  BulletList.configure({ HTMLAttributes: { class: 'list-disc pl-4' } }),
  OrderedList.configure({ HTMLAttributes: { class: 'list-decimal pl-4' } }),
];
