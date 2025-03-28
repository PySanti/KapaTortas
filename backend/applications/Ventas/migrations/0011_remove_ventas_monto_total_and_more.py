# Generated by Django 4.2.16 on 2024-11-12 12:39

import backend.utils.constants
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Productos', '0021_alter_reviews_calificacion'),
        ('Clientes', '0010_alter_verificationtoken_options'),
        ('Ventas', '0010_ventas_nota'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='ventas',
            name='monto_total',
        ),
        migrations.RemoveField(
            model_name='ventas',
            name='numero_de_orden',
        ),
        migrations.RemoveField(
            model_name='ventas',
            name='productos_asociados',
        ),
        migrations.CreateModel(
            name='Pedidos',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('numero_de_orden', models.IntegerField()),
                ('monto_total', models.DecimalField(decimal_places=2, max_digits=7)),
                ('estado', models.CharField(
                            choices=[
                                ('recibido', 'RECIBIDO'),
                                ('en_proceso', 'EN_PROCESO'),
                                ('cancelado', 'CANCELADO'),
                                ('finalizado', 'FINALIZADO'),
                            ],
                            default=backend.utils.constants.EstadoEnum.RECIBIDO.value  # Fixed
                        )),
                ('metodo_pago', models.CharField(choices=[('zelle', 'ZELLE'), ('pago_movil', 'PAGO_MOVIL'), ('stripe', 'STRIPE')], default=backend.utils.constants.MetodoPagoEnum['PAGO_MOVIL'])),
                ('metodo_entrega', models.CharField(choices=[('pickup', 'PICKUP'), ('delivery', 'DELIVERY')], default=backend.utils.constants.MetodoEntregaEnum['PICKUP'])),
                ('cliente_asociado', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='pedidos', to='Clientes.clientes')),
                ('productos_asociados', models.ManyToManyField(related_name='pedidos', to='Productos.productos')),
            ],
        ),
        migrations.AddField(
            model_name='ventas',
            name='pedido',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, to='Ventas.pedidos'),
        ),
    ]
