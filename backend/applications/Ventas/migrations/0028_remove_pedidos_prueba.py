# Generated by Django 4.2.16 on 2024-12-25 20:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Ventas', '0027_pedidos_prueba'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pedidos',
            name='prueba',
        ),
    ]