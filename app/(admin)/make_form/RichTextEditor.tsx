"use client";

import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { Button } from "@/components/ui/button"
import { BoldIcon, ItalicIcon, List, ListOrdered, LinkIcon, Heading1, Heading2, AlignLeft, AlignCenter, AlignRight, UnderlineIcon, Quote, Undo, Redo, Strikethrough } from 'lucide-react'

const predefinedFields = [
  { id: 'email', label: 'Email', type: 'text', example: 'example@gmail.com' },
  { id: 'patronym', label: 'Πατρώνυμο', type: 'text', example: 'Παναγιώτης' },
  { id: 'full_name', label: 'Ονοματεπώνυμο', type: 'text', example: 'Μιχαήλ Αγγελετόπουλος' },
  { id: 'phone', label: 'Αριθμός Τηλεφώνου', type: 'text', example: '6912345678' },
  { id: 'number_id', label: 'Αριθμός Ταυτότητας', type: 'text', example: 'ΑΤ1234' },
]

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
 // onAddField: (field: { id: string; label: string; type: string; example: string }) => void
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          HTMLAttributes: {
            class: 'text-xl font-semibold',
            levels: [2],
          },
          //HTMLAttributes: {
           // 1: { class: 'text-2xl font-bold' },
           // 2: { class: 'text-xl font-semibold' },
         // },
        },
        bold: {
          HTMLAttributes: {
            class: 'font-bold',
          },
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: 'list-disc list-inside',
          },
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: 'list-decimal list-inside',
          },
        },
        blockquote: {
            HTMLAttributes: {
              class: 'border-l-4 border-gray-300 pl-4 italic',
            },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'min-h-[150px] prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none focus:outline-none',
      },
    },
  })

  if (!editor) {
    return null
  }

  const toolbarButtons = [
    {
      icon: <Heading1 className="h-4 w-4" />,
      title: 'Heading 1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive('heading', { level: 1 }),
    },
    {
      icon: <Heading2 className="h-4 w-4" />,
      title: 'Heading 2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive('heading', { level: 2 }),
    },
    {
      icon: <BoldIcon className="h-4 w-4" />,
      title: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
    },
    {
      icon: <ItalicIcon className="h-4 w-4" />,
      title: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
    },
    {
      icon: <UnderlineIcon className="h-4 w-4" />,
      title: 'Underline',
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive('underline'),
    },
    {
      icon: <Strikethrough className="h-4 w-4" />,
      title: 'Strikethrough',
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive('strike'),
    },
    {
      icon: <List className="h-4 w-4" />,
      title: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      title: 'Numbered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList'),
    },
    {
      icon: <Quote className="h-4 w-4" />,
      title: 'Blockquote',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive('blockquote'),
    },
    {
      icon: <AlignLeft className="h-4 w-4" />,
      title: 'Align Left',
      action: () => editor.chain().focus().setTextAlign('left').run(),
      isActive: () => editor.isActive({ textAlign: 'left' }),
    },
    {
      icon: <AlignCenter className="h-4 w-4" />,
      title: 'Align Center',
      action: () => editor.chain().focus().setTextAlign('center').run(),
      isActive: () => editor.isActive({ textAlign: 'center' }),
    },
    {
      icon: <AlignRight className="h-4 w-4" />,
      title: 'Align Right',
      action: () => editor.chain().focus().setTextAlign('right').run(),
      isActive: () => editor.isActive({ textAlign: 'right' }),
    },
    {
      icon: <LinkIcon className="h-4 w-4" />,
      title: 'Add Link',
      action: () => {
        const url = window.prompt('Enter URL')
        if (url) {
          editor.chain().focus().setLink({ href: url }).run()
        }
      },
      isActive: () => editor.isActive('link'),
    },
  ]

  return (
    <div className="border rounded-md">
      <div className="border-b p-2 flex gap-1 flex-wrap bg-muted/50">
        <div className="flex gap-1 mr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
        <div className="w-px h-6 bg-border mx-2 self-center" />
        {toolbarButtons.map((button, index) => (
          <React.Fragment key={button.title}>
            <Button
              variant="ghost"
              size="sm"
              onClick={button.action}
              className={button.isActive() ? 'bg-muted' : ''}
              title={button.title}
            >
              {button.icon}
            </Button>
            {(index + 1) % 6 === 0 && <div className="w-px h-6 bg-border mx-2 self-center" />}
          </React.Fragment>
        ))}
      </div>
      <EditorContent editor={editor} className="p-4" />
      
    </div>
  )
}

