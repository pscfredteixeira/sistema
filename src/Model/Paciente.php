<?php
namespace App\Model;

use DateTime;

class Paciente
{
    private string $nome;
    private float $saldo_devedor = 0.0;
    /** @var Sessao[] */
    private array $sessoes = [];

    public function __construct(string $nome)
    {
        $this->nome = $nome;
    }

    public function getNome(): string
    {
        return $this->nome;
    }

    public function adicionarSessao(Sessao $sessao): void
    {
        $this->sessoes[] = $sessao;
    }

    public function atualizarSessoes(): void
    {
        foreach ($this->sessoes as $sessao) {
            $sessao->atualizarStatus();
        }
        $this->atualizarSaldoDevedor();
    }

    private function atualizarSaldoDevedor(): void
    {
        $total = 0.0;
        foreach ($this->sessoes as $sessao) {
            if ($sessao->getStatus() === Sessao::STATUS_REALIZADA) {
                $total += $sessao->getValor();
            }
        }
        $this->saldo_devedor = $total;
    }

    public function getSaldoDevedor(): float
    {
        return $this->saldo_devedor;
    }
}
