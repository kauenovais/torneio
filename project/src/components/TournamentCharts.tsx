import React from 'react';
import { Torneio } from '../types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Props {
  torneio: Torneio;
  tema: 'light' | 'dark';
}

const GraficosTorneio: React.FC<Props> = ({ torneio, tema }) => {
  // Calcula dados para o gráfico de pontuação
  const dadosPontuacao = {
    labels: torneio.participantes.map(p => p.nome),
    datasets: [
      {
        label: 'Pontos',
        data: torneio.participantes.map(p => p.pontos || 0),
        backgroundColor: tema === 'dark' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.6)',
        borderColor: '#3B82F6',
        borderWidth: 1
      }
    ]
  };

  // Calcula dados para o gráfico de vitórias/derrotas
  const dadosVitorias = {
    labels: ['Vitórias', 'Derrotas'],
    datasets: torneio.participantes.map(p => ({
      label: p.nome,
      data: [p.vitorias || 0, p.derrotas || 0],
      backgroundColor: [
        tema === 'dark' ? 'rgba(34, 197, 94, 0.8)' : 'rgba(34, 197, 94, 0.6)',
        tema === 'dark' ? 'rgba(239, 68, 68, 0.8)' : 'rgba(239, 68, 68, 0.6)'
      ]
    }))
  };

  // Opções comuns dos gráficos
  const opcoes = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: tema === 'dark' ? '#fff' : '#000'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: tema === 'dark' ? '#fff' : '#000'
        },
        grid: {
          color: tema === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        ticks: {
          color: tema === 'dark' ? '#fff' : '#000'
        },
        grid: {
          color: tema === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  return (
    <div className={`rounded-xl shadow-lg p-6 ${
      tema === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h3 className="text-xl font-semibold mb-4">Estatísticas em Gráficos</h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Gráfico de Pontuação */}
        <div>
          <h4 className="font-medium mb-4 text-center">Pontuação por Participante</h4>
          <Bar data={dadosPontuacao} options={opcoes} />
        </div>

        {/* Gráfico de Vitórias/Derrotas */}
        <div>
          <h4 className="font-medium mb-4 text-center">Vitórias e Derrotas</h4>
          <Pie
            data={dadosVitorias}
            options={{
              ...opcoes,
              plugins: {
                ...opcoes.plugins,
                legend: {
                  ...opcoes.plugins.legend,
                  position: 'bottom' as const
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GraficosTorneio;
