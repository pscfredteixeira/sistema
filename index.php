<?php
// Eventos de exemplo; normalmente seriam buscados de um banco de dados
$eventos = [
    ['titulo' => 'Reunião de Equipe', 'inicio' => '2023-09-05 10:00'],
    ['titulo' => 'Almoço com Cliente', 'inicio' => '2023-09-06 12:00'],
    ['titulo' => 'Webinar', 'inicio' => '2023-09-07 15:00'],
    ['titulo' => 'Revisão de Código', 'inicio' => '2023-09-08 09:00'],
    ['titulo' => 'Happy Hour', 'inicio' => '2023-09-08 18:00'],
];

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($uri === '/calendario') {
    $visao = $_GET['view'] ?? 'week';
    $paramData = $_GET['date'] ?? date('Y-m-d');
    $dataAtual = DateTime::createFromFormat('Y-m-d', $paramData) ?: new DateTime();

    if ($visao === 'day') {
        mostrarDia($dataAtual, $eventos);
    } else {
        mostrarSemana($dataAtual, $eventos);
    }
    exit;
}

echo '<h1>Página inicial</h1>';
echo '<p>Acesse <a href="/calendario?view=day">/calendario</a> para ver o calendário.</p>';

function mostrarDia(DateTime $data, array $eventos): void
{
    echo '<h1>Eventos de ' . $data->format('d/m/Y') . '</h1>';
    $anterior = (clone $data)->modify('-1 day');
    $proximo = (clone $data)->modify('+1 day');
    echo '<a href="?view=day&date=' . $anterior->format('Y-m-d') . '">&lt;</a> ';
    echo '<a href="?view=day&date=' . $proximo->format('Y-m-d') . '">&gt;</a>';

    foreach ($eventos as $evento) {
        $inicio = new DateTime($evento['inicio']);
        if ($inicio->format('Y-m-d') === $data->format('Y-m-d')) {
            echo '<p>' . $inicio->format('H:i') . ' - ' . htmlspecialchars($evento['titulo']) . '</p>';
        }
    }

    echo '<p><a href="/calendario?view=week&date=' . $data->format('Y-m-d') . '">Visão semanal</a></p>';
}

function mostrarSemana(DateTime $data, array $eventos): void
{
    $inicioSemana = (clone $data)->modify('monday this week');
    $fimSemana = (clone $inicioSemana)->modify('+6 day');
    echo '<h1>Semana de ' . $inicioSemana->format('d/m/Y') . ' a ' . $fimSemana->format('d/m/Y') . '</h1>';

    $anterior = (clone $inicioSemana)->modify('-7 day');
    $proximo = (clone $inicioSemana)->modify('+7 day');
    echo '<a href="?view=week&date=' . $anterior->format('Y-m-d') . '">&lt;</a> ';
    echo '<a href="?view=week&date=' . $proximo->format('Y-m-d') . '">&gt;</a>';

    for ($i = 0; $i < 7; $i++) {
        $dia = (clone $inicioSemana)->modify("+$i day");
        echo '<h3>' . $dia->format('d/m/Y') . '</h3>';
        foreach ($eventos as $evento) {
            $inicio = new DateTime($evento['inicio']);
            if ($inicio->format('Y-m-d') === $dia->format('Y-m-d')) {
                echo '<p>' . $inicio->format('H:i') . ' - ' . htmlspecialchars($evento['titulo']) . '</p>';
            }
        }
    }

    echo '<p><a href="/calendario?view=day&date=' . $data->format('Y-m-d') . '">Visão diária</a></p>';
}
