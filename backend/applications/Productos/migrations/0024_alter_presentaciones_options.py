# Generated by Django 4.2.16 on 2024-11-13 00:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Productos', '0023_remove_productos_calorias_remove_productos_precio_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='presentaciones',
            options={'verbose_name': 'Presentación', 'verbose_name_plural': 'Presentaciones'},
        ),
    ]