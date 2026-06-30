"use client";

import Input from "../../components-ui/Input";

type Props = {
  telefono: string;
  setTelefono: (valor: string) => void;
};

export default function ClienteInput({ telefono, setTelefono }: Props) {
  return (
    <Input
      placeholder="📞 Teléfono del cliente (opcional)"
      value={telefono}
      onChange={(e) => setTelefono(e.target.value)}
      className="bg-[#F1E7DB] border-none mb-8"
    />
  );
}