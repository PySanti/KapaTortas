"use client";

import { useState } from "react";
import KapaTortasVerifyEmail from "../components/verification-email";
import { Perfil } from "@/app/models/Perfil";
import PerfilAPI from "@/app/controladores/api/users/PerfilAPI";

export default function HomePage({}) {
  return (
    <>
      <h1>Hola</h1>
      <PerfilTesteo />
    </>
  );
}

// Esto esta malo, deberiamos traer el Perfil en contexto, es para testear.
const PerfilTesteo: React.FC = () => {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleFetchPerfil = async () => {
    try {
      const fetchPerfil = await PerfilAPI.obtenerPerfil(email);
      if (fetchPerfil) {
        setPerfil(fetchPerfil);
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
      <h2>Testing del perfil</h2>
      <input
        type="text"
        placeholder="Pon el texto"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleFetchPerfil}>Consulta el perfil</button>

      {error && <p>{error}</p>}

      {perfil ? (
        <div>
          <h2>Perfil de {perfil.nombre_completo}</h2>
          <h2>Correo: {perfil.correo}</h2>
        </div>
      ) : (
        <p>Introduce un correo</p>
      )}
    </>
  );
};

// export default PerfilTesteo;
