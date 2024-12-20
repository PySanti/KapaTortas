# Generated by Django 4.2.16 on 2024-11-13 16:55

import backend.utils.get_current_time
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Productos', '0026_alter_presentaciones_calorias'),
        ('Ventas', '0019_pedidos_fecha_pedido'),
    ]

    operations = [
        migrations.AlterField(
            model_name='descripcionespedido',
            name='pedido_asociado',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='descripciones_pedido', to='Ventas.pedidos'),
        ),
        migrations.AlterField(
            model_name='descripcionespedido',
            name='presentacion_asociada',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='descripciones_pedido', to='Productos.presentaciones'),
        ),
        migrations.AlterField(
            model_name='descripcionespedido',
            name='producto_asociado',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='descripciones_pedido', to='Productos.productos'),
        ),
        migrations.AlterField(
            model_name='pedidos',
            name='fecha_pedido',
            field=models.DateTimeField(blank=True, default=backend.utils.get_current_time.get_current_time, null=True),
        ),
    ]
