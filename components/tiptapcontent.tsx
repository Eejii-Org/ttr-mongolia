"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Youtube from "@tiptap/extension-youtube";

export const TiptapContent = ({ content }: { content: string }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Heading.configure({
        HTMLAttributes: {
          class: "text-2xl",
          levels: [2],
        },
      }),
      Youtube.configure({
        controls: false,
        nocookie: true,
        HTMLAttributes: {
          class: "my-iframe-class",
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: "md:text-lg text-black/70",
      },
    },
    editable: false,
  });
  return <EditorContent editor={editor} />;
};
