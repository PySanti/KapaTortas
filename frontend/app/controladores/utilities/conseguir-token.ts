export default async function conseguirToken(token: string): Promise<boolean> {
  const url = `http://localhost:8000/api/perfiles/activar_perfil_by_token/`;

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error(`Error, Status: ${response.status}`);
    }

    const data = await response.json();

    return data.activated as boolean;
  } catch (error) {
    console.error(error);
    return false;
  }
}
