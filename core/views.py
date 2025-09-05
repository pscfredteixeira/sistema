from django.db.models import Q
from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView

from .models import Paciente
from .forms import PacienteForm


class PacienteListView(ListView):
    model = Paciente
    template_name = 'core/paciente_list.html'
    context_object_name = 'pacientes'

    def get_queryset(self):
        queryset = super().get_queryset()
        q = self.request.GET.get('q')
        if q:
            queryset = queryset.filter(
                Q(nome_completo__icontains=q)
                | Q(cpf__icontains=q)
                | Q(email__icontains=q)
            )
        return queryset


class PacienteDetailView(DetailView):
    model = Paciente
    template_name = 'core/paciente_detail.html'
    context_object_name = 'paciente'


class PacienteCreateView(CreateView):
    model = Paciente
    form_class = PacienteForm
    template_name = 'core/paciente_form.html'
    success_url = reverse_lazy('paciente_list')


class PacienteUpdateView(UpdateView):
    model = Paciente
    form_class = PacienteForm
    template_name = 'core/paciente_form.html'
    success_url = reverse_lazy('paciente_list')
