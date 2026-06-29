"use client";

type Tab = "productos" | "categorias" | "modificadores";

type Props = {
  tab: Tab;
  onChange: (tab: Tab) => void;
};

export default function TabsCatalogo({
  tab,
  onChange,
}: Props) {
  const tabs = [
    {
      id: "productos",
      nombre: "Productos",
      icono: "🏷️",
    },
    {
      id: "categorias",
      nombre: "Categorías",
      icono: "📚",
    },
    {
      id: "modificadores",
      nombre: "Modificadores",
      icono: "⚙️",
    },
  ] as const;

  return (
    <div className="flex gap-3 mb-8">

      {tabs.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={`px-6 py-3 rounded-xl font-semibold transition-all border

          ${
            tab === item.id
              ? "bg-green-600 text-white border-green-600 shadow-lg"
              : "bg-white hover:bg-gray-100 border-gray-200 text-gray-700"
          }`}
        >
          <span className="mr-2">
            {item.icono}
          </span>

          {item.nombre}
        </button>
      ))}

    </div>
  );
}