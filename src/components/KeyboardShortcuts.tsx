import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  tema: 'light' | 'dark';
}

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
}

const KeyboardShortcuts: React.FC<Props> = ({ tema }) => {
  const [showHelp, setShowHelp] = useState(false);

  const shortcuts: Shortcut[] = [
    {
      key: '?',
      description: 'Mostrar/ocultar ajuda',
      action: () => setShowHelp(prev => !prev),
    },
    {
      key: 'n',
      description: 'Novo torneio',
      action: () => document.querySelector<HTMLButtonElement>('.novo-torneio-btn')?.click(),
    },
    {
      key: 't',
      description: 'Alternar tema',
      action: () => document.querySelector<HTMLButtonElement>('.tema-btn')?.click(),
    },
    {
      key: 'c',
      description: 'Compartilhar torneio',
      action: () => document.querySelector<HTMLButtonElement>('.compartilhar-btn')?.click(),
    },
    {
      key: 'Esc',
      description: 'Fechar diálogos',
      action: () => setShowHelp(false),
    },
  ];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const shortcut = shortcuts.find(s => s.key.toLowerCase() === e.key.toLowerCase());
      if (shortcut) {
        e.preventDefault();
        shortcut.action();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [shortcuts]);

  return (
    <>
      <button
        onClick={() => setShowHelp(true)}
        className={`fixed bottom-4 right-20 rounded-full p-3 shadow-lg transition-colors ${
          tema === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 ${tema === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}
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
      </button>

      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-md rounded-xl p-6 shadow-xl ${
                tema === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Atalhos de Teclado</h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    tema === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                {shortcuts.map(shortcut => (
                  <div key={shortcut.key} className="flex items-center justify-between py-2">
                    <span className={tema === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                      {shortcut.description}
                    </span>
                    <kbd
                      className={`px-3 py-1 rounded-lg font-mono text-sm ${
                        tema === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <p className={`text-sm ${tema === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Pressione '?' a qualquer momento para ver esta ajuda
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default KeyboardShortcuts;
