# Generated by Django 4.2.16 on 2024-11-12 12:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Ventas', '0011_remove_ventas_monto_total_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='pedidos',
            options={'verbose_name': 'Pedido', 'verbose_name_plural': 'Pedidos'},
        ),
    ]
