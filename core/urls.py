from django.urls import path
from .views import (
    PacienteListView,
    PacienteDetailView,
    PacienteCreateView,
    PacienteUpdateView,
)

urlpatterns = [
    path('pacientes/', PacienteListView.as_view(), name='paciente_list'),
    path('pacientes/novo/', PacienteCreateView.as_view(), name='paciente_create'),
    path('pacientes/<int:pk>/', PacienteDetailView.as_view(), name='paciente_detail'),
    path('pacientes/<int:pk>/editar/', PacienteUpdateView.as_view(), name='paciente_edit'),
]
