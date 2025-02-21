import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  tema: 'light' | 'dark';
}

interface GuideItem {
  title: string;
  description: string;
  icon: JSX.Element;
  tips: string[];
}

const HelpGuide: React.FC<Props> = ({ tema }) => {
  const [showHelp, setShowHelp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simula carregamento inicial
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowHelp(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowHelp(false);
      }
    };

    if (showHelp) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showHelp]);

  const guideItems: GuideItem[] = [
    {
      title: 'Criar Torneio',
      description: 'Como começar um novo torneio',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
      tips: [
        'Escolha entre torneio individual ou em equipes',
        'Digite o nome do torneio',
        'Adicione participantes um por um ou cole uma lista',
        'Clique em "Gerar Chaveamento" quando finalizar',
      ],
    },
    {
      title: 'Gerenciar Partidas',
      description: 'Como atualizar e acompanhar as partidas',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      ),
      tips: [
        'Clique em uma partida para inserir o placar',
        'O sistema atualiza automaticamente o chaveamento',
        'Acompanhe o progresso em tempo real',
        'Veja estatísticas detalhadas do torneio',
      ],
    },
    {
      title: 'Compartilhar',
      description: 'Como compartilhar o torneio',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
        </svg>
      ),
      tips: [
        'Use o botão "Compartilhar" no topo da página',
        'Copie o link do torneio para compartilhar',
        'Exporte o torneio para backup',
        'Importe um torneio existente',
      ],
    },
    {
      title: 'Personalização',
      description: 'Como personalizar seu torneio',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd"
          />
        </svg>
      ),
      tips: [
        'Alterne entre tema claro e escuro',
        'Configure pontuações e regras',
        'Adicione um logo personalizado',
        'Gerencie administradores do torneio',
      ],
    },
  ];

  if (isLoading) {
    return (
      <button
        className={`fixed bottom-4 right-20 rounded-full p-3 shadow-lg transition-colors skeleton ${
          tema === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
        aria-label="Carregando guia de ajuda"
      >
        <div className="h-6 w-6" />
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowHelp(true)}
        className={`fixed bottom-4 right-20 rounded-full p-3 shadow-lg transition-colors touch-feedback focus-visible ${
          tema === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
        }`}
        aria-label="Abrir guia de ajuda"
        aria-expanded={showHelp}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 ${tema === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-50 p-4 sm:p-6"
            style={{ paddingTop: '5vh', paddingBottom: '5vh' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-guide-title"
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-2xl rounded-xl p-6 shadow-xl optimize-animation ${
                tema === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="sticky top-0 flex items-center justify-between bg-inherit pb-4">
                <h2 id="help-guide-title" className="text-xl font-bold">
                  Como Usar o Sistema
                </h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className={`rounded-lg p-2 transition-colors touch-feedback focus-visible ${
                    tema === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                  aria-label="Fechar guia de ajuda"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto pr-2">
                <div className="space-y-6">
                  {guideItems.map((item, index) => (
                    <div
                      key={item.title}
                      className={`rounded-lg p-4 ${tema === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
                      role="region"
                      aria-labelledby={`guide-title-${index}`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`rounded-lg p-2 ${
                            tema === 'dark' ? 'bg-gray-600' : 'bg-white'
                          }`}
                        >
                          {item.icon}
                        </div>
                        <div>
                          <h3 id={`guide-title-${index}`} className="text-lg font-medium">
                            {item.title}
                          </h3>
                          <p
                            className={`text-sm ${
                              tema === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}
                          >
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ul className="ml-4 space-y-2" role="list">
                        {item.tips.map((tip, tipIndex) => (
                          <li
                            key={tipIndex}
                            className={`flex items-center gap-2 text-sm ${
                              tema === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}
                          >
                            <span className="text-blue-500" aria-hidden="true">
                              •
                            </span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className={`text-sm ${tema === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Pressione ESC ou clique fora para fechar este guia
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HelpGuide;
