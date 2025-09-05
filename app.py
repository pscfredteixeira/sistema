from datetime import date
from dataclasses import dataclass, field
from typing import List
from flask import Flask, render_template

app = Flask(__name__)

@dataclass
class Sessao:
    data: date
    valor: float
    paga: bool = False

@dataclass
class Paciente:
    nome: str
    foto: str
    sessoes: List[Sessao] = field(default_factory=list)

    @property
    def saldo_devedor(self) -> float:
        return sum(sessao.valor for sessao in self.sessoes if not sessao.paga)

    @property
    def tem_atraso(self) -> bool:
        hoje = date.today()
        return any(sessao.data < hoje and not sessao.paga for sessao in self.sessoes)

# Dados de exemplo; em um projeto real, consulte o banco de dados.
pacientes = [
    Paciente(
        nome="Ana",
        foto="ana.jpg",
        sessoes=[
            Sessao(date(2024, 1, 1), 100.0, True),
            Sessao(date(2024, 2, 1), 100.0, False),
        ],
    ),
    Paciente(
        nome="Bruno",
        foto="bruno.jpg",
        sessoes=[Sessao(date(2024, 3, 1), 80.0, False)],
    ),
    Paciente(
        nome="Carlos",
        foto="carlos.jpg",
        sessoes=[],
    ),
]

@app.route("/dashboard")
def dashboard():
    pacientes_ordenados = sorted(pacientes, key=lambda p: p.nome)
    return render_template("dashboard.html", pacientes=pacientes_ordenados)

if __name__ == "__main__":
    app.run(debug=True)
