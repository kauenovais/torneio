import React, { useState, useEffect } from 'react';
import { Partida, Participante } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/animations.css';

interface Props {
  partidas: Partida[];
  onAtualizarPartida: (partida: Partida) => void;
  tema?: 'light' | 'dark';
}

const Chaveamento: React.FC<Props> = ({ partidas, onAtualizarPartida, tema = 'light' }) => {
  const [placares, setPlacares] = useState<Record<string, { placar1?: number; placar2?: number }>>({});
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const maxRodada = Math.max(...partidas.map(p => p.rodada));

  useEffect(() => {
    // Simula carregamento inicial
    setTimeout(() => setLoading(false), 800);
  }, []);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleVencedor = async (partida: Partida, vencedor: Participante) => {
    try {
      setLoading(true);
      const partidaAtualizada = { ...partida, vencedor };
      await onAtualizarPartida(partidaAtualizada);
      showFeedback('success', `${vencedor.nome} definido como vencedor!`);
    } catch (error) {
      showFeedback('error', 'Erro ao definir vencedor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlacarChange = (
    partidaId: string,
    campo: 'placar1' | 'placar2',
    valor: string
  ) => {
    const numeroValor = parseInt(valor, 10);
    if (isNaN(numeroValor) || numeroValor < 0) return;

    setPlacares(prev => ({
      ...prev,
      [partidaId]: {
        ...prev[partidaId],
        [campo]: numeroValor
      }
    }));

    const partida = partidas.find(p => p.id === partidaId);
    if (!partida) return;

    const placaresAtuais = {
      ...placares[partidaId],
      [campo]: numeroValor
    };

    if (typeof placaresAtuais.placar1 === 'number' && typeof placaresAtuais.placar2 === 'number') {
      const partidaAtualizada = {
        ...partida,
        placar1: placaresAtuais.placar1,
        placar2: placaresAtuais.placar2,
        vencedor: placaresAtuais.placar1 > placaresAtuais.placar2
          ? partida.participante1
          : placaresAtuais.placar1 < placaresAtuais.placar2
          ? partida.participante2
          : undefined
      };

      onAtualizarPartida(partidaAtualizada);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {[...Array(Math.ceil(partidas.length / 2))].map((_, index) => (
          <div key={index} className="skeleton h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  const renderPartida = (partida: Partida) => {
    const isPassagem = !partida.participante2;
    const spacing = partida.rodada === 1 ? 'mb-4' : 'mb-8';
    const placaresDaPartida = placares[partida.id] || {};

    return (
      <motion.div
        key={partida.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`relative bg-white rounded-lg shadow-lg p-4 ${spacing} optimize-animation touch-feedback`}
        role="group"
        aria-label={`Partida ${partida.id}`}
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
                role="group"
                aria-label={participante ? `${participante.nome}${isVencedor ? ' (Vencedor)' : ''}` : 'Aguardando participante'}
              >
                <div className="flex-grow">
                  <button
                    onClick={() => participante && handleVencedor(partida, participante)}
                    disabled={!participante}
                    className={`font-medium ${isVencedor ? 'text-green-700' : 'text-gray-700'} w-full text-left focus-visible`}
                    aria-label={participante ? `Definir ${participante.nome} como vencedor` : 'Aguardando participante'}
                  >
                    {participante?.nome || 'Aguardando...'}
                  </button>
                </div>
                {participante && !isPassagem && (
                  <div className="flex items-center ml-2">
                    <label className="sr-only">
                      {`Placar de ${participante.nome}`}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={placarAtual ?? placarFinal ?? ''}
                      onChange={(e) => handlePlacarChange(partida.id, index === 0 ? 'placar1' : 'placar2', e.target.value)}
                      className="w-16 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent focus-visible"
                      placeholder="0"
                      aria-label={`Placar de ${participante.nome}`}
                    />
                  </div>
                )}
                {isVencedor && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-600 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`feedback-${feedback.type} fixed top-4 right-4 z-50`}
            role="alert"
          >
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="space-y-8"
        role="region"
        aria-label="Chaveamento do torneio"
      >
        {partidas.map(partida => renderPartida(partida))}
      </div>
    </div>
  );
};

export default Chaveamento;
