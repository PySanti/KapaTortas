# Generated by Django 4.2.16 on 2024-11-13 16:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Productos', '0025_alter_presentaciones_calorias_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='presentaciones',
            name='calorias',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=7, null=True),
        ),
    ]
