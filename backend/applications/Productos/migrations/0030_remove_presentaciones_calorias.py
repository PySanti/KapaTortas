# Generated by Django 4.2.16 on 2024-12-25 19:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Productos', '0029_alter_presentaciones_calorias_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='presentaciones',
            name='calorias',
        ),
    ]
