from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from usuarios_api.serializers import UserSerializer, LoginSerializer,MateriaSerializer, AsignacionSerializer, UserProfileImage
from rest_framework import status
from rest_framework.authtoken.models import Token
from usuarios_api.models import UserProfile, Asignacion, Tarea, TareaForm, Materias
from django.contrib.auth import authenticate, logout
from django.core.mail import send_mail
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth import logout as django_logout
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import FileResponse
from django.shortcuts import get_object_or_404

@api_view(['OPTIONS'])
def register_options(request):
    return Response(status=status.HTTP_200_OK)

@api_view(['GET'])
def response_after_save(request, obj_id, token_key):
    obj = UserProfile.objects.get(id=obj_id)
    return Response({'token': token_key, 'user': obj})

@api_view(['POST'])
def register(request):
    print(request.data)
    data = dict(request.data)
    

    if data['is_student']:
        register_student(data)
        return Response({'message': 'Solicitud de registro enviada con exito'})

    else:
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            user.set_password(data['password'])
            user.save()
            
            if request.user.is_authenticated:
                user.created_by = request.user
                user.save()
            
            token = Token.objects.create(user=user)

            return Response({'token': token.key, 'user': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def register_student(student_data):
    if not isinstance(student_data, dict):
        print("Error: student_data no es un diccionario")
        return HttpResponse('Error al enviar solicitud de registro')

    try:
        subject = 'Solicitud de registro de estudiante'
        message = f'Un estudiante ha solicitado registrarse con los siguientes datos:\n\n' \
            f"Correo electronico: {student_data['email']}\n" \
            f"Nombre: {student_data['username']}\n"\
            f"Contraseña: {student_data['password']}\n"\

        from_email = student_data['email']
        recipient_list = ['diegogelvis14@gmail.com']

        send_mail(subject, message, from_email, recipient_list)
        print("Mensaje que se iba a enviar:")
        print("Asunto:", subject)
        print("Cuerpo del mensaje:", message)
        return HttpResponse('Solicitud de registro enviada con éxito')
    except Exception as e:
        print("Error al enviar solicitud de registro:", str(e))
        return HttpResponse('Error al enviar solicitud de registro')


@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        user = authenticate(email=email, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
           
            return Response({
                'token': token.key, 
                'user': user.username,
                'is_student': user.is_student,
                'is_teacher': user.is_teacher,
                'is_staff' : user.is_staff})
        else:
            return Response({'error': 'Las credenciales son incorrectas...'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated]) 
def logout(request):
    try:
        token = Token.objects.get(user=request.user)
        token.delete()  
        django_logout(request)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
    except Token.DoesNotExist:
        return Response({'error': 'Token not found'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def register_message(request):
    return Response({'message': 'Datos enviados correctamente.'})


@api_view(['OPTIONS'])
def menu(request):
    return Response(status=status.HTTP_200_OK)


@api_view(['POST'])
def register_Student_by_teacher(request):
    data = request.data
    data['is_student'] = True
    serializer = UserSerializer(data=data)
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(serializer.validated_data['password']) 
        user.is_student = True  
        user.save()
        token = Token.objects.create(user=user)
        return Response({'token': token.key, 'user': serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@login_required 
def ver_asignaciones(request, materia_id):
    asignaciones = Asignacion.objects.filter(materia_id=materia_id)
    return render(request, 'asignaciones.html', {'asignaciones': asignaciones})

@login_required
def enviar_tarea(request, asignacion_id):
    if request.method == 'POST':
        form = TareaForm(request.POST, request.FILES)
        if form.is_valid():
            tarea = form.save(commit=False)
            tarea.asignacion_id = asignacion_id
            tarea.save()
            return redirect( 'ver_asignaciones', materia_id=tarea.asignacion.materia_id)
        
    else:
        form = TareaForm()
    return render (request, 'enviar_tarea.html', {'form' : form})

@api_view(['POST'])
def agregar_materia(request):
    serializer = MateriaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

"""
@api_view(['GET', 'POST'])
def asignacion_list(request):
    if request.method == 'GET':
        asignaciones = Asignacion.objects.all()
        serializer = AsignacionSerializer(asignaciones, many=True)
        return Response(serializer.data)
        
    elif request.method == 'POST':
        serializer = AsignacionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view([ 'GET', 'POST', 'DELETE'])
def asignacion_detail(request, pk):
    try:
        asignacion = Asignacion.objects.get(pk=pk)
    except Asignacion.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = AsignacionSerializer(asignacion)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = AsignacionSerializer(asignacion, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        asignacion.delete()
        return Response(status=204)
        
        """
    
@api_view(['GET', 'POST'])
def MateriaView (request):
    if request.method == 'GET':
        materias = Materias.objects.all()
        serializer = MateriaSerializer(materias, many = True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = MateriaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
def UserProfileView(request):
    usuarios = UserProfile.objects.all()
    serializer = UserSerializer(usuarios, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
        
        
@api_view(['PUT'])
def update_profile(request):
    serializer = UserProfileImage(request.user, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.error , status=status.HTTP_400_BAD_REQUEST)

  
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    if request.user.is_authenticated:
        return Response({
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'is_student': request.user.is_student,
            'is_teacher': request.user.is_teacher,
        })
    return Response({'detail': 'Unauthorized'}, status=401)

#   VISTAS CREADAS PARA EL ADMIN

@api_view(['POST'])
@permission_classes([IsAdminUser])
def asignar_materias_estudiante(request, estudiante_id):
    try: 
        estudiante = UserProfile.objects.get(id=estudiante_id, is_student=True)
        materias_ids = request.data.get('materias')
        materias = Materias.objects.filter(id__in=materias_ids)
        estudiante.materias.add(*materias)
        estudiante.save()
        return Response({'message': 'Materias asignadas correctamente'}, status=status.HTTP_200_OK)
    except UserProfile.DoesNotExist:
        return Response({'error': 'Estudiante no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['POST'])
@permission_classes([IsAdminUser])
def asignar_materias_profesor(request, profesor_id):
    try: 
        profesor = UserProfile.objects.get(id=profesor_id, is_teacher=True)
        materias_ids = request.data.get('materias')
        materias = Materias.objects.filter(id__in=materias_ids)
        profesor.materias.add(*materias)
        profesor.save()
        return Response({'message': 'Materias asignadas correctamente'}, status=status.HTTP_200_OK)
    except UserProfile.DoesNotExist:
        return Response({'error': 'Profesor no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_materias_profesor(request):
    if request.user.is_teacher:
        materias = request.user.materias.all()
        serializer = MateriaSerializer(materias, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'No tienes permiso para ver estas materias'}, status=status.HTTP_403_FORBIDDEN)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_materias_estudiante(request):
    if request.user.is_student:
        materias = request.user.materias.all()
        serializer = MateriaSerializer(materias, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'No tienes permiso para ver estas materias'}, status=status.HTTP_403_FORBIDDEN)
    
    
@api_view(['POST'])
@permission_classes([IsAdminUser])
def eliminar_materias_estudiante(request, usuario_id):
    try:
        estudiante = UserProfile.objects.get(id=usuario_id, is_student=True)
        materias_ids = request.data.get('materias')
        materias = Materias.objects.filter(id__in=materias_ids)
        estudiante.materias.remove(*materias)
        return Response({'message': 'Materias eliminadas correctamente del estudiante'}, status=status.HTTP_200_OK)
    except UserProfile.DoesNotExist:
        return Response({'error': 'Estudiante no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
@permission_classes([IsAdminUser])
def eliminar_materias_profesor(request, usuario_id):
    try:
        profesor = UserProfile.objects.get(id=usuario_id, is_teacher=True)
        materias_ids = request.data.get('materias')
        materias = Materias.objects.filter(id__in=materias_ids)
        profesor.materias.remove(*materias)
        profesor.save()
        return Response({'message': 'Materias eliminadas correctamente del profesor'}, status=status.HTTP_200_OK)
    except UserProfile.DoesNotExist:
        return Response({'error' : 'Profesor no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
@api_view(['GET'])
@permission_classes([IsAdminUser])
def listar_estudiantes_con_materias(request):
    estudiantes = UserProfile.objects.filter(is_student=True).prefetch_related('materias')
    data = [
        {
            'id' : estudiante.id,
            'nombre' : estudiante.username,
            'materias' : MateriaSerializer(estudiante.materias.all(), many=True).data
        }
        for estudiante in estudiantes
    ]
    return Response(data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def listar_profesores_con_materias(request):
    profesores = UserProfile.objects.filter(is_teacher=True).prefetch_related('materias')
    data = [
        {
            'id' : profesor.id,
            'nombre': profesor.username,
            'materias': MateriaSerializer(profesor.materias.all(), many=True).data
        }
        for profesor in profesores
    ]
    return Response(data, status=status.HTTP_200_OK)

#    VISTAS PARA LAS ASIGNACIONES (TAREAS)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@permission_classes([MultiPartParser, FormParser])
def crear_asignacion(request):
    if request.user.is_teacher:
        serializer = AsignacionSerializer(data=request.data, context={'request': request}) 
        if serializer.is_valid():
            try:
                materia = Materias.objects.get(id=request.data.get('materia_id'))
                asignacion = serializer.save(materia=materia) 
                estudiantes = UserProfile.objects.filter(materias=materia, is_student=True)
                asignacion.estudiantes.set(estudiantes)
                return Response(AsignacionSerializer(asignacion).data, status=status.HTTP_201_CREATED)
            except Materias.DoesNotExist:
                return Response({'error': 'Materia no encontrada'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({'error': f'Error al guardar la asignación: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({'error': 'No tienes permiso para crear asignaciones'}, status=status.HTTP_403_FORBIDDEN)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def asignaciones_estudiante(request, materia_id):
    if request.user.is_student:
        try:
            print(f"Buscando asignaciones para materia_id: {materia_id}")
            asignaciones = Asignacion.objects.filter(materia_id=materia_id, estudiantes__id=request.user.id)
            print(f"Asignaciones encontradas: {asignaciones}")
            serializer = AsignacionSerializer(asignaciones, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({'error': 'No se encontraron asignaciones'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'Error al obtener asignaciones: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({'error': 'No tienes permiso para ver estas asignaciones'}, status=status.HTTP_403_FORBIDDEN)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def asignaciones_profesor(request, materia_id):
    if request.user.is_teacher:
        try:
           
            asignaciones = Asignacion.objects.filter(profesor=request.user, materia_id=materia_id)
            serializer = AsignacionSerializer(asignaciones, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': f'Error al obtener asignaciones: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({'error': 'No tienes permiso para ver estas asignaciones'}, status=status.HTTP_403_FORBIDDEN)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def eliminar_asignacion(request, asignacion_id):
    try: 
        asignacion= Asignacion.objects.get(id=asignacion_id, profesor=request.user )
        asignacion.delete()
        return Response({'message':  'Asignacion eliminada exitosamente'}, status=status.HTTP_204_NO_CONTENT)
    except Asignacion.DoesNotExist:
        return Response({ 'error' : 'Asignacion no encontrada o no tienes permiso para eliminarla'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': f'Error al eliminar asignacion: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# USUARIO 

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_usuario_actual(request):
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'is_teacher': user.is_teacher,
        'is_student': user.is_student,
    })
    
    
    
def download_file(request, asignacion_id):
    asignacion = get_object_or_404(Asignacion, id=asignacion_id)
    if not asignacion.archivo:
        return HttpResponse("No hay archivo disponible para descargar.", status=404)
    response = FileResponse(open(asignacion.archivo.path, 'rb'))
    response['Content-Disposition'] = f'attachment; filename="{asignacion.archivo.name}"'
    return response