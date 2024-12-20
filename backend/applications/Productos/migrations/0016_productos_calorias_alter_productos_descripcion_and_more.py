# Generated by Django 4.2.16 on 2024-11-11 11:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Productos', '0015_descripcionproducto_alter_productos_descripcion'),
    ]

    operations = [
        migrations.AddField(
            model_name='productos',
            name='calorias',
            field=models.DecimalField(decimal_places=2, default=None, max_digits=5, null=True),
        ),
        migrations.AlterField(
            model_name='productos',
            name='descripcion',
            field=models.TextField(default=None, null=True),
        ),
        migrations.DeleteModel(
            name='DescripcionProducto',
        ),
    ]
