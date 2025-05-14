import { EditorContent, useEditor } from '@tiptap/react';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { Icons, Extensions } from './helper';
import Placeholder from '@tiptap/extension-placeholder';

export default function TextEditor({ data, onChange, placeholder, className }) {
  const editor = useEditor({
    extensions: [
      ...Extensions,
      Placeholder.configure({
        placeholder: placeholder || 'Nhập nội dung...',
      }),
    ],
    content: data,
    autofocus: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const toggleHeading = useCallback(
    (level) => {
      editor.chain().focus().toggleHeading({ level }).run();
    },
    [editor]
  );

  const toggleBold = useCallback(() => {
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor.chain().focus().toggleUnderline().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleTextAlign = useCallback(
    (align = 'left') => {
      editor.chain().focus().setTextAlign(align).run();
    },
    [editor]
  );

  const toggleStrike = useCallback(() => {
    editor.chain().focus().toggleStrike().run();
  }, [editor]);

  const toggleCode = useCallback(() => {
    editor.chain().focus().toggleCode().run();
  }, [editor]);

  const toggleListBullet = useCallback(() => {
    editor.chain().focus().toggleBulletList().run();
  }, [editor]);

  const toggleOrderedList = useCallback(() => {
    editor.chain().focus().toggleOrderedList().run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={`relative w-full bg-white min-w-[600px] rounded-md border border-[#d1d2de] ${className}`}
    >
      <div className="absolute top-0 left-0 z-10 flex items-center gap-2 w-full h-10 m-0 px-2 py-0 rounded-ss rounded-se bg-strike caret-primary">
        <ToolBarButton
          icon={<Icons.HeadingOne />}
          isActive={editor.isActive('heading', { level: 1 })}
          onClick={() => toggleHeading(1)}
        />

        <ToolBarButton
          icon={<Icons.HeadingTwo />}
          isActive={editor.isActive('heading', { level: 2 })}
          onClick={() => toggleHeading(2)}
        />

        <ToolBarButton
          icon={<Icons.HeadingThree />}
          isActive={editor.isActive('heading', { level: 3 })}
          onClick={() => toggleHeading(3)}
        />

        <div className="w-[1px] h-full py-3">
          <div className="w-full h-full border-r border-slate-400 rounded-md" />
        </div>

        <ToolBarButton
          icon={<Icons.Bold />}
          isActive={editor.isActive('bold')}
          onClick={toggleBold}
        />

        <ToolBarButton
          icon={<Icons.Underline />}
          isActive={editor.isActive('underline')}
          onClick={toggleUnderline}
        />

        <ToolBarButton
          icon={<Icons.Italic />}
          isActive={editor.isActive('italic')}
          onClick={toggleItalic}
        />

        <div className="w-[1px] h-full py-3">
          <div className="w-full h-full border-r border-slate-400 rounded-md" />
        </div>

        <ToolBarButton
          icon={<Icons.TextAlignLeft />}
          isActive={editor.isActive({ textAlign: 'left' })}
          onClick={() => toggleTextAlign('left')}
        />

        <ToolBarButton
          icon={<Icons.TextAlignCenter />}
          isActive={editor.isActive({ textAlign: 'center' })}
          onClick={() => toggleTextAlign('center')}
        />

        <ToolBarButton
          icon={<Icons.TextAlignRight />}
          isActive={editor.isActive({ textAlign: 'right' })}
          onClick={() => toggleTextAlign('right')}
        />

        <div className="w-[1px] h-full py-3">
          <div className="w-full h-full border-r border-slate-400 rounded-md" />
        </div>

        <ToolBarButton
          icon={<Icons.Strikethrough />}
          isActive={editor.isActive('strike')}
          onClick={toggleStrike}
        />

        <ToolBarButton
          icon={<Icons.BulletList />}
          isActive={editor.isActive('bulletList')}
          onClick={toggleListBullet}
        />
        <ToolBarButton
          icon={<Icons.OrderedList />}
          isActive={editor.isActive('orderedList')}
          onClick={toggleOrderedList}
        />

        <ToolBarButton
          icon={<Icons.Code />}
          isActive={editor.isActive('code')}
          onClick={toggleCode}
        />
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

function ToolBarButton({ icon, isActive, onClick, disabled }) {
  return (
    <button
      type="button"
      className={`toolbar-button ${isActive ? 'active' : ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}

TextEditor.propTypes = {
  data: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

ToolBarButton.propTypes = {
  icon: PropTypes.node.isRequired,
  isActive: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};
