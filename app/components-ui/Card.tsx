"use client";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function Card({
  children,
  className = "",
}: Props) {
  return (
    <div
      className={`
      bg-white
      rounded-[28px]
      shadow-md
      border
      border-[#ECECEC]
      p-6
      ${className}
      `}
    >
      {children}
    </div>
  );
}