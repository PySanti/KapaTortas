# Generated by Django 5.1.3 on 2024-11-11 14:00

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Productos', '0019_remove_productos_proporciones'),
    ]

    operations = [
        migrations.AddField(
            model_name='productos',
            name='calorias',
            field=models.DecimalField(decimal_places=2, default=None, max_digits=5, null=True),
        ),
        migrations.AddField(
            model_name='productos',
            name='proporciones',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(choices=[('pequeño', 'PEQUEÑO'), ('mediano', 'MEDIANO'), ('grande', 'GRANDE')], max_length=10), blank=True, default=list, size=None),
        ),
    ]