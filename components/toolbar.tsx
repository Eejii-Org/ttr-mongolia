"use client";

import { type Editor } from "@tiptap/react";
import React from "react";

type Props = {
  editor: Editor | null;
};
export const Toolbar = ({ editor }: Props) => {
  if (!editor) return null;
  return (
    <div className="flex flex-row border bg-tertiary rounded-[8px] p-1 gap-1">
      <Toggle
        pressed={editor.isActive("heading")}
        onPressedChange={() => {
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
      >
        H2
      </Toggle>
      <Toggle
        pressed={editor.isActive("bold")}
        onPressedChange={() => {
          editor.chain().focus().toggleBold().run();
        }}
      >
        Bold
      </Toggle>
      <Toggle
        pressed={editor.isActive("italic")}
        onPressedChange={() => {
          editor.chain().focus().toggleItalic().run();
        }}
      >
        Italic
      </Toggle>
      <Toggle
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => {
          editor.chain().focus().toggleOrderedList().run();
        }}
      >
        Numbered List
      </Toggle>
      <Toggle
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => {
          editor.chain().focus().toggleBulletList().run();
        }}
      >
        Bullet List
      </Toggle>
    </div>
  );
};

const Toggle = ({
  pressed,
  onPressedChange,
  children,
}: {
  pressed: boolean;
  onPressedChange: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`${
        pressed ? "bg-quinary" : ""
      } rounded hover:bg-quinary cursor-pointer px-3 h-8 flex items-center justify-center text-sm`}
      onClick={onPressedChange}
    >
      {children}
    </div>
  );
};
