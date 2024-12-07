# Generated by Django 5.1 on 2024-11-28 01:11

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios_api', '0026_nota'),
    ]

    operations = [
        migrations.AddField(
            model_name='nota',
            name='entrega',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='nota', to='usuarios_api.entrega'),
        ),
    ]
