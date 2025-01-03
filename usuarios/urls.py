from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from usuarios_api.views import register, login, user_profile,asignar_materias_estudiante, asignar_materias_profesor, obtener_materias_estudiante, obtener_materias_profesor, asignaciones_estudiante, asignaciones_profesor, crear_asignacion, obtener_usuario_actual, logout, eliminar_materias_estudiante, eliminar_materias_profesor, listar_estudiantes_con_materias,  listar_profesores_con_materias, eliminar_asignacion, download_file, respuesta_list, crear_usuario , entregar_trabajo, obtener_trabajos_entregados, ver_entregas, user_settings_view, UserProfileView2, UserProfileView, anular_entrega, asignar_nota, obtener_notas, obtener_estudiantes, obtener_estudiante ,eliminar_usuario
from usuarios_api import views
from django.conf import settings
from django.conf.urls.static import static



urlpatterns = [
    path('admin/', admin.site.urls),
    path('usuarios/' , UserProfileView, name='usuarios_view'),
    path('usuarios/username/<str:username>/' , UserProfileView2, name='usuarios_view2'),
    path('usuarios_estudiantes/', obtener_estudiantes, name='obtener_estudiantes'),
    path('usuarios/profile/image/' , views.update_profile, name='user_profile_image'),
    path('response_after_save/<int:obj_id>/<str:token_key>/', views.response_after_save, name='response_after_save'),
    path('register/', register),
    path('register/message/', views.register_message, name='register_message'),
    path('login/', login),
    path('register/options/', views.register_options, name='register_options'),
    path('logout/', views.logout , name='logout'),
    path('register/teacher-page',views.menu, name='menu'),
    path('register/teacher-page/register-student', views.register_Student_by_teacher, name='register student by teacher'),
    path('materias/agregar', views.agregar_materia, name='materias'),
    #path('asignment/', views.asignacion_list, name='asinacion_list'),
    #path('asignment/<int:pk>', views.asignacion_detail, name='asignacion_detail'),
    path('materias/', views.MateriaView, name='materia_view'),
    path('usuarios/profile/', user_profile, name='user_profile'),
    path('admin-asignar-materiaEs/<int:estudiante_id>/', asignar_materias_estudiante, name='asignar_materias_estudiante'),
    path('admin-asignar-materiaPr/<int:profesor_id>/', asignar_materias_profesor, name='asignar_materias_profesor'),
    path('obtener-materias-Es/', obtener_materias_estudiante, name='obtener-materias-Es'),
    path('obtener-materias-Pr/', obtener_materias_profesor, name='obtener-materias-Pr'),
    path('asignacionesEs/<int:materia_id>/', asignaciones_estudiante, name='asignaciones-Es'),
    path('asignacionesPr/<int:materia_id>/', asignaciones_profesor, name='asignaciones-Pr'),
    path('crear_asignacion/', crear_asignacion, name='crear_asignacion'),
    path('usuarios/me/', obtener_usuario_actual, name='usuario actual'),
    path('eliminar_materias_Es/<int:usuario_id>/', eliminar_materias_estudiante, name='eliminar_materias_de_estudiantes'),
    path('eliminar_materias_Pr/<int:usuario_id>/', eliminar_materias_profesor, name='eliminar_materias_de_estudiantes'),
    path('listar_materias_Es/', listar_estudiantes_con_materias, name='listar_materias_de_estudiantes'),
    path('listar_materias_Pr/', listar_profesores_con_materias, name='listar_materias_de_estudiantes'),
    path('eliminar_asignacion/<int:asignacion_id>/', eliminar_asignacion, name='eliminar_asignacion' ),
    path('download/<int:id>/<str:file_type>/', download_file, name='download_file'),
    path('respuestas/', respuesta_list, name='respuesta_list'),
    path('crear_usuario/', crear_usuario, name='crear-usuario'),
    path('entrega-trabajo/', entregar_trabajo, name='entrega_trabajo'),
    path('entregas/<int:asignacion_id>/', obtener_trabajos_entregados ,name='obtener_trabajos_entregados'),
    path('ver_entregas/<int:asignacion_id>/', ver_entregas, name='ver_entregas'),
    path('settings/', user_settings_view, name='settings'),
    path('anular/<int:id>/', anular_entrega, name='anular_entregas'),
    path('asignar_nota/<int:entrega_id>/', asignar_nota, name='asignar_notas'),
    path('estudiante/<str:username>/', obtener_estudiante, name='obtener_estudiantes'),
    path('obtener_notas/<int:id>/', obtener_notas, name='obtener_notas'  ),
    path('eliminar_usuario/<int:estudiante_id>/', eliminar_usuario, name='eliminar_usuario'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)