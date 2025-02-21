import React, { useState, useEffect, useRef } from 'react';
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
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const maxRodada = Math.max(...partidas.map(p => p.rodada));

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    if (!containerRef.current) return;

    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    if (!containerRef.current) return;

    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
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
      <div className="grid grid-cols-1 gap-4 md:gap-8">
        {[...Array(Math.ceil(partidas.length / 2))].map((_, index) => (
          <div key={index} className="skeleton h-16 md:h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  const partidasPorRodada = partidas.reduce((acc, partida) => {
    if (!acc[partida.rodada]) {
      acc[partida.rodada] = [];
    }
    acc[partida.rodada].push(partida);
    return acc;
  }, {} as Record<number, Partida[]>);

  const renderPartida = (partida: Partida) => {
    const isPassagem = !partida.participante2;
    const placaresDaPartida = placares[partida.id] || {};

    return (
      <motion.div
        key={partida.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative bg-white rounded-lg shadow-md p-2 md:p-4 ${
          tema === 'dark' ? 'bg-gray-800' : ''
        } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        <div className="space-y-1 md:space-y-2">
          {[partida.participante1, partida.participante2].map((participante, index) => {
            if (!participante && index === 1 && isPassagem) return null;

            const isVencedor = participante?.id === partida.vencedor?.id;
            const isUltimaRodada = partida.rodada === maxRodada;
            const placarAtual = index === 0 ? placaresDaPartida.placar1 : placaresDaPartida.placar2;
            const placarFinal = index === 0 ? partida.placar1 : partida.placar2;

            return (
              <div
                key={participante?.id || `empty-${index}`}
                className={`flex items-center justify-between p-1 md:p-2 rounded transition-all ${
                  !participante ? 'bg-gray-50' : 'hover:bg-blue-50'
                } ${isVencedor ? 'bg-green-50 border border-green-500' : ''} ${
                  isUltimaRodada && isVencedor ? 'animate-pulse bg-yellow-50' : ''
                }`}
              >
                <button
                  onClick={() => participante && handleVencedor(partida, participante)}
                  disabled={!participante}
                  className={`flex-grow text-left text-sm md:text-base font-medium truncate ${
                    isVencedor ? 'text-green-700' : 'text-gray-700'
                  }`}
                >
                  {participante?.nome || 'Aguardando...'}
                </button>
                {participante && !isPassagem && (
                  <div className="flex items-center space-x-1 md:space-x-2">
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
                      className="w-12 md:w-16 px-1 md:px-2 py-1 text-xs md:text-sm border rounded focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                )}
                {isVencedor && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 md:h-5 md:w-5 text-green-600 ml-1 md:ml-2"
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
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none" />

      <div className="mb-2 text-sm text-gray-500 dark:text-gray-400 text-center">
        ← Arraste para navegar horizontalmente →
      </div>

      <div
        ref={containerRef}
        className="relative overflow-x-auto pb-4 touch-pan-x"
        style={{
          overscrollBehaviorX: 'contain',
          WebkitOverflowScrolling: 'touch',
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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

        <div className="flex min-w-fit">
          {Object.entries(partidasPorRodada).map(([rodada, partidasRodada]) => (
            <div
              key={rodada}
              className={`flex flex-col justify-around min-w-[250px] md:min-w-[300px] ${
                Number(rodada) > 1 ? 'ml-4 md:ml-8' : ''
              }`}
              style={{
                height: `${Math.pow(2, maxRodada - Number(rodada)) * 100}px`,
                marginTop: `${Math.pow(2, Number(rodada) - 1) * 15}px`,
              }}
            >
              {partidasRodada.map((partida, index) => (
                <div
                  key={partida.id}
                  className="relative"
                  style={{
                    marginBottom: index < partidasRodada.length - 1 ? '1.5rem' : 0,
                  }}
                >
                  {renderPartida(partida)}
                  {Number(rodada) > 1 && (
                    <div
                      className="absolute left-0 top-1/2 w-4 md:w-8 border-t-2 border-gray-300"
                      style={{ transform: 'translateX(-100%)' }}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chaveamento;
