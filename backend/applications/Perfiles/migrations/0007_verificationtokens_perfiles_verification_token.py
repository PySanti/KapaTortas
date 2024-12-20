# Generated by Django 4.2.16 on 2024-11-11 14:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Perfiles', '0006_alter_perfiles_is_active'),
    ]

    operations = [
        migrations.CreateModel(
            name='VerificationTokens',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.CharField(max_length=10)),
            ],
        ),
        migrations.AddField(
            model_name='perfiles',
            name='verification_token',
            field=models.OneToOneField(default=None, on_delete=django.db.models.deletion.DO_NOTHING, to='Perfiles.verificationtokens'),
        ),
    ]
