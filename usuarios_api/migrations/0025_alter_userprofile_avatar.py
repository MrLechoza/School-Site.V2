# Generated by Django 5.1 on 2024-11-27 01:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios_api', '0024_alter_userprofile_avatar'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='avatar',
            field=models.ImageField(blank=True, null=True, upload_to='avatar'),
        ),
    ]