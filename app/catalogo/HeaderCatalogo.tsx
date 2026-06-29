"use client";

import Button from "../components-ui/Button";

export default function HeaderCatalogo() {
  return (
    <header className="h-24 bg-white border-b border-gray-200 flex items-center justify-between px-10">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-green-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
          🍔
        </div>

        <div>
          <h1 className="text-3xl font-black text-gray-900">
            Catálogo de Productos
          </h1>

          <p className="text-gray-500 font-semibold">
            Administra tu menú de forma profesional
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary">
          Importar
        </Button>

        <Button>
          + Nuevo Producto
        </Button>
      </div>
    </header>
  );
}