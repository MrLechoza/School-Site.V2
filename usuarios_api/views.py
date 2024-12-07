from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from usuarios_api.serializers import UserSerializer, LoginSerializer, MateriaSerializer, AsignacionSerializer, UserProfileImage, RespuestaAsigSerializer, UserSettingsSerializer,NotaSerializer, EstudianteSerializer, EntregaSerializer
from rest_framework import status
from rest_framework.authtoken.models import Token
from usuarios_api.models import UserProfile, Asignacion, TareaForm, Materias, RespuestaAsig, Entrega, Nota, Estudiante, Profesor
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
import os
from django.contrib import messages
from django.utils import timezone


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
                'is_staff': user.is_staff})
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
        
        Estudiante.objects.create(user=user) 
        
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
            return redirect('ver_asignaciones', materia_id=tarea.asignacion.materia_id)

    else:
        form = TareaForm()
    return render(request, 'enviar_tarea.html', {'form': form})


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
def MateriaView(request):
    if request.method == 'GET':
        materias = Materias.objects.all()
        serializer = MateriaSerializer(materias, many=True)
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

@api_view(['GET'])
def UserProfileView2(request, username):
    try:
        usuario = UserProfile.objects.get(username=username)  
    except UserProfile.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserSerializer(usuario)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PUT'])
def update_profile(request):
    serializer = UserProfileImage(request.user, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)


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

# OBTENER ESTUDIANTES

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_estudiantes(request):
   
    estudiantes = Estudiante.objects.all()
    
    serializer = UserSerializer([estudiante.user for estudiante in estudiantes], many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)

#   VISTAS CREADAS PARA EL ADMIN


@api_view(['POST'])
@permission_classes([IsAdminUser])
def crear_usuario(request):
    data = request.data
    is_student = data.get('is_student', False)
    is_teacher = data.get('is_teacher', False)

    if not (is_student or is_teacher):
        return Response({'error': 'Debes especificar si el usuario es estudiante o profesor.'},
                        status=status.HTTP_400_BAD_REQUEST)
        
    serializer = UserSerializer(data=data)
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(data['password'])
        user.is_student = is_student
        user.is_teacher = is_teacher
        user.save()

        if is_student:
            estudiante = Estudiante.objects.create(user_profile=user)

            materias_ids = data.get('materias', [])
            if materias_ids:
                materias = Materias.objects.filter(id__in=materias_ids)
                estudiante.materias.set(materias)

            notas_ids = data.get('nota', [])
            if notas_ids:
                notas = Nota.objects.filter(id__in=notas_ids)
                estudiante.nota.set(notas)

            estudiante.save()

        if is_teacher:
            Profesor.objects.create(user=user)

        token = Token.objects.create(user=user)


        return Response({
            'message': 'Usuario registrado exitosamente.',
            'token': token.key,
            'user': serializer.data
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def eliminar_usuario(request, usuario_id):
    try:
        usuario = UserProfile.objects.get(id=usuario_id)
        if usuario.is_student:
            try:
                estudiante = Estudiante.objects.get(user_profile=usuario)
                estudiante.delete() 
            except Estudiante.DoesNotExist:
                pass

        if usuario.is_teacher:
            try:
                profesor = Profesor.objects.get(user=usuario)
                profesor.delete() 
            except Profesor.DoesNotExist:
                pass

        Token.objects.filter(user=usuario).delete()
        usuario.delete()

        return Response({
            'message': f"Usuario con ID {usuario_id} eliminado exitosamente."
        }, status=status.HTTP_200_OK)

    except UserProfile.DoesNotExist:
        return Response({'error': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({
            'error': f"Error al eliminar el usuario: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
        return Response({'error': 'Profesor no encontrado'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def listar_estudiantes_con_materias(request):
    estudiantes = UserProfile.objects.filter(
        is_student=True).prefetch_related('materias')
    data = [
        {
            'id': estudiante.id,
            'nombre': estudiante.username,
            'materias': MateriaSerializer(estudiante.materias.all(), many=True).data
        }
        for estudiante in estudiantes
    ]
    return Response(data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def listar_profesores_con_materias(request):
    profesores = UserProfile.objects.filter(
        is_teacher=True).prefetch_related('materias')
    data = [
        {
            'id': profesor.id,
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
        serializer = AsignacionSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            try:
                materia = Materias.objects.get(
                    id=request.data.get('materia_id'))
                asignacion = serializer.save(materia=materia)
                estudiantes = UserProfile.objects.filter(
                    materias=materia, is_student=True)
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
            asignaciones = Asignacion.objects.filter(
                materia_id=materia_id, estudiantes__id=request.user.id)
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

            asignaciones = Asignacion.objects.filter(
                profesor=request.user, materia_id=materia_id)
            serializer = AsignacionSerializer(asignaciones, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': f'Error al obtener asignaciones: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({'error': 'No tienes permiso para ver estas asignaciones'}, status=status.HTTP_403_FORBIDDEN)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def eliminar_asignacion(request, asignacion_id):
    try:
        asignacion = Asignacion.objects.get(
            id=asignacion_id, profesor=request.user)
        asignacion.delete()
        return Response({'message':  'Asignacion eliminada exitosamente'}, status=status.HTTP_204_NO_CONTENT)
    except Asignacion.DoesNotExist:
        return Response({'error': 'Asignacion no encontrada o no tienes permiso para eliminarla'}, status=status.HTTP_404_NOT_FOUND)
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
        'email': user.email,
        'phone': user.phone, 
        'avatar': user.avatar.url if user.avatar else None,
        'is_teacher': user.is_teacher,
        'is_student': user.is_student,
    })


def download_file(request, id, file_type):
    if file_type == 'respuesta':
        respuesta = get_object_or_404(Entrega, id=id)
        if not respuesta.archivo or not os.path.exists(respuesta.archivo.path):
            return HttpResponse("No hay archivo disponible para descargar.", status=404)
        response = FileResponse(open(respuesta.archivo.path, 'rb'))
        response['Content-Disposition'] = f'attachment; filename="{respuesta.archivo.name}"'
    
    elif file_type == 'asignacion':
        asignacion = get_object_or_404(Asignacion, id=id)
        if not asignacion.archivo or not os.path.exists(asignacion.archivo.path):
            return HttpResponse("No hay archivo disponible para descargar.", status=404)
        response = FileResponse(open(asignacion.archivo.path, 'rb'))
        response['Content-Disposition'] = f'attachment; filename="{asignacion.archivo.name}"'
    
    else:
        return HttpResponse("Tipo de archivo no válido.", status=400)

    return response

# VISTA DE RESPUESTA A ASIGNACION


@api_view(['GET', 'POST'])
def respuesta_list(request):
    if request.method == 'GET':
        asignacion_id = request.query_params.get('asignacion', None)
        if asignacion_id:
            respuestas = RespuestaAsig.objects.filter(
                asignacion_id=asignacion_id)
        else:
            respuestas = RespuestaAsig.objects.all()

        serializer = RespuestaAsigSerializer(respuestas, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = RespuestaAsigSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def entregar_trabajo(request):
    comentario = request.data.get("comentario")
    archivo = request.FILES.get("archivo")
    asignacion_id = request.data.get("asignacionId")

    try:
        asignacion = Asignacion.objects.get(id=asignacion_id)
        estudiante = request.user

        entrega = Entrega.objects.create(
            asignacion=asignacion,
            estudiante=estudiante,
            comentario=comentario,
            archivo=archivo
        )

        return Response(
            {"message": "Trabajo entregado correctamente."},
            status=201,
        )

    except Asignacion.DoesNotExist:
        return Response({"error": "La asignación no existe."}, status=404)

    except Exception as e:
        return Response({"error": f"Error al procesar la entrega: {str(e)}"}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_trabajos_entregados(request, asignacion_id):
    entregas = Entrega.objects.filter(
        asignacion_id=asignacion_id, estudiante=request.user)
    entregas_data = [{
        'id': entrega.id,
        'archivo_url': entrega.archivo.url if entrega.archivo else None,
        'comentario': entrega.comentario,
        'fecha_entrega': entrega.fecha_entrega.isoformat()
    }
        for entrega in entregas
    ]
    return Response(entregas_data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ver_entregas(request, asignacion_id):
    try:
        asignacion = Asignacion.objects.get(id=asignacion_id)
    except Asignacion.DoesNotExist:
        return Response({'error': 'Asignacion no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

    entregas = Entrega.objects.filter(asignacion=asignacion)
    entregas_data = [
        {
             'id' : entrega.id,
             'estudiante' : entrega.estudiante.username,
             'archivo': entrega.archivo.url,
             'comentario' : entrega.comentario,
             'fecha_entrega': entrega.fecha_entrega 
             
    }
        for entrega in entregas
        ]
    return Response(entregas_data, status=status.HTTP_200_OK)


#   CONFIGURACION DEL USUARIO 

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_settings_view(request):
    user = request.user
    print(f"User: {user}")  # Imprime el usuario actual

    if request.method == 'GET':
        serializer = UserSettingsSerializer(user)
        print(f"GET data: {serializer.data}")  # Imprime los datos que devuelve el serializer
        return Response(serializer.data)

    elif request.method == 'PUT':
        print(f"PUT request data: {request.data}")  # Imprime los datos recibidos en la solicitud PUT
        serializer = UserSettingsSerializer(user, data=request.data, partial=True)  
        if serializer.is_valid():
            print(f"Validated data: {serializer.validated_data}")  # Imprime los datos validados por el serializer
            serializer.save()  
            print(f"Saved data: {serializer.data}")  # Imprime los datos después de ser guardados
            return Response(serializer.data, status=status.HTTP_200_OK)
        print(f"Serializer errors: {serializer.errors}")  # Imprime los errores del serializer si no son válidos
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    
@api_view(['DELETE'])
def anular_entrega(request, id):
    try:
        entrega = Entrega.objects.get(id=id)
        entrega.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Entrega.DoesNotExist:
        return Response({"detail": "Entrega no encontrada."}, status=status.HTTP_404_NOT_FOUND)
    
# VISTAS PARA LAS NOTAS 

@api_view(['POST'])
def asignar_nota(request, entrega_id):
    try:
        entrega = Entrega.objects.get(id=entrega_id)
        asignacion_id = request.data.get('asignacion_id')
        estudiante_id = request.data.get('estudiante_id')

        user_profile = UserProfile.objects.get(id=estudiante_id, is_student=True)
        asignacion = Asignacion.objects.get(id=asignacion_id)

        # Crear la nota
        nota = Nota.objects.create(
            entrega=entrega,
            asignacion=asignacion,
            user_profile=user_profile,
            calificacion=request.data.get('calificacion'),
            comentarios=request.data.get('comentarios')
        )

        serializer = NotaSerializer(nota)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except UserProfile.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    except Asignacion.DoesNotExist:
        return Response({"error": "Asignación no encontrada"}, status=status.HTTP_404_NOT_FOUND)
    except Entrega.DoesNotExist:
        return Response({"error": "Entrega no encontrada"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




@api_view(['GET'])
def obtener_estudiante(request, username):
    try:
        estudiante = UserProfile.objects.get(username=username)
        serializer = UserSerializer(estudiante)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except UserProfile.DoesNotExist:
        return Response({"error": "Estudiante no encontrado"}, status=status.HTTP_404_NOT_FOUND)


    
@api_view(['GET'])
def obtener_notas(request, id):
    notas = Nota.objects.filter(entrega_id=id)
    serializer = NotaSerializer(notas, many=True)
    return Response(serializer.data)