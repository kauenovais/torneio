import { useState } from 'react';
import classNames from 'classnames';
import { Partida } from '../types';

interface ChaveamentoProps {
  partidas: Partida[];
  onAtualizarPartida: (partida: Partida) => void;
}

export default function Chaveamento({ partidas, onAtualizarPartida }: ChaveamentoProps) {
  const [partidaFocada, setPartidaFocada] = useState<string | null>(null);
  const maxFase = Math.max(...partidas.map(m => m.fase));
  
  const partidasPorFase = Array.from({ length: maxFase }, (_, i) => 
    partidas.filter(m => m.fase === i + 1)
  );

  const handlePontuacaoChange = (partida: Partida, isPrimeiro: boolean, valor: string) => {
    const pontuacao = valor === '' ? undefined : Math.max(0, parseInt(valor) || 0);
    
    const partidaAtualizada = {
      ...partida,
      pontuacao1: isPrimeiro ? pontuacao : partida.pontuacao1,
      pontuacao2: !isPrimeiro ? pontuacao : partida.pontuacao2
    };
    onAtualizarPartida(partidaAtualizada);
  };

  const getEstiloParticipante = (partida: Partida, isPrimeiro: boolean) => {
    const participante = isPrimeiro ? partida.participante1 : partida.participante2;
    const isVencedor = partida.vencedor?.id === participante?.id;
    const isPerdedor = partida.vencedor && partida.vencedor.id !== participante?.id;
    const isPassagemDireta = participante && !partida.participante2;
    const isFocado = partida.id === partidaFocada;

    return classNames(
      'flex items-center justify-between gap-4 p-3 rounded-lg transition-all duration-200',
      {
        'bg-blue-100 text-blue-700 font-semibold': isVencedor,
        'bg-gray-100 text-gray-400': isPerdedor,
        'bg-green-50 text-green-700': isPassagemDireta,
        'bg-gray-50 text-gray-900 hover:bg-gray-100': !isVencedor && !isPerdedor && !isPassagemDireta && participante,
        'bg-gray-50 text-gray-400 italic': !participante,
        'ring-2 ring-blue-400': isFocado
      }
    );
  };

  const getTituloFase = (indiceFase: number) => {
    if (indiceFase === maxFase - 1) return 'Final';
    if (indiceFase === maxFase - 2) return 'Semifinal';
    if (indiceFase === maxFase - 3) return 'Quartas de Final';
    if (indiceFase === maxFase - 4) return 'Oitavas de Final';
    return `${indiceFase + 1}ª Fase`;
  };

  const isPartidaJogavel = (partida: Partida) => {
    return partida.participante1 !== undefined;
  };

  const deveMostrarPontuacao = (partida: Partida, isPrimeiro: boolean) => {
    return (partida.participante1 && partida.participante2) || 
           (isPrimeiro && partida.participante1 && !partida.participante2);
  };

  const getStatusPartida = (partida: Partida) => {
    if (!partida.participante1) return null;
    if (!partida.participante2) return 'participante-unico';
    if (partida.vencedor) return 'concluida';
    if (partida.pontuacao1 !== undefined || partida.pontuacao2 !== undefined) return 'em-andamento';
    return 'aguardando';
  };

  const getBadgeStatus = (status: string | null) => {
    if (!status) return null;
    
    const badges = {
      'concluida': { bg: 'bg-green-100', text: 'text-green-800', label: 'Concluída' },
      'em-andamento': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Em Andamento' },
      'aguardando': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Aguardando' },
      'participante-unico': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Participante Único' }
    };

    const badge = badges[status as keyof typeof badges];
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${badge.bg} ${badge.text} font-medium`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="flex flex-col items-center gap-12 p-4">
      {partidasPorFase.map((partidasFase, indiceFase) => {
        const isUltimasFases = indiceFase >= maxFase - 2;
        
        return (
          <div key={indiceFase} className="w-full">
            <h3 className="text-xl font-bold text-center mb-6 text-blue-900 bg-blue-50 py-3 rounded-lg">
              {getTituloFase(indiceFase)}
            </h3>
            <div className={classNames(
              'grid gap-8 mx-auto',
              {
                'max-w-xl': isUltimasFases,
                'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-7xl': !isUltimasFases
              }
            )}>
              {partidasFase.map((partida) => {
                const status = getStatusPartida(partida);
                return (
                  <div 
                    key={partida.id} 
                    className={classNames(
                      "bg-white rounded-xl shadow-lg p-4 border transition-all duration-200",
                      {
                        'border-gray-100': partida.id !== partidaFocada,
                        'border-blue-400 shadow-lg shadow-blue-100': partida.id === partidaFocada
                      }
                    )}
                    onClick={() => setPartidaFocada(partida.id)}
                    onMouseLeave={() => setPartidaFocada(null)}
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-500">
                          Partida {partida.id.replace('p', '')}
                        </span>
                        {getBadgeStatus(status)}
                      </div>
                      <div className={getEstiloParticipante(partida, true)}>
                        <span className="flex-grow">{partida.participante1?.nome || 'A Definir'}</span>
                        {deveMostrarPontuacao(partida, true) && (
                          <input
                            type="number"
                            min="0"
                            className={classNames(
                              "w-16 p-2 border rounded-md focus:outline-none focus:ring-2 transition-colors",
                              {
                                'bg-gray-50 border-gray-200': !isPartidaJogavel(partida),
                                'border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300': isPartidaJogavel(partida)
                              }
                            )}
                            value={partida.pontuacao1 ?? ''}
                            onChange={(e) => handlePontuacaoChange(partida, true, e.target.value)}
                            disabled={!isPartidaJogavel(partida)}
                            placeholder="0"
                          />
                        )}
                      </div>
                      <div className="border-t border-gray-100" />
                      <div className={getEstiloParticipante(partida, false)}>
                        <span className="flex-grow">
                          {partida.participante2?.nome || 'A Definir'}
                        </span>
                        {deveMostrarPontuacao(partida, false) && (
                          <input
                            type="number"
                            min="0"
                            className={classNames(
                              "w-16 p-2 border rounded-md focus:outline-none focus:ring-2 transition-colors",
                              {
                                'bg-gray-50 border-gray-200': !isPartidaJogavel(partida),
                                'border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300': isPartidaJogavel(partida)
                              }
                            )}
                            value={partida.pontuacao2 ?? ''}
                            onChange={(e) => handlePontuacaoChange(partida, false, e.target.value)}
                            disabled={!isPartidaJogavel(partida)}
                            placeholder="0"
                          />
                        )}
                      </div>
                      {partida.vencedor && (
                        <div className="mt-3 text-sm bg-green-50 text-green-700 p-2 rounded-md font-medium flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Vencedor: {partida.vencedor.nome}
                        </div>
                      )}
                      {partida.proximaPartidaId && (
                        <div className="mt-2 text-xs text-gray-500">
                          Próxima partida: {partida.proximaPartidaId.replace('p', '')}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}