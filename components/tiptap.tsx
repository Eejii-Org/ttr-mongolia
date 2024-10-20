"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import React from "react";
import { Toolbar } from "./toolbar";
import Youtube from "@tiptap/extension-youtube";
import Image from "@tiptap/extension-image";

type TiptapPropsType = React.HTMLAttributes<HTMLDivElement> & {
  content: string;
  setContent: (s: string) => void;
};

export const Tiptap = ({ content, setContent, className }: TiptapPropsType) => {
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
      Image,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: "rounded-lg px-4 py-3 h-full w-full flex-1 border bg-tertiary",
      },
    },
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });
  return (
    <div
      className={`flex-1 flex flex-col items-start gap-2 ${
        className ? className : ""
      }`}
    >
      <Toolbar editor={editor} />
      <div className="w-full flex-1 h-full flex">
        <EditorContent className="w-full" editor={editor} />
      </div>
    </div>
  );
};
