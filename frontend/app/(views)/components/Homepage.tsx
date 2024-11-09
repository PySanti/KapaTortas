"use client";

import { useState } from "react";
import KapaTortasVerifyEmail from "./verification-email";
import { Cliente } from "@/app/models/Cliente";
import ClienteAPI from "@/app/controladores/api/users/ClienteAPI";

export default function HomePage({}) {
  return (
    <>
      <PerfilTesteo />
    </>
  );
}

// Esto esta malo, deberiamos traer el Perfil en contexto, es para testear.
const PerfilTesteo: React.FC = () => {
  const [cliente, setCliente] = useState<Cliente | null>();
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>();

  const handleFetchPerfil = async () => {
    try {
      const fetchCliente = await ClienteAPI.obtenerCliente(email);
      if (fetchCliente) {
        setCliente(fetchCliente);
        setError(null);
      } else {
        setError("Perfil no encontrado");
      }
    } catch (err) {
      console.error("Error intentando filtrar perfil: ", err);
      setError("Hubo un problema al consultar el perfil.");
    }
  };

  return (
    <>
      <h2 className="text-2xl p-20">Testing del perfil</h2>
      <div className="p-5">
        <input
          type="text"
          placeholder="Pon el texto"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="bg-green-300 p-5 rounded-lg "
          onClick={handleFetchPerfil}
        >
          Consulta el perfil
        </button>
      </div>

      {error && <p>{error}</p>}

      {cliente ? (
        <div className="p-20 text-sm">
          <h2 className="text-black text-2xl">
            Perfil de {cliente.perfil.nombre_completo}
          </h2>
          <h2 className="text-black text-2xl">
            Num: {cliente.perfil.numero_telefonico}
          </h2>
          <h2 className="text-black text-2xl">
            Correo: {cliente.perfil.nombre_completo}
          </h2>
        </div>
      ) : (
        <p>Introduce un correo</p>
      )}
    </>
  );
};

// export default PerfilTesteo;
