import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  tema: 'light' | 'dark';
}

interface Tip {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  shortcut?: string;
}

const TipsAndShortcuts: React.FC<Props> = ({ tema }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const tips: Tip[] = [
    {
      id: 'quick-add',
      title: 'Adição Rápida',
      description: 'Pressione Enter para adicionar rapidamente mais participantes.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      ),
      shortcut: 'Enter',
    },
    {
      id: 'bulk-paste',
      title: 'Colar em Massa',
      description: 'Cole uma lista de nomes para adicionar vários participantes de uma vez.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
      shortcut: 'Ctrl + V',
    },
    {
      id: 'quick-update',
      title: 'Atualização de Placar',
      description: 'Use as setas para navegar entre os campos de placar.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      ),
      shortcut: '↑ ↓ → ←',
    },
    {
      id: 'theme-toggle',
      title: 'Alternar Tema',
      description: 'Mude rapidamente entre os temas claro e escuro.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ),
      shortcut: 'Ctrl + T',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % tips.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <div
      className={`fixed bottom-4 left-4 rounded-lg p-4 shadow-lg transition-colors ${
        tema === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTipIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex items-start space-x-4"
        >
          <div className={`rounded-full p-2 ${tema === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {tips[currentTipIndex].icon}
          </div>
          <div>
            <h3 className="font-semibold">{tips[currentTipIndex].title}</h3>
            <p className={`text-sm ${tema === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {tips[currentTipIndex].description}
            </p>
            {tips[currentTipIndex].shortcut && (
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-xs text-gray-500">Atalho:</span>
                <kbd
                  className={`rounded px-2 py-1 text-xs font-semibold ${
                    tema === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {tips[currentTipIndex].shortcut}
                </kbd>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex justify-center space-x-2">
        {tips.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentTipIndex(index)}
            className={`h-2 w-2 rounded-full transition-colors ${
              currentTipIndex === index
                ? tema === 'dark'
                  ? 'bg-blue-500'
                  : 'bg-blue-600'
                : tema === 'dark'
                ? 'bg-gray-600'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TipsAndShortcuts;
