"""
Script para verificar consistencia de datos después de pruebas de carga
"""

import os
import sys
import django

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from applications.Productos.models import Presentaciones
from applications.Ventas.models import Pedidos, DescripcionesPedido
from django.db.models import Sum, Count


def verificar_stock_negativo():
    """Verificar si hay presentaciones con stock negativo"""
    print("\n🔍 Verificando stock negativo...")

    presentaciones_negativas = Presentaciones.objects.filter(stock__lt=0)

    if presentaciones_negativas.exists():
        print(f"   ❌ PROBLEMA: {presentaciones_negativas.count()} presentaciones con stock negativo:")
        for p in presentaciones_negativas:
            print(f"      - ID {p.id}: {p.ref} - Stock: {p.stock}")
        return False
    else:
        print("   ✅ No hay presentaciones con stock negativo")
        return True


def verificar_stock_cero_sin_eliminar():
    """Verificar presentaciones con stock 0 que deberían estar eliminadas"""
    print("\n🔍 Verificando presentaciones con stock 0...")

    presentaciones_cero = Presentaciones.objects.filter(stock=0)

    if presentaciones_cero.exists():
        print(f"   ⚠️  ADVERTENCIA: {presentaciones_cero.count()} presentaciones con stock 0:")
        for p in presentaciones_cero[:10]:  # Mostrar solo las primeras 10
            print(f"      - ID {p.id}: {p.ref}")
        if presentaciones_cero.count() > 10:
            print(f"      ... y {presentaciones_cero.count() - 10} más")
        return True
    else:
        print("   ✅ No hay presentaciones con stock 0")
        return True


def verificar_pedidos_duplicados():
    """Verificar si hay números de orden duplicados"""
    print("\n🔍 Verificando pedidos duplicados...")

    duplicados = Pedidos.objects.values('numero_de_orden').annotate(
        count=Count('id')
    ).filter(count__gt=1)

    if duplicados.exists():
        print(f"   ❌ PROBLEMA: {duplicados.count()} números de orden duplicados:")
        for d in duplicados:
            print(f"      - Orden #{d['numero_de_orden']}: {d['count']} veces")
        return False
    else:
        print("   ✅ No hay pedidos duplicados")
        return True


def verificar_integridad_descripciones():
    """Verificar que todas las descripciones tienen presentación y pedido válidos"""
    print("\n🔍 Verificando integridad de descripciones...")

    total_descripciones = DescripcionesPedido.objects.count()

    # Descripciones sin presentación
    sin_presentacion = DescripcionesPedido.objects.filter(presentacion_asociada__isnull=True).count()

    # Descripciones sin pedido
    sin_pedido = DescripcionesPedido.objects.filter(pedido_asociado__isnull=True).count()

    problemas = False

    if sin_presentacion > 0:
        print(f"   ❌ PROBLEMA: {sin_presentacion} descripciones sin presentación asociada")
        problemas = True

    if sin_pedido > 0:
        print(f"   ❌ PROBLEMA: {sin_pedido} descripciones sin pedido asociado")
        problemas = True

    if not problemas:
        print(f"   ✅ Todas las {total_descripciones} descripciones tienen datos válidos")

    return not problemas


def verificar_overselling():
    """
    Verificar si se vendieron más unidades de las disponibles (overselling)
    Compara stock actual vs. cantidad vendida
    """
    print("\n🔍 Verificando overselling (venta excesiva)...")

    problemas = []

    for presentacion in Presentaciones.objects.all():
        # Calcular total vendido
        total_vendido = DescripcionesPedido.objects.filter(
            presentacion_asociada=presentacion
        ).aggregate(total=Sum('cantidad'))['total'] or 0

        # Stock actual + vendido debería ser >= 0
        stock_inicial_estimado = presentacion.stock + total_vendido

        if stock_inicial_estimado < total_vendido:
            problemas.append({
                'presentacion': presentacion,
                'stock_actual': presentacion.stock,
                'total_vendido': total_vendido,
                'stock_inicial_estimado': stock_inicial_estimado
            })

    if problemas:
        print(f"   ⚠️  ADVERTENCIA: Posible overselling en {len(problemas)} presentaciones:")
        for p in problemas[:10]:
            print(f"      - ID {p['presentacion'].id}: Stock actual: {p['stock_actual']}, "
                  f"Vendido: {p['total_vendido']}")
        return False
    else:
        print("   ✅ No se detectó overselling")
        return True


def verificar_pedidos_sin_descripciones():
    """Verificar pedidos que no tienen descripciones"""
    print("\n🔍 Verificando pedidos sin descripciones...")

    pedidos_vacios = []

    for pedido in Pedidos.objects.all():
        if pedido.descripcionespedido_set.count() == 0:
            pedidos_vacios.append(pedido)

    if pedidos_vacios:
        print(f"   ⚠️  ADVERTENCIA: {len(pedidos_vacios)} pedidos sin descripciones:")
        for p in pedidos_vacios[:10]:
            print(f"      - Orden #{p.numero_de_orden}")
        return False
    else:
        print("   ✅ Todos los pedidos tienen descripciones")
        return True


def verificar_montos_pedidos():
    """Verificar que los montos de pedidos sean consistentes"""
    print("\n🔍 Verificando montos de pedidos...")

    pedidos_inconsistentes = []

    for pedido in Pedidos.objects.all()[:100]:  # Verificar primeros 100
        if pedido.monto_total <= 0:
            pedidos_inconsistentes.append(pedido)

    if pedidos_inconsistentes:
        print(f"   ⚠️  ADVERTENCIA: {len(pedidos_inconsistentes)} pedidos con monto <= 0:")
        for p in pedidos_inconsistentes:
            print(f"      - Orden #{p.numero_de_orden}: Monto ${p.monto_total}")
        return False
    else:
        print("   ✅ Montos de pedidos son consistentes")
        return True


def generar_reporte_completo():
    """Generar reporte completo de verificación"""
    print("=" * 60)
    print("🔍 VERIFICACIÓN DE CONSISTENCIA DE DATOS")
    print("=" * 60)

    resultados = {
        'Stock negativo': verificar_stock_negativo(),
        'Stock cero': verificar_stock_cero_sin_eliminar(),
        'Pedidos duplicados': verificar_pedidos_duplicados(),
        'Integridad de descripciones': verificar_integridad_descripciones(),
        'Overselling': verificar_overselling(),
        'Pedidos sin descripciones': verificar_pedidos_sin_descripciones(),
        'Montos de pedidos': verificar_montos_pedidos(),
    }

    print("\n" + "=" * 60)
    print("📊 RESUMEN DE VERIFICACIÓN")
    print("=" * 60)

    total_verificaciones = len(resultados)
    verificaciones_exitosas = sum(resultados.values())

    for nombre, resultado in resultados.items():
        icono = "✅" if resultado else "❌"
        print(f"{icono} {nombre}")

    print("\n" + "-" * 60)
    print(f"Resultado: {verificaciones_exitosas}/{total_verificaciones} verificaciones exitosas")

    if verificaciones_exitosas == total_verificaciones:
        print("✅ ¡TODOS LOS TESTS PASARON! Base de datos consistente.")
    else:
        print("⚠️  Se encontraron problemas de consistencia. Revisar detalles arriba.")

    print("=" * 60)

    return verificaciones_exitosas == total_verificaciones


if __name__ == '__main__':
    generar_reporte_completo()
