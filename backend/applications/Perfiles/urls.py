from django.contrib import admin
from django.urls import path
from .controllers.views import (
  ConsultarPerfilAPI,
  CrearPerfilAPI,
  CheckPasswordAPI,
  ActualizarStripeCustomerIdAPI,
  ActivarPerfilAPI,
  ActivarPerfilByTokenAPI,
  GoogleSocialAuthView,
  SendVerificationMailAPI,
  CheckVerifiedAPI,
  GetClientePedidosAPI,
  GetClienteDireccionesAPI,
  EditarPefilAPI,
  EliminarPerfilAPI
)

urlpatterns = [
    path("consultar_password/", CheckPasswordAPI.as_view()),
    path("crear/", CrearPerfilAPI.as_view()),
    path("actualizar_stripeId/", ActualizarStripeCustomerIdAPI.as_view()),
    path("activar_perfil/", ActivarPerfilAPI.as_view()),
    path("activar_perfil_by_token/", ActivarPerfilByTokenAPI.as_view()),
    path("google_service/", GoogleSocialAuthView.as_view()),
    path("send_verification_mail/", SendVerificationMailAPI.as_view()),
    path('check-verified/<str:email_perfil>/', CheckVerifiedAPI.as_view()),
    path('buscar_pedidos_cliente/<str:email_perfil>/', GetClientePedidosAPI.as_view()),
    path('buscar_direcciones_cliente/<str:email_perfil>/', GetClienteDireccionesAPI.as_view()),
    path('editar/', EditarPefilAPI.as_view()),
    path('eliminar/<str:email_perfil>/', EliminarPerfilAPI.as_view()),
    path("<str:email_perfil>/", ConsultarPerfilAPI.as_view()), 
      # Incluye barra final opcional para consistencia
]
