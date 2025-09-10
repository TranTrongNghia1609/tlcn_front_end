// import React, { useState } from 'react';
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import { TextStyle } from '@tiptap/extension-text-style';
// import { Color } from '@tiptap/extension-color';
// import { Highlight } from '@tiptap/extension-highlight';
// import { TextAlign } from '@tiptap/extension-text-align';
// import { Link } from '@tiptap/extension-link';
// import { Image } from '@tiptap/extension-image';
// import TurndownService from 'turndown';
// import { 
//   CheckIcon, 
//   XMarkIcon,
//   BoldIcon, 
//   ItalicIcon,
//   StrikethroughIcon,
//   ListBulletIcon,
//   NumberedListIcon,
//   LinkIcon,
//   PhotoIcon,
//   CodeBracketIcon
// } from '@heroicons/react/24/outline';

// const PostEdit = ({ post, onSave, onCancel, isUpdating }) => {
//   const [editData, setEditData] = useState({
//     title: post.title || '',
//     content: post.content || '',
//     htmlContent: post.htmlContent || post.content || ''
//   });

//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       TextStyle,
//       Color,
//       Highlight.configure({ multicolor: true }),
//       TextAlign.configure({
//         types: ['heading', 'paragraph'],
//       }),
//       Link.configure({
//         openOnClick: false,
//       }),
//       Image,
//     ],
//     content: editData.htmlContent,
//     onUpdate: ({ editor }) => {
//       const htmlContent = editor.getHTML();
//       setEditData(prev => ({
//         ...prev,
//         htmlContent
//       }));
//     },
//     editorProps: {
//       attributes: {
//         class: 'prose prose-sm focus:outline-none min-h-[300px] p-4',
//       },
//     },
//   });

//   if (!editor) {
//     return (
//       <div className="p-6">
//         <div className="animate-pulse">Loading editor...</div>
//       </div>
//     );
//   }

//   const addImage = () => {
//     const input = document.createElement('input');
//     input.type = 'file';
//     input.accept = 'image/*';
//     input.onchange = (e) => {
//       const file = e.target.files[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = (event) => {
//           editor.chain().focus().setImage({ src: event.target.result }).run();
//         };
//         reader.readAsDataURL(file);
//       }
//     };
//     input.click();
//   };

//   const setLink = () => {
//     const previousUrl = editor.getAttributes('link').href;
//     const url = window.prompt('URL:', previousUrl);

//     if (url === null) return;

//     if (url === '') {
//       editor.chain().focus().extendMarkRange('link').unsetLink().run();
//       return;
//     }

//     editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
//   };

//   const handleSave = () => {
//     if (!editData.title.trim() || !editData.htmlContent.trim()) {
//       alert('Title and content are required');
//       return;
//     }

//     // Initialize TurndownService with enhanced options
//     const turndownService = new TurndownService({
//       headingStyle: 'atx',
//       codeBlockStyle: 'fenced',
//       fence: '```',
//       emDelimiter: '_',
//       strongDelimiter: '**',
//       linkStyle: 'inlined'
//     });

//     // Custom rules for better conversion
//     turndownService.addRule('strikethrough', {
//       filter: ['del', 's', 'strike'],
//       replacement: function (content) {
//         return '~~' + content + '~~';
//       }
//     });

//     turndownService.addRule('underline', {
//       filter: 'u',
//       replacement: function (content) {
//         return '<u>' + content + '</u>';
//       }
//     });

//     // Convert HTML to Markdown for database storage
//     const markdownContent = turndownService.turndown(editData.htmlContent);
    
//     const updateData = {
//       title: editData.title.trim(),
//       content: markdownContent, // Store as Markdown
//       htmlContent: editData.htmlContent // Store HTML for display
//     };

//     onSave(updateData);
//   };

//   return (
//     <div className="p-6">
//       <div className="space-y-4">
//         {/* Title Input */}
//         <input
//           type="text"
//           value={editData.title}
//           onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
//           className="w-full text-xl font-bold border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           placeholder="Post title..."
//           maxLength={200}
//         />
        
//         {/* Rich Text Editor */}
//         <div className="border border-gray-300 rounded-lg overflow-hidden">
//           {/* Toolbar */}
//           <div className="border-b border-gray-200 bg-gray-50 p-2">
//             <div className="flex flex-wrap items-center gap-1">
//               {/* Text Formatting */}
//               <button
//                 type="button"
//                 onClick={() => editor.chain().focus().toggleBold().run()}
//                 disabled={!editor.can().chain().focus().toggleBold().run()}
//                 className={`p-2 rounded hover:bg-gray-200 transition-colors ${
//                   editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
//                 }`}
//                 title="Bold (Ctrl+B)"
//               >
//                 <BoldIcon className="w-4 h-4" />
//               </button>
              
//               <button
//                 type="button"
//                 onClick={() => editor.chain().focus().toggleItalic().run()}
//                 disabled={!editor.can().chain().focus().toggleItalic().run()}
//                 className={`p-2 rounded hover:bg-gray-200 transition-colors ${
//                   editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
//                 }`}
//                 title="Italic (Ctrl+I)"
//               >
//                 <ItalicIcon className="w-4 h-4" />
//               </button>

//               <button
//                 type="button"
//                 onClick={() => editor.chain().focus().toggleStrike().run()}
//                 disabled={!editor.can().chain().focus().toggleStrike().run()}
//                 className={`p-2 rounded hover:bg-gray-200 transition-colors ${
//                   editor.isActive('strike') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
//                 }`}
//                 title="Strikethrough"
//               >
//                 <StrikethroughIcon className="w-4 h-4" />
//               </button>

//               <div className="w-px h-6 bg-gray-300 mx-2"></div>

//               {/* Headings */}
//               <select
//                 onChange={(e) => {
//                   const level = parseInt(e.target.value);
//                   if (level === 0) {
//                     editor.chain().focus().setParagraph().run();
//                   } else {
//                     editor.chain().focus().toggleHeading({ level }).run();
//                   }
//                 }}
//                 value={
//                   editor.isActive('heading', { level: 1 }) ? 1 :
//                   editor.isActive('heading', { level: 2 }) ? 2 :
//                   editor.isActive('heading', { level: 3 }) ? 3 : 0
//                 }
//                 className="px-3 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value={0}>Paragraph</option>
//                 <option value={1}>Heading 1</option>
//                 <option value={2}>Heading 2</option>
//                 <option value={3}>Heading 3</option>
//               </select>

//               <div className="w-px h-6 bg-gray-300 mx-2"></div>

//               {/* Lists */}
//               <button
//                 type="button"
//                 onClick={() => editor.chain().focus().toggleBulletList().run()}
//                 className={`p-2 rounded hover:bg-gray-200 transition-colors ${
//                   editor.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
//                 }`}
//                 title="Bullet List"
//               >
//                 <ListBulletIcon className="w-4 h-4" />
//               </button>

//               <button
//                 type="button"
//                 onClick={() => editor.chain().focus().toggleOrderedList().run()}
//                 className={`p-2 rounded hover:bg-gray-200 transition-colors ${
//                   editor.isActive('orderedList') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
//                 }`}
//                 title="Numbered List"
//               >
//                 <NumberedListIcon className="w-4 h-4" />
//               </button>

//               <div className="w-px h-6 bg-gray-300 mx-2"></div>

//               {/* Alignment */}
//               <select
//                 onChange={(e) => {
//                   const alignment = e.target.value;
//                   editor.chain().focus().setTextAlign(alignment).run();
//                 }}
//                 value={
//                   editor.isActive({ textAlign: 'center' }) ? 'center' :
//                   editor.isActive({ textAlign: 'right' }) ? 'right' :
//                   editor.isActive({ textAlign: 'justify' }) ? 'justify' : 'left'
//                 }
//                 className="px-3 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="left">Left</option>
//                 <option value="center">Center</option>
//                 <option value="right">Right</option>
//                 <option value="justify">Justify</option>
//               </select>

//               <div className="w-px h-6 bg-gray-300 mx-2"></div>

//               {/* Text Color */}
//               <div className="flex items-center space-x-1">
//                 <label className="text-xs text-gray-500">Color:</label>
//                 <input
//                   type="color"
//                   onInput={(event) => editor.chain().focus().setColor(event.target.value).run()}
//                   value={editor.getAttributes('textStyle').color || '#000000'}
//                   className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
//                   title="Text Color"
//                 />
//               </div>

//               <button
//                 type="button"
//                 onClick={() => editor.chain().focus().toggleHighlight().run()}
//                 className={`p-2 rounded hover:bg-gray-200 transition-colors ${
//                   editor.isActive('highlight') ? 'bg-yellow-100' : ''
//                 }`}
//                 title="Highlight"
//               >
//                 <div className="w-4 h-4 bg-yellow-300 rounded"></div>
//               </button>

//               <div className="w-px h-6 bg-gray-300 mx-2"></div>

//               {/* Link */}
//               <button
//                 type="button"
//                 onClick={setLink}
//                 className={`p-2 rounded hover:bg-gray-200 transition-colors ${
//                   editor.isActive('link') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
//                 }`}
//                 title="Add Link"
//               >
//                 <LinkIcon className="w-4 h-4" />
//               </button>

//               {/* Image */}
//               <button
//                 type="button"
//                 onClick={addImage}
//                 className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
//                 title="Add Image"
//               >
//                 <PhotoIcon className="w-4 h-4" />
//               </button>

//               {/* Code Block */}
//               <button
//                 type="button"
//                 onClick={() => editor.chain().focus().toggleCodeBlock().run()}
//                 className={`p-2 rounded hover:bg-gray-200 transition-colors ${
//                   editor.isActive('codeBlock') ? 'bg-gray-800 text-white' : 'text-gray-600'
//                 }`}
//                 title="Code Block"
//               >
//                 <CodeBracketIcon className="w-4 h-4" />
//               </button>

//               {/* Blockquote */}
//               <button
//                 type="button"
//                 onClick={() => editor.chain().focus().toggleBlockquote().run()}
//                 className={`p-2 rounded hover:bg-gray-200 transition-colors text-sm font-bold ${
//                   editor.isActive('blockquote') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
//                 }`}
//                 title="Quote"
//               >
//                 "
//               </button>
//             </div>
//           </div>

//           {/* Editor Content */}
//           <div className="relative">
//             <EditorContent 
//               editor={editor} 
//               className="min-h-[300px] prose max-w-none"
//             />
//           </div>
//         </div>

//         {/* Character/Word Count */}
//         <div className="flex justify-between text-sm text-gray-500">
//           <span>
//             Characters: {editData.htmlContent.replace(/<[^>]*>/g, '').length}
//           </span>
//           <span>
//             Words: {editData.htmlContent.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length}
//           </span>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
//           <button
//             type="button"
//             onClick={onCancel}
//             disabled={isUpdating}
//             className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
//           >
//             <XMarkIcon className="w-4 h-4" />
//             <span>Cancel</span>
//           </button>
//           <button
//             type="button"
//             onClick={handleSave}
//             disabled={isUpdating || !editData.title.trim() || !editData.htmlContent.trim()}
//             className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             <CheckIcon className="w-4 h-4" />
//             <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
//           </button>
//         </div>
//       </div>

//       {/* Custom Styles */}
//       <style jsx global>{`
//         .ProseMirror {
//           outline: none;
//           padding: 16px;
//           min-height: 300px;
//           line-height: 1.6;
//         }
        
//         .ProseMirror p.is-editor-empty:first-child::before {
//           content: "Write your content here...";
//           float: left;
//           color: #9ca3af;
//           pointer-events: none;
//           height: 0;
//         }
        
//         .ProseMirror h1 {
//           font-size: 2rem;
//           font-weight: bold;
//           margin: 1rem 0;
//           line-height: 1.2;
//         }
        
//         .ProseMirror h2 {
//           font-size: 1.5rem;
//           font-weight: bold;
//           margin: 0.875rem 0;
//           line-height: 1.3;
//         }
        
//         .ProseMirror h3 {
//           font-size: 1.25rem;
//           font-weight: bold;
//           margin: 0.75rem 0;
//           line-height: 1.4;
//         }
        
//         .ProseMirror ul, .ProseMirror ol {
//           padding-left: 2rem;
//           margin: 1rem 0;
//         }
        
//         .ProseMirror li {
//           margin: 0.25rem 0;
//         }
        
//         .ProseMirror blockquote {
//           border-left: 4px solid #e5e7eb;
//           margin: 1.5rem 0;
//           padding: 0.5rem 0 0.5rem 1rem;
//           color: #6b7280;
//           font-style: italic;
//           background: #f9fafb;
//         }
        
//         .ProseMirror pre {
//           background: #1f2937;
//           color: #f9fafb;
//           font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Courier New', monospace;
//           padding: 1rem;
//           border-radius: 0.5rem;
//           overflow-x: auto;
//           margin: 1rem 0;
//           font-size: 0.875rem;
//           line-height: 1.5;
//         }
        
//         .ProseMirror code {
//           background-color: #f3f4f6;
//           border-radius: 0.25rem;
//           color: #374151;
//           font-size: 0.875rem;
//           padding: 0.125rem 0.25rem;
//           font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Courier New', monospace;
//         }
        
//         .ProseMirror mark {
//           background-color: #fef08a;
//           border-radius: 0.125rem;
//           padding: 0.125rem 0.25rem;
//         }
        
//         .ProseMirror img {
//           max-width: 100%;
//           height: auto;
//           border-radius: 0.5rem;
//           margin: 1rem 0;
//           display: block;
//         }
        
//         .ProseMirror a {
//           color: #3b82f6;
//           text-decoration: underline;
//           cursor: pointer;
//         }
        
//         .ProseMirror a:hover {
//           color: #1d4ed8;
//         }
        
//         .ProseMirror p {
//           margin: 0.5rem 0;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default PostEdit;