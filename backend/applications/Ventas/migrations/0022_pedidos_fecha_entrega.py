# Generated by Django 4.2.16 on 2024-11-13 21:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Ventas', '0021_remove_ventas_direccion_pedidos_direccion_entrega'),
    ]

    operations = [
        migrations.AddField(
            model_name='pedidos',
            name='fecha_entrega',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
