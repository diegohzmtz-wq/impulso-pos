"use client";

import Input from "../components-ui/Input";

type Props = {
  busqueda: string;
  setBusqueda: (texto: string) => void;
};

export default function BuscadorCatalogo({
  busqueda,
  setBusqueda,
}: Props) {
  return (
    <div className="mb-8">
      <Input
        placeholder="🔍 Buscar productos..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
    </div>
  );
}