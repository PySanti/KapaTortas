"""
Script para limpiar datos de prueba entre ejecuciones
"""

import os
import sys
import django

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from applications.Perfiles.models import Perfiles
from applications.Clientes.models import Clientes, DireccionesEnvio
from applications.Productos.models import Productos, Presentaciones, Reviews
from applications.Ventas.models import Pedidos, DescripcionesPedido, Ventas, Facturas


def limpiar_todo():
    """Eliminar TODOS los datos de prueba"""
    print("🗑️  Eliminando todos los datos de prueba...")

    # Contar antes
    count_before = {
        'Facturas': Facturas.objects.count(),
        'Ventas': Ventas.objects.count(),
        'DescripcionesPedido': DescripcionesPedido.objects.count(),
        'Pedidos': Pedidos.objects.count(),
        'Reviews': Reviews.objects.count(),
        'Presentaciones': Presentaciones.objects.count(),
        'Productos': Productos.objects.count(),
        'DireccionesEnvio': DireccionesEnvio.objects.count(),
        'Clientes': Clientes.objects.count(),
        'Perfiles': Perfiles.objects.filter(correo__contains='@test.com').count(),
    }

    print("\n📊 Registros ANTES de limpiar:")
    for tabla, count in count_before.items():
        print(f"   - {tabla}: {count}")

    # Eliminar en orden correcto
    Facturas.objects.all().delete()
    Ventas.objects.all().delete()
    DescripcionesPedido.objects.all().delete()
    Pedidos.objects.all().delete()
    Reviews.objects.all().delete()
    Presentaciones.objects.all().delete()
    Productos.objects.all().delete()

    # Direcciones y clientes
    DireccionesEnvio.objects.all().delete()
    Clientes.objects.all().delete()

    # Perfiles de prueba (solo @test.com)
    Perfiles.objects.filter(correo__contains='@test.com').delete()

    # Contar después
    count_after = {
        'Facturas': Facturas.objects.count(),
        'Ventas': Ventas.objects.count(),
        'DescripcionesPedido': DescripcionesPedido.objects.count(),
        'Pedidos': Pedidos.objects.count(),
        'Reviews': Reviews.objects.count(),
        'Presentaciones': Presentaciones.objects.count(),
        'Productos': Productos.objects.count(),
        'DireccionesEnvio': DireccionesEnvio.objects.count(),
        'Clientes': Clientes.objects.count(),
        'Perfiles': Perfiles.objects.filter(correo__contains='@test.com').count(),
    }

    print("\n📊 Registros DESPUÉS de limpiar:")
    for tabla, count in count_after.items():
        print(f"   - {tabla}: {count}")

    print("\n✅ Base de datos limpiada exitosamente!")


def limpiar_solo_pedidos():
    """Eliminar solo pedidos y ventas, mantener clientes y productos"""
    print("🗑️  Eliminando solo pedidos y ventas...")

    Facturas.objects.all().delete()
    Ventas.objects.all().delete()
    DescripcionesPedido.objects.all().delete()
    Pedidos.objects.all().delete()

    print(f"   ✓ Pedidos eliminados: {Pedidos.objects.count()}")
    print(f"   ✓ Ventas eliminadas: {Ventas.objects.count()}")
    print(f"   ✓ Facturas eliminadas: {Facturas.objects.count()}")

    print("\n✅ Pedidos y ventas eliminados!")


def resetear_stock():
    """Resetear stock de todas las presentaciones a valores aleatorios"""
    import random

    print("🔄 Reseteando stock de presentaciones...")

    presentaciones = Presentaciones.objects.all()
    for p in presentaciones:
        p.stock = random.randint(10, 100)
        p.save()

    # Presentación ID 1 con stock bajo para race condition
    try:
        presentacion_low = Presentaciones.objects.get(id=1)
        presentacion_low.stock = 10
        presentacion_low.save()
        print(f"   ⚠️ Presentación ID 1 reseteada a stock: 10")
    except Presentaciones.DoesNotExist:
        pass

    print(f"✅ Stock reseteado para {presentaciones.count()} presentaciones")


def main():
    """Función principal"""
    print("=" * 60)
    print("🗑️  LIMPIEZA DE BASE DE DATOS - KAPATORTAS")
    print("=" * 60)

    print("\nOpciones:")
    print("1. Limpiar TODO (clientes, productos, pedidos, ventas)")
    print("2. Limpiar solo PEDIDOS y VENTAS (mantener clientes y productos)")
    print("3. Resetear STOCK de presentaciones")
    print("4. Salir")

    try:
        opcion = input("\nSeleccione una opción (1-4): ").strip()

        if opcion == '1':
            confirmar = input("\n⚠️  ¿Está seguro de eliminar TODO? (si/no): ").strip().lower()
            if confirmar == 'si':
                limpiar_todo()
            else:
                print("❌ Operación cancelada")

        elif opcion == '2':
            confirmar = input("\n⚠️  ¿Está seguro de eliminar pedidos y ventas? (si/no): ").strip().lower()
            if confirmar == 'si':
                limpiar_solo_pedidos()
            else:
                print("❌ Operación cancelada")

        elif opcion == '3':
            resetear_stock()

        elif opcion == '4':
            print("👋 Saliendo...")

        else:
            print("❌ Opción inválida")

    except KeyboardInterrupt:
        print("\n\n❌ Operación cancelada por el usuario")


if __name__ == '__main__':
    main()
