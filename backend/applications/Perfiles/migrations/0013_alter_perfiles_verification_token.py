# Generated by Django 4.2.16 on 2024-11-11 18:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Perfiles', '0012_perfiles_verification_token'),
    ]

    operations = [
        migrations.AlterField(
            model_name='perfiles',
            name='verification_token',
            field=models.CharField(blank=True, max_length=10, null=True, unique=True),
        ),
    ]