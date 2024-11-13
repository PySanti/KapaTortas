export default async function correoVerificado(email: string): Promise<boolean> {
  const url = `http://localhost:8000/api/perfiles/perfiles/activar_perfil/`;
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(`Error, Status: ${response.status}`);
    }

    const data = await response.json();

    return data.activated as boolean;
  } catch (err) {
    console.error('Error al verificar correo', err);
    return false;
  }
}
