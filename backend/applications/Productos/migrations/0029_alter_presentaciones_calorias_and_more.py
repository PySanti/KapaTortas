# Generated by Django 4.2.16 on 2024-11-15 14:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Productos', '0028_alter_presentaciones_producto_asociado'),
    ]

    operations = [
        migrations.AlterField(
            model_name='presentaciones',
            name='calorias',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='presentaciones',
            name='precio',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
