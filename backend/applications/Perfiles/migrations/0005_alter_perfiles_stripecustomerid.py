# Generated by Django 4.2.16 on 2024-11-10 01:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Perfiles', '0004_alter_perfiles_stripecustomerid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='perfiles',
            name='stripeCustomerId',
            field=models.CharField(blank=True, null=True, unique=True),
        ),
    ]
