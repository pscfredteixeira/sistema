<?php
require __DIR__ . '/../vendor/autoload.php';

use App\Model\Paciente;
use App\Model\Sessao;

/**
 * Exemplo simples de sincronização de eventos do Google Calendar.
 * Em um sistema real você usaria a API oficial do Google.
 * Aqui assumimos que $events é um array de dados de eventos.
 *
 * Cada evento deve conter: paciente, start, duration, valor.
 * - paciente: nome do paciente que já existe no array $pacientes
 * - start: data e hora da sessão ("Y-m-d H:i:s")
 * - duration: duração em minutos
 * - valor: custo da sessão
 */
function syncGoogleCalendar(array $events, array $pacientes): void
{
    foreach ($events as $event) {
        if (!isset($pacientes[$event['paciente']])) {
            continue;
        }
        $paciente = $pacientes[$event['paciente']];
        $data_hora = new DateTime($event['start']);
        $sessao = new Sessao($paciente, $data_hora, (int)$event['duration'], (float)$event['valor']);
        $paciente->adicionarSessao($sessao);
    }
}
