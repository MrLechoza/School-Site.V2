# Generated by Django 5.1 on 2024-12-01 02:48

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios_api', '0041_estudiante_username'),
    ]

    operations = [
        migrations.AlterField(
            model_name='entrega',
            name='estudiante',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
