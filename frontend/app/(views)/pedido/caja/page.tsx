import { Pedido } from "@/app/models/Pedido";
import { Cliente } from "@/app/models/Cliente";
import MainPedido from "../../components/pedido/main-pedido";
import { auth } from "@/auth";
import ClienteAPI from "@/app/controladores/api/users/ClienteAPI";
import { Rol } from "@/app/models/RolEnum";

const exampleCliente: Cliente = {
  perfil: {
    id: 1,
    nombre_completo: "Juan Pérez",
    correo: "juan.perez@example.com",
    contraseña: "securepassword123",
    numero_telefonico: "+123456789",
    fecha_nacimiento: "1990-05-15",
    link_foto: "https://example.com/profile-photo.jpg",
    rol: Rol.CLIENTE, // Adjust this based on the possible values for Rol
    stripeCustomerId: "cus_ABC123XYZ456",
    is_active: true,
    is_staff: false,
    auth_token: "auth_token_example_123",
  },
  direcciones: [
    {
      ciudad: "Madrid",
      direccion: "Calle Mayor 123",
      referencia: "Cerca de la plaza",
      pais: "España",
      estado: "Madrid",
      codigo_postal: "28013",
      esPreferida: false,
    },
    {
      ciudad: "Barcelona",
      direccion: "Avenida Diagonal 456",
      referencia: "Frente al parque",
      pais: "España",
      estado: "Cataluña",
      codigo_postal: "08021",
      esPreferida: false,
    },
  ],
  direccion_preferida: {
    ciudad: "Madrid",
    direccion: "Calle Mayor 123",
    referencia: "Cerca de la plaza",
    pais: "España",
    estado: "Madrid",
    codigo_postal: "28013",
    esPreferida: true,
  },
};

export default async function PedidoPage() {
  // Session user
  // const session = await auth();
  // const perfil = await ClienteAPI.obtenerCliente(session?.user.email!);

  return (
    <div>
      <MainPedido perfil={exampleCliente} />
    </div>
  );
}
