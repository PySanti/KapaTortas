# Generated by Django 4.2.16 on 2024-11-12 10:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Clientes', '0007_verificationtoken'),
    ]

    operations = [
        migrations.AddField(
            model_name='clientes',
            name='verification_token',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='Clientes.verificationtoken'),
        ),
    ]