# Generated by Django 4.2.16 on 2024-11-06 00:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Perfiles', '0008_remove_perfiles_is_staff_perfiles_contraseña'),
    ]

    operations = [
        migrations.AlterField(
            model_name='perfiles',
            name='numero_telefonico',
            field=models.CharField(),
        ),
    ]
