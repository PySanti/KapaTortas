# Generated by Django 4.2.16 on 2024-11-12 13:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Clientes', '0010_alter_verificationtoken_options'),
    ]

    operations = [
        migrations.RenameField(
            model_name='direccionesenvio',
            old_name='direccion_1',
            new_name='ciudad',
        ),
        migrations.RenameField(
            model_name='direccionesenvio',
            old_name='direccion_2',
            new_name='direccion',
        ),
        migrations.AddField(
            model_name='clientes',
            name='direccion_preferida',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='direcciones_preferidas', to='Clientes.direccionesenvio'),
        ),
        migrations.AddField(
            model_name='direccionesenvio',
            name='referencia',
            field=models.CharField(blank=True, null=True),
        ),
    ]