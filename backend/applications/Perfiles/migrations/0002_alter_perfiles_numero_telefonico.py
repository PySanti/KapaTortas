# Generated by Django 4.2.16 on 2024-11-09 22:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Perfiles', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='perfiles',
            name='numero_telefonico',
            field=models.CharField(blank=True, null=True, unique=True),
        ),
    ]
