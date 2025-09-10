import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { 
  BoldIcon, 
  ItalicIcon,
  StrikethroughIcon,
  ListBulletIcon,
  NumberedListIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

// Import CSS styles
import '../../../styles/prosemirror.css';

const PostEditor = ({ value, onChange, placeholder = "Chia sẻ suy nghĩ của bạn..." }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none min-h-[200px] p-4',
        'data-placeholder': placeholder,
      },
    },
  });

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-lg p-4">
        <div className="animate-pulse">Loading editor...</div>
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL:', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 p-2">
        <div className="flex flex-wrap items-center gap-1">
          {/* Text Formatting */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
            }`}
            title="Bold (Ctrl+B)"
          >
            <BoldIcon className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
            }`}
            title="Italic (Ctrl+I)"
          >
            <ItalicIcon className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('strike') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
            }`}
            title="Strikethrough"
          >
            <StrikethroughIcon className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          {/* Headings */}
          <select
            onChange={(e) => {
              const level = parseInt(e.target.value);
              if (level === 0) {
                editor.chain().focus().setParagraph().run();
              } else {
                editor.chain().focus().toggleHeading({ level }).run();
              }
            }}
            value={
              editor.isActive('heading', { level: 1 }) ? 1 :
              editor.isActive('heading', { level: 2 }) ? 2 :
              editor.isActive('heading', { level: 3 }) ? 3 : 0
            }
            className="px-3 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
          >
            <option value={0}>Paragraph</option>
            <option value={1}>Heading 1</option>
            <option value={2}>Heading 2</option>
            <option value={3}>Heading 3</option>
          </select>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          {/* Lists */}
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
            }`}
            title="Bullet List"
          >
            <ListBulletIcon className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('orderedList') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
            }`}
            title="Numbered List"
          >
            <NumberedListIcon className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          {/* Alignment */}
          <select
            onChange={(e) => {
              const alignment = e.target.value;
              editor.chain().focus().setTextAlign(alignment).run();
            }}
            value={
              editor.isActive({ textAlign: 'center' }) ? 'center' :
              editor.isActive({ textAlign: 'right' }) ? 'right' :
              editor.isActive({ textAlign: 'justify' }) ? 'justify' : 'left'
            }
            className="px-3 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justify</option>
          </select>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          {/* Text Color */}
          <div className="flex items-center space-x-1">
            <label className="text-xs text-gray-500">Color:</label>
            <input
              type="color"
              onInput={(event) => editor.chain().focus().setColor(event.target.value).run()}
              value={editor.getAttributes('textStyle').color || '#000000'}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              title="Text Color"
            />
          </div>

          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('highlight') ? 'bg-yellow-100' : ''
            }`}
            title="Highlight"
          >
            <div className="w-4 h-4 bg-yellow-300 rounded"></div>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          {/* Link */}
          <button
            onClick={setLink}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('link') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
            }`}
            title="Add Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>

          {/* Blockquote */}
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors text-sm font-bold ${
              editor.isActive('blockquote') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
            }`}
            title="Quote"
          >
            "
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative">
        <EditorContent 
          editor={editor} 
          className="min-h-[200px] prose max-w-none"
        />
      </div>
    </div>
  );
};

export default PostEditor;