# Generated by Django 4.2.16 on 2024-11-13 16:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Productos', '0027_alter_presentaciones_producto_asociado'),
    ]

    operations = [
        migrations.AlterField(
            model_name='presentaciones',
            name='producto_asociado',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='presentaciones', to='Productos.productos'),
        ),
    ]
