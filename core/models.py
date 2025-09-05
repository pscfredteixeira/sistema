from django.db import models

class Paciente(models.Model):
    nome_completo = models.CharField(max_length=255)
    email = models.EmailField()
    cpf = models.CharField(max_length=14)
    dia_pagamento = models.PositiveSmallIntegerField()
    valor_sessao = models.DecimalField(max_digits=8, decimal_places=2)
    saldo_devedor = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    foto = models.ImageField(upload_to='pacientes/', blank=True, null=True)

    def __str__(self):
        return self.nome_completo
