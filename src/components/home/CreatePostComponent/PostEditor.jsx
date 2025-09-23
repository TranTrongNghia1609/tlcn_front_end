import React, { useState } from 'react';
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

import '../../../styles/post-editor.css';

const PostEditor = ({ value, onChange, placeholder = "Chia sẻ suy nghĩ của bạn..." }) => {
    const [clickedButton, setClickedButton] = useState(null);

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
        // ✅ Class 'post-editor-content' sẽ match với CSS rules
        class: 'prose prose-sm focus:outline-none min-h-[200px] p-4 post-editor-content',
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
  
  const handleButtonClick = (action, buttonId) => {
    // Set clicked state
    setClickedButton(buttonId);
    
    // Execute action
    action();
    
    // Remove clicked state after animation
    setTimeout(() => {
      setClickedButton(null);
    }, 150);
  };
  
  const ToolbarButton = ({ 
    onClick, 
    disabled = false, 
    isActive = false, 
    title, 
    children,
    buttonId,
    className = ""
  }) => {
    const isClicked = clickedButton === buttonId;
    
    return (
      <button
        onClick={() => handleButtonClick(onClick, buttonId)}
        disabled={disabled}
        title={title}
        className={`
          p-2 rounded transition-all duration-150 ease-out
          ${disabled 
            ? 'cursor-not-allowed opacity-50' 
            : 'cursor-pointer'
          }
          ${isClicked 
            ? 'scale-95 bg-gray-300' 
            : 'scale-100'
          }
          ${isActive 
            ? 'bg-blue-100 text-blue-600 shadow-inner' 
            : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
          }
          ${!disabled && !isClicked ? 'hover:scale-105 hover:shadow-sm' : ''}
          ${className}
        `}
      >
        {children}
      </button>
    );
  };
  
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
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200">
        {/* Toolbar */}
        <div className="border-b border-gray-200 bg-gray-50 p-2">
          <div className="flex flex-wrap items-center gap-1">
            
            {/* Text Formatting */}
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Bold (Ctrl+B)"
              buttonId="bold"
            >
              <BoldIcon className="w-4 h-4" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Italic (Ctrl+I)"
              buttonId="italic"
            >
              <ItalicIcon className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              title="Strikethrough"
              buttonId="strike"
            >
              <StrikethroughIcon className="w-4 h-4" />
            </ToolbarButton>

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
              className="px-3 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm focus:bg-blue-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            >
              <option value={0}>Paragraph</option>
              <option value={1}>Heading 1</option>
              <option value={2}>Heading 2</option>
              <option value={3}>Heading 3</option>
            </select>

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* Lists */}
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="Bullet List (• • •)"
              buttonId="bulletList"
            >
              <ListBulletIcon className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="Numbered List (1. 2. 3.)"
              buttonId="orderedList"
            >
              <NumberedListIcon className="w-4 h-4" />
            </ToolbarButton>

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
              className="px-3 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm focus:bg-blue-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
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
                className="w-8 h-8 border border-gray-300 rounded cursor-pointer hover:border-gray-400 hover:shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                title="Text Color"
              />
            </div>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              isActive={editor.isActive('highlight')}
              title="Highlight"
              buttonId="highlight"
              className={editor.isActive('highlight') ? 'bg-yellow-100 hover:bg-yellow-200' : ''}
            >
              <div className="w-4 h-4 bg-yellow-300 rounded"></div>
            </ToolbarButton>

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* Link */}
            <ToolbarButton
              onClick={setLink}
              isActive={editor.isActive('link')}
              title="Add Link"
              buttonId="link"
            >
              <LinkIcon className="w-4 h-4" />
            </ToolbarButton>

            {/* Blockquote */}
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              title="Quote"
              buttonId="blockquote"
              className="text-sm font-bold"
            >
              "
            </ToolbarButton>
          </div>
        </div>

        {/* Editor Content */}
        <div className="relative">
          <EditorContent 
            editor={editor} 
            className="min-h-[200px] prose max-w-none focus-within:bg-blue-50/30 transition-colors duration-200"
          />
        </div>
      </div>
  );
};
export default PostEditor;