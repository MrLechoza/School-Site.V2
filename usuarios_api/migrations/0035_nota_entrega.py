# Generated by Django 5.1 on 2024-11-30 03:28

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios_api', '0034_alter_nota_options_alter_nota_unique_together_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='nota',
            name='entrega',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='usuarios_api.entrega'),
        ),
    ]
