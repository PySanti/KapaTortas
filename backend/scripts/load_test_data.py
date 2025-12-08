"""
Script para cargar datos de prueba en la base de datos
Genera: 500 clientes, 50 productos, 150 presentaciones, 2000 pedidos
"""

import os
import sys
import django
import random
from datetime import datetime, timedelta

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from applications.Perfiles.models import Perfiles
from applications.Clientes.models import Clientes, DireccionesEnvio
from applications.Productos.models import Productos, Presentaciones, Reviews
from applications.Ventas.models import Pedidos, DescripcionesPedido, Ventas, Facturas
from django.contrib.auth.hashers import make_password


def limpiar_datos_prueba():
    """Eliminar datos de prueba anteriores"""
    print("🗑️  Limpiando datos de prueba anteriores...")

    # Eliminar en orden correcto (respetando foreign keys)
    Facturas.objects.filter(venta_asociada__pedido__nota__contains="prueba").delete()
    Ventas.objects.filter(pedido__nota__contains="prueba").delete()
    DescripcionesPedido.objects.filter(pedido_asociado__nota__contains="prueba").delete()
    Pedidos.objects.filter(nota__contains="prueba").delete()
    Reviews.objects.all().delete()  # Eliminar todos los reviews de prueba
    Presentaciones.objects.all().delete()  # Eliminar todas las presentaciones
    Productos.objects.filter(titulo__contains="Test").delete()
    DireccionesEnvio.objects.filter(direccion__contains="Test").delete()
    Clientes.objects.filter(perfil__correo__contains="@test.com").delete()
    Perfiles.objects.filter(correo__contains="@test.com").delete()

    print("✅ Datos de prueba anteriores eliminados")


def crear_clientes(cantidad=500):
    """Crear clientes de prueba"""
    print(f"\n👥 Creando {cantidad} clientes de prueba...")

    clientes_creados = []

    for i in range(cantidad):
        try:
            # Crear perfil
            perfil = Perfiles.objects.create(
                nombre_completo=f"Cliente Test {i}",
                cedula=f"V{10000000 + i}",
                correo=f"cliente{i}@test.com",
                contraseña=make_password("test123"),  # Contraseña hasheada
                numero_telefonico=f"04241234{i % 10000:04d}",
                fecha_nacimiento=datetime.now().date() - timedelta(days=random.randint(6570, 25550)),  # 18-70 años
                rol="cliente",
                is_active=True,
                link_foto=f"https://res.cloudinary.com/demo/image/upload/avatar{i % 10}.jpg"
            )

            # Crear cliente asociado
            cliente = Clientes.objects.create(
                perfil=perfil,
                auth_provider="local"
            )

            # Crear 2-3 direcciones de envío por cliente
            direcciones = []
            for j in range(random.randint(2, 3)):
                direccion = DireccionesEnvio.objects.create(
                    pais="Venezuela",
                    ciudad=random.choice(["Caracas", "Maracaibo", "Valencia", "Barquisimeto", "Maracay"]),
                    estado=random.choice(["Miranda", "Zulia", "Carabobo", "Lara", "Aragua"]),
                    direccion=f"Av. Test {i}, Edificio {j}, Piso {random.randint(1, 10)}",
                    referencia=f"Cerca de punto de referencia {j}",
                    codigo_postal=f"{1000 + random.randint(0, 999)}"
                )
                direcciones.append(direccion)

            # Asignar direcciones al cliente
            cliente.direcciones_envio.set(direcciones)

            # Establecer dirección preferida
            if direcciones:
                cliente.direccion_preferida = direcciones[0]
                cliente.save()

            clientes_creados.append(cliente)

            if (i + 1) % 100 == 0:
                print(f"   ✓ {i + 1} clientes creados...")

        except Exception as e:
            print(f"   ⚠️ Error creando cliente {i}: {str(e)}")

    print(f"✅ {len(clientes_creados)} clientes creados exitosamente")
    return clientes_creados


def crear_productos(cantidad=50):
    """Crear productos de prueba"""
    print(f"\n🍰 Creando {cantidad} productos de prueba...")

    productos_creados = []

    categorias = ['postre', 'extra', 'especial']
    nombres_base = [
        "Torta", "Pastel", "Cupcake", "Cookie", "Brownie",
        "Cheesecake", "Pie", "Tarta", "Mousse", "Tiramisu"
    ]
    sabores = [
        "Chocolate", "Vainilla", "Fresa", "Limón", "Coco",
        "Café", "Red Velvet", "Zanahoria", "Tres Leches", "Oreo"
    ]

    for i in range(cantidad):
        try:
            # Generar nombre único
            nombre = f"{random.choice(nombres_base)} de {random.choice(sabores)} Test {i}"

            # Generar 3-8 imágenes de Cloudinary
            num_imagenes = random.randint(3, 8)
            imagenes = [
                f"https://res.cloudinary.com/demo/image/upload/sample{j % 20}.jpg"
                for j in range(num_imagenes)
            ]

            # Crear producto
            producto = Productos.objects.create(
                titulo=nombre,
                categoria=random.choice(categorias),
                descripcion=f"Deliciosa {nombre.lower()} elaborada con los mejores ingredientes. "
                           f"Perfecta para cualquier ocasión especial. Producto de prueba #{i}.",
                imagenes=imagenes
            )

            productos_creados.append(producto)

            if (i + 1) % 10 == 0:
                print(f"   ✓ {i + 1} productos creados...")

        except Exception as e:
            print(f"   ⚠️ Error creando producto {i}: {str(e)}")

    print(f"✅ {len(productos_creados)} productos creados exitosamente")
    return productos_creados


def crear_presentaciones(productos):
    """Crear presentaciones para cada producto"""
    print(f"\n📦 Creando presentaciones para {len(productos)} productos...")

    presentaciones_creadas = []

    proporciones = ["6 porciones", "8 porciones", "10 porciones", "12 porciones", "15 porciones"]

    for producto in productos:
        try:
            # Crear 3-5 presentaciones por producto
            num_presentaciones = random.randint(3, 5)

            for i in range(num_presentaciones):
                presentacion = Presentaciones.objects.create(
                    ref=f"{producto.titulo[:20]}-{i}",
                    proporcion=random.choice(proporciones),
                    precio=round(random.uniform(15.0, 120.0), 2),
                    stock=random.randint(10, 100),  # Stock normal
                    producto=producto
                )
                presentaciones_creadas.append(presentacion)

        except Exception as e:
            print(f"   ⚠️ Error creando presentaciones para {producto.titulo}: {str(e)}")

    # Crear una presentación con stock BAJO para pruebas de race condition
    if productos:
        producto_test = productos[0]
        presentacion_low_stock = Presentaciones.objects.create(
            ref=f"{producto_test.titulo[:20]}-LOW-STOCK",
            proporcion="6 porciones",
            precio=50.0,
            stock=10,  # ⚠️ Stock bajo para pruebas de race condition
            producto=producto_test
        )
        presentaciones_creadas.append(presentacion_low_stock)
        print(f"   ⚠️ Presentación con stock bajo creada: ID {presentacion_low_stock.id}, Stock: 10")

    print(f"✅ {len(presentaciones_creadas)} presentaciones creadas exitosamente")
    return presentaciones_creadas


def crear_reviews(productos, clientes):
    """Crear reviews de clientes para productos"""
    print(f"\n⭐ Creando reviews...")

    reviews_creadas = []

    # Crear reviews para 50% de los productos
    productos_con_reviews = random.sample(productos, len(productos) // 2)

    for producto in productos_con_reviews:
        try:
            # 1-5 reviews por producto
            num_reviews = random.randint(1, 5)

            for _ in range(num_reviews):
                cliente = random.choice(clientes)

                review = Reviews.objects.create(
                    calificacion=random.randint(3, 5),  # Calificaciones buenas (3-5)
                    descripcion=random.choice([
                        "¡Excelente producto! Muy recomendado.",
                        "Delicioso, superó mis expectativas.",
                        "Buena calidad y precio.",
                        "Perfecto para mi celebración.",
                        "Me encantó, volveré a comprar."
                    ]),
                    cliente=cliente,
                    producto=producto
                )
                reviews_creadas.append(review)

        except Exception as e:
            print(f"   ⚠️ Error creando review: {str(e)}")

    print(f"✅ {len(reviews_creadas)} reviews creadas exitosamente")
    return reviews_creadas


def crear_pedidos(clientes, presentaciones, cantidad=2000):
    """Crear pedidos históricos"""
    print(f"\n🛒 Creando {cantidad} pedidos de prueba...")

    pedidos_creados = []

    for i in range(cantidad):
        try:
            cliente = random.choice(clientes)

            # Fecha de pedido (últimos 6 meses)
            fecha_pedido = datetime.now() - timedelta(days=random.randint(0, 180))

            # Fecha de entrega (1-7 días después del pedido)
            fecha_entrega = fecha_pedido + timedelta(days=random.randint(1, 7))

            # Seleccionar dirección de entrega
            direccion_entrega = None
            metodo_entrega = random.choice(["pickup", "delivery"])
            if metodo_entrega == "delivery":
                direcciones = list(cliente.direcciones_envio.all())
                if direcciones:
                    direccion_entrega = random.choice(direcciones)

            # Calcular precio
            precio_base = round(random.uniform(30.0, 200.0), 2)
            iva = 0.16
            precio_delivery = 3.0 if metodo_entrega == "delivery" else 0.0
            monto_total = round(precio_base * (1 + iva) + precio_delivery, 2)

            # Crear pedido
            pedido = Pedidos.objects.create(
                numero_de_orden=10000 + i,
                fecha_pedido=fecha_pedido,
                fecha_entrega=fecha_entrega,
                cliente_asociado=cliente,
                iva=iva,
                monto_total=monto_total,
                nota=f"Pedido de prueba #{i}",
                estado=random.choice(["recibido", "en_proceso", "finalizado"]),
                metodo_pago=random.choice(["zelle", "pago_movil", "stripe"]),
                metodo_entrega=metodo_entrega,
                direccion_entrega=direccion_entrega,
                precio_delivery=precio_delivery
            )

            # Crear descripciones del pedido (1-4 productos)
            num_descripciones = random.randint(1, 4)
            for _ in range(num_descripciones):
                presentacion = random.choice(presentaciones)

                DescripcionesPedido.objects.create(
                    cantidad=random.randint(1, 3),
                    presentacion_asociada=presentacion,
                    sabor=random.choice(["Chocolate", "Vainilla", "Fresa", None]),
                    pedido_asociado=pedido
                )

            pedidos_creados.append(pedido)

            if (i + 1) % 500 == 0:
                print(f"   ✓ {i + 1} pedidos creados...")

        except Exception as e:
            print(f"   ⚠️ Error creando pedido {i}: {str(e)}")

    print(f"✅ {len(pedidos_creados)} pedidos creados exitosamente")
    return pedidos_creados


def crear_ventas(pedidos):
    """Crear ventas para pedidos finalizados"""
    print(f"\n💰 Creando ventas para pedidos finalizados...")

    ventas_creadas = []

    # Solo crear ventas para pedidos finalizados
    pedidos_finalizados = [p for p in pedidos if p.estado == "finalizado"]

    for pedido in pedidos_finalizados:
        try:
            venta = Ventas.objects.create(
                fecha=pedido.fecha_entrega,
                nota=f"Venta completada - Pedido #{pedido.numero_de_orden}",
                pedido=pedido
            )
            ventas_creadas.append(venta)

        except Exception as e:
            print(f"   ⚠️ Error creando venta para pedido {pedido.numero_de_orden}: {str(e)}")

    print(f"✅ {len(ventas_creadas)} ventas creadas exitosamente")
    return ventas_creadas


def mostrar_estadisticas():
    """Mostrar estadísticas finales de la BD"""
    print("\n" + "=" * 60)
    print("📊 ESTADÍSTICAS DE LA BASE DE DATOS")
    print("=" * 60)

    print(f"\n👥 Perfiles: {Perfiles.objects.count()}")
    print(f"   - Clientes: {Perfiles.objects.filter(rol='cliente').count()}")
    print(f"   - Activos: {Perfiles.objects.filter(is_active=True).count()}")

    print(f"\n🏠 Clientes: {Clientes.objects.count()}")
    print(f"   - Direcciones de envío: {DireccionesEnvio.objects.count()}")

    print(f"\n🍰 Productos: {Productos.objects.count()}")
    print(f"   - Por categoría:")
    for categoria in ['postre', 'extra', 'especial']:
        count = Productos.objects.filter(categoria=categoria).count()
        print(f"     * {categoria.capitalize()}: {count}")

    print(f"\n📦 Presentaciones: {Presentaciones.objects.count()}")
    print(f"   - Stock total: {sum(p.stock for p in Presentaciones.objects.all())}")

    print(f"\n⭐ Reviews: {Reviews.objects.count()}")

    print(f"\n🛒 Pedidos: {Pedidos.objects.count()}")
    print(f"   - Por estado:")
    for estado in ['recibido', 'en_proceso', 'finalizado', 'cancelado']:
        count = Pedidos.objects.filter(estado=estado).count()
        print(f"     * {estado.capitalize()}: {count}")

    print(f"\n📝 Descripciones de pedido: {DescripcionesPedido.objects.count()}")

    print(f"\n💰 Ventas: {Ventas.objects.count()}")
    print(f"   - Monto total: ${sum(v.pedido.monto_total for v in Ventas.objects.all()):,.2f}")

    print(f"\n📄 Facturas: {Facturas.objects.count()}")

    print("\n" + "=" * 60)


def main():
    """Función principal"""
    print("=" * 60)
    print("🚀 CARGA DE DATOS DE PRUEBA - KAPATORTAS")
    print("=" * 60)

    # Limpiar datos anteriores
    limpiar_datos_prueba()

    # Crear datos
    clientes = crear_clientes(500)
    productos = crear_productos(50)
    presentaciones = crear_presentaciones(productos)
    reviews = crear_reviews(productos, clientes)
    pedidos = crear_pedidos(clientes, presentaciones, 2000)
    ventas = crear_ventas(pedidos)

    # Mostrar estadísticas
    mostrar_estadisticas()

    print("\n✅ ¡Carga de datos de prueba completada exitosamente!")
    print("\n📝 Notas importantes:")
    print("   - Contraseña de todos los clientes: test123")
    print("   - Emails: cliente0@test.com a cliente499@test.com")
    print("   - Presentación con stock bajo: ID 1 (para pruebas de race condition)")
    print("\n🎯 Listo para ejecutar pruebas de carga con Locust!")


if __name__ == '__main__':
    main()
