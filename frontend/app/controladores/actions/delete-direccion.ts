'use server'

export const deleteDireccion = async (id: number) => {
  console.log('Deleting address with ID:', id);
  return { success: true };
}