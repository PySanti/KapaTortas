export default async function crearStripeId(email: string, stripeId: string): Promise<void> {
  const url = `http://localhost:8000/api/perfiles/actualizar_stripeId/`;
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, new_stripeId: stripeId }),
    });

    if (!response.ok) {
      throw new Error(`Error, Status: ${response.status}`);
    }
  } catch (err) {
    console.error('Error al actualizar stripeCustomerId', err);
  }
}
