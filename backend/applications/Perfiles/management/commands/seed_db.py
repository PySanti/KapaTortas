"""
Comando de Django para poblar la base de datos con datos de ejemplo.
Ejecutar con: python manage.py seed_db
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta, date
from applications.Perfiles.models import Perfiles
from applications.Clientes.models import Clientes, DireccionesEnvio
from applications.Productos.models import Productos, Presentaciones, Reviews
from applications.Ventas.models import Pedidos, DescripcionesPedido, Ventas, Facturas
from backend.utils.constants import (
    RolEnum, EstadoEnum, MetodoPagoEnum, MetodoEntregaEnum,
    CategoriaProductoEnum, DeliveryZoneEnum
)


class Command(BaseCommand):
    help = 'Pobla la base de datos con datos de ejemplo'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Iniciando seed de la base de datos...'))
        
        # Limpiar datos existentes (opcional - comentar si no quieres borrar datos)
        # self.stdout.write(self.style.WARNING('Limpiando datos existentes...'))
        # self._clear_data()
        
        # Crear usuarios
        admin_user = self._create_admin()
        employee_user = self._create_employee()
        client_user, client = self._create_client()
        
        # Crear direcciones de envío
        direccion1 = self._create_direccion_1()
        direccion2 = self._create_direccion_2()
        
        # Asociar direcciones al cliente
        client.direcciones.add(direccion1, direccion2)
        client.direccion_preferida = direccion1
        client.save()
        
        # Crear productos
        torta_chocolate = self._create_torta_chocolate()
        velita = self._create_velita()
        torta_vainilla = self._create_torta_vainilla()
        torta_personalizada = self._create_torta_personalizada()
        
        # Crear presentaciones
        pres_torta_choc_peque = self._create_presentacion(
            torta_chocolate, "Pequeña", 8.00, 10
        )
        pres_torta_choc_grande = self._create_presentacion(
            torta_chocolate, "Grande", 18.00, 5
        )
        pres_velita_normal = self._create_presentacion(
            velita, "normal", 2.00, 50
        )
        pres_torta_vainilla_mediana = self._create_presentacion(
            torta_vainilla, "Mediana", 12.00, 8
        )
        # Crear presentaciones para el producto especial
        pres_torta_personalizada_peque = self._create_presentacion(
            torta_personalizada, "Pequeña", 15.00, 20
        )
        pres_torta_personalizada_mediana = self._create_presentacion(
            torta_personalizada, "Mediana", 25.00, 15
        )
        pres_torta_personalizada_grande = self._create_presentacion(
            torta_personalizada, "Grande", 35.00, 10
        )
        
        # Crear pedidos
        pedido1 = self._create_pedido_1(client, direccion1, pres_torta_choc_peque, pres_velita_normal)
        pedido2 = self._create_pedido_2(client, direccion2, pres_torta_choc_grande)
        pedido3 = self._create_pedido_3(client, direccion1, pres_torta_vainilla_mediana, pres_velita_normal)
        pedido4 = self._create_pedido_4(client, direccion2, pres_torta_choc_grande, pres_velita_normal)
        pedido5 = self._create_pedido_5(client, direccion1, pres_torta_choc_peque, pres_torta_vainilla_mediana)
        
        # Crear reviews
        self._create_review(client, torta_chocolate, 5, "Excelente torta de chocolate, muy rica y cremosa!")
        self._create_review(client, velita, 4, "Buenas velitas, perfectas para decorar")
        
        # Crear ventas y facturas (5 de cada una)
        self._create_venta_factura(pedido1)
        self._create_venta_factura(pedido2)
        self._create_venta_factura(pedido3)
        self._create_venta_factura(pedido4)
        self._create_venta_factura(pedido5)
        
        self.stdout.write(self.style.SUCCESS('✓ Seed completado exitosamente!'))
        self.stdout.write(self.style.SUCCESS(f'  - Admin: {admin_user.correo}'))
        self.stdout.write(self.style.SUCCESS(f'  - Empleado: {employee_user.correo}'))
        self.stdout.write(self.style.SUCCESS(f'  - Cliente: {client_user.correo}'))
        self.stdout.write(self.style.SUCCESS(f'  - Productos: 4 (incluye producto especial)'))
        self.stdout.write(self.style.SUCCESS(f'  - Pedidos: 5'))
        self.stdout.write(self.style.SUCCESS(f'  - Reviews: 2'))
        self.stdout.write(self.style.SUCCESS(f'  - Ventas: 5'))
        self.stdout.write(self.style.SUCCESS(f'  - Facturas: 5'))

    def _create_admin(self):
        """Crea un usuario administrador"""
        admin, created = Perfiles.objects.get_or_create(
            correo='admin@kapatortas.com',
            defaults={
                'nombre_completo': 'Administrador KapaTortas',
                'contraseña': 'admin123',
                'rol': RolEnum.ADMIN.value,
                'is_active': True,
                'is_staff': True,
                'is_superuser': True,
                'numero_telefonico': '+58 4241234567',
                'cedula': '12345678',
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Admin creado'))
        else:
            self.stdout.write(self.style.WARNING('⚠ Admin ya existe'))
        return admin

    def _create_employee(self):
        """Crea un usuario empleado"""
        employee, created = Perfiles.objects.get_or_create(
            correo='empleado@kapatortas.com',
            defaults={
                'nombre_completo': 'María González',
                'contraseña': 'empleado123',
                'rol': RolEnum.EMPLEADO.value,
                'is_active': True,
                'is_staff': True,
                'numero_telefonico': '+58 4249876543',
                'cedula': '87654321',
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Empleado creado'))
        else:
            self.stdout.write(self.style.WARNING('⚠ Empleado ya existe'))
        return employee

    def _create_client(self):
        """Crea un usuario cliente"""
        client_user, created = Perfiles.objects.get_or_create(
            correo='cliente@example.com',
            defaults={
                'nombre_completo': 'Juan Pérez',
                'contraseña': 'cliente123',
                'rol': RolEnum.CLIENTE.value,
                'is_active': True,
                'numero_telefonico': '+58 4141234567',
                'cedula': '11223344',
                'fecha_nacimiento': date(1990, 5, 15),
            }
        )
        
        if created:
            # Crear el cliente asociado
            client = Clientes.objects.crear_cliente(perfil=client_user)
            self.stdout.write(self.style.SUCCESS('✓ Cliente creado'))
        else:
            client = client_user.cliente
            self.stdout.write(self.style.WARNING('⚠ Cliente ya existe'))
        
        return client_user, client

    def _create_direccion_1(self):
        """Crea la primera dirección de envío"""
        direccion, created = DireccionesEnvio.objects.get_or_create(
            codigo_postal=1080,
            direccion='Calle Valle Alto',
            defaults={
                'pais': 'VENEZUELA',
                'estado': 'Miranda',
                'ciudad': 'Santa fe Sur',
                'referencia': 'Casa blanca, portón azul',
            }
        )
        return direccion

    def _create_direccion_2(self):
        """Crea la segunda dirección de envío"""
        direccion, created = DireccionesEnvio.objects.get_or_create(
            codigo_postal=1050,
            direccion='Avenida Principal',
            defaults={
                'pais': 'VENEZUELA',
                'estado': 'Distrito Capital',
                'ciudad': 'CARACAS',
                'referencia': 'Edificio Los Rosales, apto 5B',
            }
        )
        return direccion

    def _create_torta_chocolate(self):
        """Crea el producto Torta de Chocolate"""
        producto, created = Productos.objects.get_or_create(
            titulo='Torta de Chocolate',
            defaults={
                'categoria': CategoriaProductoEnum.POSTRE.value,
                'descripcion': 'Deliciosa torta de chocolate con crema y decoración especial',
                'imagenes': [
                    'https://res.cloudinary.com/dhxc2ozvw/image/upload/v1731461803/kapatortas/mrj1blecofoxp0cggjsc.png',
                    'https://res.cloudinary.com/dhxc2ozvw/image/upload/v1731461804/kapatortas/tua2kljkkkxlxu0ontul.png'
                ]
            }
        )
        return producto

    def _create_velita(self):
        """Crea el producto Velita"""
        producto, created = Productos.objects.get_or_create(
            titulo='Velita',
            defaults={
                'categoria': CategoriaProductoEnum.EXTRA.value,
                'descripcion': 'Velitas decorativas para tortas',
                'imagenes': []
            }
        )
        return producto

    def _create_torta_vainilla(self):
        """Crea el producto Torta de Vainilla"""
        producto, created = Productos.objects.get_or_create(
            titulo='Torta de Vainilla',
            defaults={
                'categoria': CategoriaProductoEnum.POSTRE.value,
                'descripcion': 'Exquisita torta de vainilla con relleno de crema',
                'imagenes': [
                    'https://res.cloudinary.com/dhxc2ozvw/image/upload/v1731461803/kapatortas/mrj1blecofoxp0cggjsc.png'
                ]
            }
        )
        return producto

    def _create_torta_personalizada(self):
        """Crea el producto especial para personalización"""
        producto, created = Productos.objects.get_or_create(
            titulo='Torta Personalizada',
            defaults={
                'categoria': CategoriaProductoEnum.ESPECIAL.value,
                'descripcion': 'Crea tu propia torta personalizada eligiendo capas, sabores y decoraciones',
                'imagenes': [
                    'https://res.cloudinary.com/dhxc2ozvw/image/upload/v1731461803/kapatortas/mrj1blecofoxp0cggjsc.png'
                ]
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Producto especial (Torta Personalizada) creado'))
        else:
            self.stdout.write(self.style.WARNING('⚠ Producto especial ya existe'))
        return producto

    def _create_presentacion(self, producto, proporcion, precio, stock):
        """Crea una presentación para un producto"""
        presentacion, created = Presentaciones.objects.get_or_create(
            producto_asociado=producto,
            proporcion=proporcion,
            defaults={
                'precio': precio,
                'stock': stock,
                'ref': f'{producto.titulo} - {proporcion}'
            }
        )
        return presentacion

    def _create_pedido_1(self, cliente, direccion, pres_torta, pres_velita):
        """Crea el primer pedido (similar al ejemplo del usuario)"""
        fecha_pedido = timezone.now() - timedelta(days=2)
        pedido, created = Pedidos.objects.get_or_create(
            numero_de_orden=17327,
            defaults={
                'cliente_asociado': cliente,
                'fecha_pedido': fecha_pedido,
                'monto_total': 18.00,
                'estado': EstadoEnum.RECIBIDO.value,
                'metodo_pago': MetodoPagoEnum.ZELLE.value,
                'metodo_entrega': MetodoEntregaEnum.PICKUP.value,
                'direccion_entrega': direccion,
                'precio_delivery': DeliveryZoneEnum.PICK_UP.value,
            }
        )
        
        if created:
            # Crear descripciones del pedido
            DescripcionesPedido.objects.create(
                pedido_asociado=pedido,
                presentacion_asociada=pres_torta,
                cantidad=2,
                sabor='Chocolate'
            )
            DescripcionesPedido.objects.create(
                pedido_asociado=pedido,
                presentacion_asociada=pres_velita,
                cantidad=1,
            )
            self.stdout.write(self.style.SUCCESS('✓ Pedido 1 creado'))
        
        return pedido

    def _create_pedido_2(self, cliente, direccion, pres_torta_grande):
        """Crea el segundo pedido"""
        fecha_pedido = timezone.now() - timedelta(days=1)
        pedido, created = Pedidos.objects.get_or_create(
            numero_de_orden=17328,
            defaults={
                'cliente_asociado': cliente,
                'fecha_pedido': fecha_pedido,
                'monto_total': 18.00,
                'estado': EstadoEnum.EN_PROCESO.value,
                'metodo_pago': MetodoPagoEnum.PAGO_MOVIL.value,
                'metodo_entrega': MetodoEntregaEnum.DELIVERY.value,
                'direccion_entrega': direccion,
                'precio_delivery': DeliveryZoneEnum.ALTAMIRA.value,
                'nota': 'Por favor entregar antes de las 3pm'
            }
        )
        
        if created:
            DescripcionesPedido.objects.create(
                pedido_asociado=pedido,
                presentacion_asociada=pres_torta_grande,
                cantidad=1,
                sabor='Chocolate'
            )
            self.stdout.write(self.style.SUCCESS('✓ Pedido 2 creado'))
        
        return pedido

    def _create_pedido_3(self, cliente, direccion, pres_torta_vainilla, pres_velita):
        """Crea el tercer pedido"""
        fecha_pedido = timezone.now() - timedelta(hours=5)
        pedido, created = Pedidos.objects.get_or_create(
            numero_de_orden=17329,
            defaults={
                'cliente_asociado': cliente,
                'fecha_pedido': fecha_pedido,
                'monto_total': 14.00,
                'estado': EstadoEnum.RECIBIDO.value,
                'metodo_pago': MetodoPagoEnum.STRIPE.value,
                'metodo_entrega': MetodoEntregaEnum.PICKUP.value,
                'direccion_entrega': direccion,
                'precio_delivery': DeliveryZoneEnum.PICK_UP.value,
            }
        )
        
        if created:
            DescripcionesPedido.objects.create(
                pedido_asociado=pedido,
                presentacion_asociada=pres_torta_vainilla,
                cantidad=1,
                sabor='Vainilla'
            )
            DescripcionesPedido.objects.create(
                pedido_asociado=pedido,
                presentacion_asociada=pres_velita,
                cantidad=1,
            )
            self.stdout.write(self.style.SUCCESS('✓ Pedido 3 creado'))
        
        return pedido

    def _create_pedido_4(self, cliente, direccion, pres_torta_grande, pres_velita):
        """Crea el cuarto pedido"""
        fecha_pedido = timezone.now() - timedelta(days=7)
        pedido, created = Pedidos.objects.get_or_create(
            numero_de_orden=17330,
            defaults={
                'cliente_asociado': cliente,
                'fecha_pedido': fecha_pedido,
                'fecha_entrega': fecha_pedido + timedelta(days=1),
                'monto_total': 20.00,
                'estado': EstadoEnum.FINALIZADO.value,
                'metodo_pago': MetodoPagoEnum.ZELLE.value,
                'metodo_entrega': MetodoEntregaEnum.DELIVERY.value,
                'direccion_entrega': direccion,
                'precio_delivery': DeliveryZoneEnum.CHACAO.value,
                'nota': 'Entregado exitosamente'
            }
        )
        
        if created:
            DescripcionesPedido.objects.create(
                pedido_asociado=pedido,
                presentacion_asociada=pres_torta_grande,
                cantidad=1,
                sabor='Chocolate'
            )
            DescripcionesPedido.objects.create(
                pedido_asociado=pedido,
                presentacion_asociada=pres_velita,
                cantidad=1,
            )
            self.stdout.write(self.style.SUCCESS('✓ Pedido 4 creado'))
        
        return pedido

    def _create_pedido_5(self, cliente, direccion, pres_torta_choc_peque, pres_torta_vainilla):
        """Crea el quinto pedido"""
        fecha_pedido = timezone.now() - timedelta(days=10)
        pedido, created = Pedidos.objects.get_or_create(
            numero_de_orden=17331,
            defaults={
                'cliente_asociado': cliente,
                'fecha_pedido': fecha_pedido,
                'fecha_entrega': fecha_pedido + timedelta(days=2),
                'monto_total': 20.00,
                'estado': EstadoEnum.FINALIZADO.value,
                'metodo_pago': MetodoPagoEnum.PAGO_MOVIL.value,
                'metodo_entrega': MetodoEntregaEnum.PICKUP.value,
                'direccion_entrega': direccion,
                'precio_delivery': DeliveryZoneEnum.PICK_UP.value,
                'iva': 2.00,
                'nota': 'Pedido para celebración especial'
            }
        )
        
        if created:
            DescripcionesPedido.objects.create(
                pedido_asociado=pedido,
                presentacion_asociada=pres_torta_choc_peque,
                cantidad=1,
                sabor='Chocolate'
            )
            DescripcionesPedido.objects.create(
                pedido_asociado=pedido,
                presentacion_asociada=pres_torta_vainilla,
                cantidad=1,
                sabor='Vainilla'
            )
            self.stdout.write(self.style.SUCCESS('✓ Pedido 5 creado'))
        
        return pedido

    def _create_review(self, cliente, producto, calificacion, descripcion):
        """Crea una review"""
        review, created = Reviews.objects.get_or_create(
            cliente_asociado=cliente,
            producto_asociado=producto,
            defaults={
                'calificacion': calificacion,
                'descripcion': descripcion
            }
        )
        return review

    def _create_venta_factura(self, pedido):
        """Crea una venta y factura asociada a un pedido"""
        venta, created = Ventas.objects.get_or_create(
            pedido=pedido,
            defaults={
                'nota': f'Venta del pedido #{pedido.numero_de_orden}',
                'fecha': pedido.fecha_pedido
            }
        )
        
        if created:
            factura, _ = Facturas.objects.get_or_create(
                venta_asociada=venta,
                defaults={
                    'fecha_emision_factura': venta.fecha
                }
            )
            self.stdout.write(self.style.SUCCESS(f'✓ Venta y factura creadas para pedido #{pedido.numero_de_orden}'))
        
        return venta

    def _clear_data(self):
        """Limpia todos los datos (usar con precaución)"""
        Facturas.objects.all().delete()
        Ventas.objects.all().delete()
        DescripcionesPedido.objects.all().delete()
        Pedidos.objects.all().delete()
        Reviews.objects.all().delete()
        Presentaciones.objects.all().delete()
        Productos.objects.all().delete()
        Clientes.objects.all().delete()
        DireccionesEnvio.objects.all().delete()
        Perfiles.objects.filter(rol__in=[RolEnum.ADMIN.value, RolEnum.EMPLEADO.value, RolEnum.CLIENTE.value]).delete()

