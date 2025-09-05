<?php
namespace App\Model;

use DateTime;

class Sessao
{
    public const STATUS_PENDENTE = 'PENDENTE';
    public const STATUS_REALIZADA = 'REALIZADA';

    private Paciente $paciente;
    private DateTime $data_hora;
    private int $duracao; // em minutos
    private float $valor;
    private string $status = self::STATUS_PENDENTE;

    public function __construct(Paciente $paciente, DateTime $data_hora, int $duracao, float $valor)
    {
        $this->paciente = $paciente;
        $this->data_hora = $data_hora;
        $this->duracao = $duracao;
        $this->valor = $valor;
    }

    public function atualizarStatus(): void
    {
        if ($this->status === self::STATUS_PENDENTE && $this->data_hora <= new DateTime()) {
            $this->status = self::STATUS_REALIZADA;
        }
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function getValor(): float
    {
        return $this->valor;
    }
}
