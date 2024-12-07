from rest_framework import serializers
from usuarios_api.models import UserProfile
from .models import Materias, NivelEscolar, Asignacion, RespuestaAsig, Nota, Entrega
from django.contrib.auth import authenticate


class NotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nota
        fields = ['id', 'calificacion', 'comentarios', 'asignacion', 'entrega', 'fecha_asignacion']

    def create(self, validated_data):
        estudiante = validated_data.pop('estudiante')  
        user_profile = self.context['request'].user.userprofile  

        nota = Nota.objects.create(
            user_profile=user_profile,
            estudiante=estudiante,
            **validated_data  
        )
        return nota


class UserSerializer(serializers.ModelSerializer):
    notas = NotaSerializer(many=True, read_only=True)
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'password', 'phone', 'notas', 'avatar', 'is_student', 'is_teacher']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
        }

    def get_notas(self, obj):
        notas = Nota.objects.filter(user_profile=obj)
        serializer = NotaSerializer(notas, many=True)
        return serializer.data
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = UserProfile(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
        
        
class UserProfileImage(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('avatar')
        
        
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    password = serializers.CharField(max_length=255, write_only=True)
    is_student = serializers.BooleanField(read_only=True)
    is_teacher = serializers.BooleanField(read_only=True)
    is_staff = serializers.BooleanField(read_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            raise serializers.ValidationError('Debe proporcionar ambos campos...')

        return data

    def create(self, validated_data):
        email = validated_data.get('email')
        password = validated_data.get('password')
        user = authenticate(email=email, password=password)

        if user:
            return {
                'email': user.email,
                'is_student': user.is_student(), 
                'is_teacher': user.is_teacher(), 
                'is_staff' : user.is_staff() ,
            }
        else:
            raise serializers.ValidationError('Las credenciales son incorrectas...')

class MateriaSerializer(serializers.ModelSerializer):
    nivel_escolar = serializers.CharField()  

    class Meta:
        model = Materias
        fields = ['id', 'nombre', 'descripcion', 'nivel_escolar']

    def create(self, validated_data):
    
        nivel_escolar_nombre = validated_data.pop('nivel_escolar')
        nivel_escolar, created = NivelEscolar.objects.get_or_create(nombre=nivel_escolar_nombre)
        materia = Materias.objects.create(nivel_escolar=nivel_escolar, **validated_data)
        return materia


class AsignacionSerializer(serializers.ModelSerializer):
    estudiantes = UserSerializer(many=True, read_only=True)
    profesor = serializers.StringRelatedField()
    archivo_url = serializers.SerializerMethodField()

    class Meta:
        model = Asignacion
        fields = ['id', 'materia_id', 'titulo', 'descripcion', 'fechaLimite', 'estudiantes', 'profesor', 'archivo', 'archivo_url']
        
    def get_archivo_url(self, obj):
        return obj.archivo.url if obj.archivo else None
    
    def get_archivoNombre(self, obj):
        return obj.archivo.name if obj.archivo else None

    def create(self, validated_data):
        request = self.context.get('request')
        profesor = request.user
        asignacion = Asignacion.objects.create(profesor=profesor, **validated_data)
        return asignacion
    
    
class RespuestaAsigSerializer(serializers.ModelSerializer):
    class Meta:
        model = RespuestaAsig
        fields = '__all__'
        
        
class UserSettingsSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False)
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'phone', 'avatar', 'password']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'email': {'required': True},
        }

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
    


class EstudianteSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'avatar']
        
        
class EntregaSerializer(serializers.ModelSerializer):
    class Meta:
            model = Entrega
            fields = ['id', 'asignacion', 'estudiante'] 