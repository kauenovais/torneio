import React from 'react';
import { Estatisticas, Participante } from '../types';

interface Props {
  estatisticas: Estatisticas;
  tema: 'light' | 'dark';
}

const EstatisticasTorneio: React.FC<Props> = ({ estatisticas, tema }) => {
  const renderParticipante = (participante?: Participante) => {
    if (!participante) return 'Nenhum';
    return `${participante.nome} (${participante.pontos || 0} pts)`;
  };

  return (
    <div className={`rounded-xl shadow-lg p-6 ${
      tema === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h3 className="text-xl font-semibold mb-4">Estatísticas do Torneio</h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Números Gerais */}
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Números Gerais</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${
                tema === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="text-sm text-gray-500">Participantes</div>
                <div className="text-2xl font-bold">{estatisticas.totalParticipantes}</div>
              </div>
              <div className={`p-4 rounded-lg ${
                tema === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="text-sm text-gray-500">Partidas</div>
                <div className="text-2xl font-bold">{estatisticas.totalPartidas}</div>
              </div>
              <div className={`p-4 rounded-lg ${
                tema === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="text-sm text-gray-500">Finalizadas</div>
                <div className="text-2xl font-bold">{estatisticas.totalFinalizadas}</div>
              </div>
              <div className={`p-4 rounded-lg ${
                tema === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="text-sm text-gray-500">Média de Gols</div>
                <div className="text-2xl font-bold">
                  {estatisticas.mediaGolsPorPartida?.toFixed(1) || '0.0'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Destaques */}
        <div className="space-y-4">
          <h4 className="font-medium mb-2">Destaques</h4>
          <div className="space-y-2">
            <div className={`p-4 rounded-lg ${
              tema === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="text-sm text-gray-500">Mais Vitórias</div>
              <div className="font-medium">{renderParticipante(estatisticas.participanteMaisVitorias)}</div>
            </div>
            <div className={`p-4 rounded-lg ${
              tema === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="text-sm text-gray-500">Mais Pontos</div>
              <div className="font-medium">{renderParticipante(estatisticas.participanteMaisPontos)}</div>
            </div>
            {estatisticas.maiorPlacar && (
              <div className={`p-4 rounded-lg ${
                tema === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="text-sm text-gray-500">Maior Placar</div>
                <div className="font-medium">
                  {estatisticas.maiorPlacar.partida.participante1?.nome || '?'} {estatisticas.maiorPlacar.partida.placar1} x{' '}
                  {estatisticas.maiorPlacar.partida.placar2} {estatisticas.maiorPlacar.partida.participante2?.nome || '?'}
                </div>
                <div className="text-sm text-gray-500">
                  Total: {estatisticas.maiorPlacar.placarTotal} gols
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstatisticasTorneio;
