export default async function passwordsMatch(email: string, password: string): Promise<boolean> {
  const url = `http://localhost:8000/api/perfiles/consultar_password/`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password_attempt: password }),
    });

    if (!response.ok) {
      throw new Error(`Error, status: ${response.status}`);
    }

    const data = await response.json();

    return data.valid_password as boolean;
  } catch (err) {
    console.error('Error al comprobar contraseña: ', err);
    return false;
  }
}
