# Generated by Django 4.2.16 on 2024-11-15 19:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Clientes', '0014_alter_clientes_perfil_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clientes',
            name='direcciones',
            field=models.ManyToManyField(related_name='clientes', to='Clientes.direccionesenvio'),
        ),
    ]
