from django import forms
from .models import Paciente

class PacienteForm(forms.ModelForm):
    class Meta:
        model = Paciente
        fields = ['nome_completo', 'email', 'cpf', 'dia_pagamento', 'valor_sessao', 'saldo_devedor', 'foto']
