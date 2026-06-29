"use client";

type Props = {
  icon?: string;
  title: string;
  description?: string;
};

export default function EmptyState({
  icon = "🛍️",
  title,
  description,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <div className="text-6xl mb-4">{icon}</div>

      <h3 className="text-xl font-bold text-gray-900">{title}</h3>

      {description && (
        <p className="text-gray-500 mt-2 max-w-sm">{description}</p>
      )}
    </div>
  );
}