"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import ImageNode from '@tiptap/extension-image';
import { useEffect } from 'react';

// Tiptap Menu Bar Component
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-md">
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`px-2 py-1 text-sm font-medium rounded ${editor.isActive('bold') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`px-2 py-1 text-sm font-medium rounded ${editor.isActive('italic') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        Italic
      </button>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run(); }}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`px-2 py-1 text-sm font-medium rounded ${editor.isActive('strike') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        Strike
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().setParagraph().run(); }}
        className={`px-2 py-1 text-sm font-medium rounded ${editor.isActive('paragraph') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        P
      </button>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
        className={`px-2 py-1 text-sm font-medium rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        H2
      </button>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); }}
        className={`px-2 py-1 text-sm font-medium rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        H3
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
        className={`px-2 py-1 text-sm font-medium rounded ${editor.isActive('bulletList') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        Bullet List
      </button>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
        className={`px-2 py-1 text-sm font-medium rounded ${editor.isActive('orderedList') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        Ordered List
      </button>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }}
        className={`px-2 py-1 text-sm font-medium rounded ${editor.isActive('blockquote') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        Quote
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          const url = window.prompt('URL');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`px-2 py-1 text-sm font-medium rounded ${editor.isActive('link') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        Link
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          const url = window.prompt('Image URL');
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
        className="px-2 py-1 text-sm font-medium rounded text-gray-600 hover:bg-gray-100"
      >
        Image
      </button>
    </div>
  );
};

export function RichTextEditor({ 
  content, 
  onChange,
  placeholder = "Write something..."
}: { 
  content: string; 
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      ImageNode,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm md:prose max-w-none focus:outline-none p-4 min-h-[300px]',
      },
    },
  });

  // Update editor content if it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  return (
    <div className="border border-gray-200 rounded-md bg-white overflow-hidden focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[var(--color-primary)]">
      <MenuBar editor={editor} />
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
