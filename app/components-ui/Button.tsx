"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "danger";
  full?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  full = false,
  className = "",
  ...props
}: ButtonProps) {
  const colors = {
    primary:
      "bg-[#0BA84A] hover:bg-[#09953f] text-white",

    secondary:
      "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700",

    success:
      "bg-green-600 hover:bg-green-700 text-white",

    danger:
      "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button
      {...props}
      className={`
      ${colors[variant]}
      ${full ? "w-full" : ""}
      rounded-2xl
      font-semibold
      transition-all
      duration-200
      px-5
      py-3
      shadow-sm
      active:scale-95
      disabled:opacity-50
      disabled:pointer-events-none
      ${className}
      `}
    >
      {children}
    </button>
  );
}