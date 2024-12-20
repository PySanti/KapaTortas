# Generated by Django 4.2.16 on 2024-11-12 14:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Productos', '0022_remove_productos_proporciones'),
        ('Ventas', '0014_pedidos_descripcion_pedido'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pedidos',
            name='descripcion_pedido',
        ),
        migrations.RemoveField(
            model_name='pedidos',
            name='productos_asociados',
        ),
        migrations.CreateModel(
            name='DescripcionesPedido',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cantidad', models.IntegerField()),
                ('pedido_asociado', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='descripciones_pedido', to='Ventas.pedidos')),
                ('producto_asociado', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='descripciones_pedido', to='Productos.productos')),
            ],
        ),
    ]
