"use client";

interface Props {
  children: React.ReactNode;
  color?: "green" | "yellow" | "red";
}

export default function Badge({
  children,
  color = "green",
}: Props) {
  const colors = {
    green:
      "bg-green-100 text-green-700",

    yellow:
      "bg-yellow-100 text-yellow-700",

    red:
      "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`
      inline-flex
      items-center
      rounded-full
      px-3
      py-1
      text-sm
      font-semibold
      ${colors[color]}
      `}
    >
      {children}
    </span>
  );
}