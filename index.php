<?php
require __DIR__ . '/src/sync_google_calendar.php';

use App\Model\Paciente;

$paciente = new Paciente('João');
$pacientes = ['João' => $paciente];

$events = [
    [
        'paciente' => 'João',
        'start' => date('Y-m-d H:i:s', strtotime('-1 day')),
        'duration' => 60,
        'valor' => 100.0,
    ],
    [
        'paciente' => 'João',
        'start' => date('Y-m-d H:i:s', strtotime('+1 day')),
        'duration' => 60,
        'valor' => 150.0,
    ],
];

syncGoogleCalendar($events, $pacientes);

$paciente->atualizarSessoes();

echo 'Saldo devedor: R$ ' . $paciente->getSaldoDevedor() . PHP_EOL;
