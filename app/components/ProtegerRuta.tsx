"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
  rolesPermitidos?: string[];
};

export default function ProtegerRuta({ children, rolesPermitidos }: Props) {
  const router = useRouter();
  const [permitido, setPermitido] = useState(false);

  useEffect(() => {
    const sesion = JSON.parse(localStorage.getItem("usuario_sesion") || "null");

    if (!sesion) {
      router.replace("/login");
      return;
    }

    if (
      rolesPermitidos &&
      !rolesPermitidos.includes(sesion.rol)
    ) {
      router.replace("/ventas");
      return;
    }

    setPermitido(true);
  }, [router, rolesPermitidos]);

  if (!permitido) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F3F8F2]">
        <div className="rounded-3xl bg-white px-8 py-6 text-center shadow-xl ring-1 ring-gray-200">
          <div className="text-4xl">🔐</div>
          <p className="mt-3 text-lg font-black text-gray-900">
            Verificando acceso...
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}