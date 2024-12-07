# Generated by Django 5.1 on 2024-11-29 23:53

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios_api', '0031_alter_nota_unique_together_alter_nota_estudiante_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='nota',
            name='calificacion',
            field=models.DecimalField(decimal_places=2, help_text='Calificación entre 0 y 100', max_digits=5),
        ),
        migrations.AlterField(
            model_name='nota',
            name='estudiante',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notas', to='usuarios_api.estudiante'),
        ),
    ]
