import React, { useState } from 'react';
import { Partida, Participante } from '../types';
import '../styles/animations.css';

interface Props {
  partidas: Partida[];
  onAtualizarPartida: (partida: Partida) => void;
}

const Chaveamento: React.FC<Props> = ({ partidas, onAtualizarPartida }) => {
  const maxRodada = Math.max(...partidas.map(p => p.rodada));
  const [placares, setPlacares] = useState<{ [key: string]: { placar1?: string; placar2?: string } }>({});

  const getPartidasPorRodada = (rodada: number) => {
    return partidas.filter(p => p.rodada === rodada);
  };

  const handleVencedor = (partida: Partida, participante: Participante | null) => {
    if (partida.vencedor?.id === participante?.id) {
      onAtualizarPartida({ ...partida, vencedor: null, placar1: undefined, placar2: undefined });
      setPlacares(prev => {
        const newPlacares = { ...prev };
        delete newPlacares[partida.id];
        return newPlacares;
      });
    } else {
      onAtualizarPartida({ ...partida, vencedor: participante });
    }
  };

  const handlePlacarChange = (partidaId: string, campo: 'placar1' | 'placar2', valor: string) => {
    // Atualiza o estado local dos placares
    setPlacares(prev => ({
      ...prev,
      [partidaId]: {
        ...prev[partidaId],
        [campo]: valor
      }
    }));

    // Converte para números
    const placarAtual = placares[partidaId] || {};
    const placar1 = campo === 'placar1' ? Number(valor) : Number(placarAtual.placar1 || 0);
    const placar2 = campo === 'placar2' ? Number(valor) : Number(placarAtual.placar2 || 0);

    // Encontra a partida
    const partida = partidas.find(p => p.id === partidaId);
    if (!partida) return;

    // Determina o vencedor baseado nos placares
    let vencedor: Participante | undefined = undefined;
    if (!isNaN(placar1) && !isNaN(placar2)) {
      if (placar1 > placar2) {
        vencedor = partida.participante1;
      } else if (placar2 > placar1) {
        vencedor = partida.participante2;
      }
    }

    // Atualiza a partida com os novos placares e vencedor
    onAtualizarPartida({
      ...partida,
      placar1: !isNaN(placar1) ? placar1 : undefined,
      placar2: !isNaN(placar2) ? placar2 : undefined,
      vencedor
    });
  };

  const renderPartida = (partida: Partida) => {
    const isPassagem = !partida.participante2;
    const spacing = partida.rodada === 1 ? 'mb-4' : 'mb-8';
    const placaresDaPartida = placares[partida.id] || {};

    return (
      <div 
        key={partida.id} 
        className={`relative bg-white rounded-lg shadow-lg p-4 ${spacing} animate-scale-in hover-scale transition-all`}
      >
        <div className="space-y-2">
          {[partida.participante1, partida.participante2].map((participante, index) => {
            if (!participante && index === 1 && isPassagem) return null;

            const isVencedor = participante?.id === partida.vencedor?.id;
            const isUltimaRodada = partida.rodada === maxRodada;
            const placarAtual = index === 0 ? placaresDaPartida.placar1 : placaresDaPartida.placar2;
            const placarFinal = index === 0 ? partida.placar1 : partida.placar2;

            return (
              <div
                key={participante?.id || `empty-${index}`}
                className={`
                  w-full p-3 rounded-lg transition-all flex items-center justify-between
                  ${!participante ? 'bg-gray-100' : 'hover:bg-blue-50'}
                  ${isVencedor ? 'bg-green-100 border-2 border-green-500' : 'border-2 border-transparent'}
                  ${isUltimaRodada && isVencedor ? 'animate-pulse bg-yellow-100 border-yellow-500' : ''}
                `}
              >
                <div className="flex-grow">
                  <button
                    onClick={() => participante && handleVencedor(partida, participante)}
                    disabled={!participante}
                    className={`font-medium ${isVencedor ? 'text-green-700' : 'text-gray-700'} w-full text-left`}
                  >
                    {participante?.nome || 'Aguardando...'}
                  </button>
                </div>
                {participante && !isPassagem && (
                  <div className="flex items-center ml-2">
                    <input
                      type="number"
                      min="0"
                      value={placarAtual ?? placarFinal ?? ''}
                      onChange={(e) => handlePlacarChange(partida.id, index === 0 ? 'placar1' : 'placar2', e.target.value)}
                      className="w-16 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                )}
                {isVencedor && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>

        {isPassagem && (
          <div className="absolute -right-6 top-1/2 transform -translate-y-1/2">
            <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
              Passagem Automática
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex gap-8 overflow-x-auto pb-8">
      {Array.from({ length: maxRodada }, (_, i) => i + 1).map((rodada) => {
        const partidasRodada = getPartidasPorRodada(rodada);
        const isUltimaRodada = rodada === maxRodada;

        return (
          <div
            key={rodada}
            className={`flex-shrink-0 w-64 animate-fade-in`}
            style={{ animationDelay: `${rodada * 0.1}s` }}
          >
            <div className={`
              text-center mb-4 p-2 rounded-lg
              ${isUltimaRodada ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}
            `}>
              {isUltimaRodada ? 'Final' : `${rodada}ª Rodada`}
            </div>
            <div className="space-y-8">
              {partidasRodada.map(renderPartida)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Chaveamento;