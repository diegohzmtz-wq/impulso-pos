"use client";

import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

export default function Input({
  className = "",
  ...props
}: Props) {
  return (
    <input
      {...props}
      className={`
      w-full
      h-14
      rounded-2xl
      border
      border-gray-200
      bg-white
      px-5
      outline-none
      text-lg
      placeholder:text-gray-400
      focus:ring-2
      focus:ring-green-500
      transition-all
      ${className}
      `}
    />
  );
}