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
  const [placares, setPlacares] = useState<Record<string, { placar1?: number; placar2?: number }>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const maxRodada = Math.max(...partidas.map(p => p.rodada));

  useEffect(() => {
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

  const handlePlacarChange = (partidaId: string, campo: 'placar1' | 'placar2', valor: string) => {
    const numeroValor = parseInt(valor, 10);
    if (isNaN(numeroValor) || numeroValor < 0) return;

    setPlacares(prev => ({
      ...prev,
      [partidaId]: {
        ...prev[partidaId],
        [campo]: numeroValor,
      },
    }));

    const partida = partidas.find(p => p.id === partidaId);
    if (!partida) return;

    const placaresAtuais = {
      ...placares[partidaId],
      [campo]: numeroValor,
    };

    if (typeof placaresAtuais.placar1 === 'number' && typeof placaresAtuais.placar2 === 'number') {
      let vencedor: Participante | undefined;

      if (placaresAtuais.placar1 > placaresAtuais.placar2) {
        vencedor = partida.participante1 || undefined;
      } else if (placaresAtuais.placar1 < placaresAtuais.placar2) {
        vencedor = partida.participante2 || undefined;
      }

      const partidaAtualizada: Partida = {
        ...partida,
        placar1: placaresAtuais.placar1,
        placar2: placaresAtuais.placar2,
        vencedor,
      };

      if (partidaAtualizada.vencedor) {
        onAtualizarPartida(partidaAtualizada);
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(Math.ceil(partidas.length / 2))].map((_, index) => (
          <div key={index} className="skeleton h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  const renderPartida = (partida: Partida) => {
    const isPassagem = !partida.participante2;
    const placaresDaPartida = placares[partida.id] || {};

    return (
      <motion.div
        key={partida.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-lg shadow-md p-4 mb-4 ${
          partida.rodada === 1 ? 'ml-0' : `ml-${partida.rodada * 4}`
        }`}
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
                className={`flex items-center justify-between p-2 rounded ${
                  !participante ? 'bg-gray-50' : 'hover:bg-blue-50'
                } ${isVencedor ? 'bg-green-50 border border-green-500' : ''} ${
                  isUltimaRodada && isVencedor ? 'animate-pulse bg-yellow-50' : ''
                } transition-all`}
              >
                <button
                  onClick={() => participante && handleVencedor(partida, participante)}
                  disabled={!participante}
                  className={`flex-grow text-left font-medium ${
                    isVencedor ? 'text-green-700' : 'text-gray-700'
                  }`}
                >
                  {participante?.nome || 'Aguardando...'}
                </button>
                {participante && !isPassagem && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      value={placarAtual ?? placarFinal ?? ''}
                      onChange={e =>
                        handlePlacarChange(
                          partida.id,
                          index === 0 ? 'placar1' : 'placar2',
                          e.target.value
                        )
                      }
                      className="w-16 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                )}
                {isVencedor && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-600 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
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
            className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg ${
              feedback.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col space-y-4">
        {partidas.map(partida => renderPartida(partida))}
      </div>
    </div>
  );
};

export default Chaveamento;
