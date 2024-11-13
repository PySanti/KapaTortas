export default async function checkCorreoVerificado(email: string): Promise<boolean> {
  const url = `http://localhost:8000/api/perfiles/check-verified/${encodeURIComponent(email)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error, Status: ${response.status}`);
    }

    const data = await response.json();

    return data.is_active as boolean;
  } catch (err) {
    console.error('Error al comprobar si el usuario está verificado', err);
    return false;
  }
}
