# Generated by Django 4.2.16 on 2024-11-13 10:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Ventas', '0017_descripcionespedido_presentacion_asociada'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pedidos',
            name='monto_total',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=7, null=True),
        ),
    ]
