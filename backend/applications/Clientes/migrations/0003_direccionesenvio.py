# Generated by Django 4.2.16 on 2024-11-08 16:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Clientes', '0002_alter_clientes_options_remove_clientes_groups_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='DireccionesEnvio',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('direccion_1', models.CharField()),
                ('direccion_2', models.CharField()),
                ('pais', models.CharField()),
                ('estado', models.CharField()),
                ('codigo_postal', models.IntegerField()),
            ],
            options={
                'verbose_name': 'DirecciónEnvío',
                'verbose_name_plural': 'DireccionesEnvío',
            },
        ),
    ]
