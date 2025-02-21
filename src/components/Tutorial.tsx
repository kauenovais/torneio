import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  tema: 'light' | 'dark';
  onComplete: () => void;
}

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const Tutorial: React.FC<Props> = ({ tema, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps: TutorialStep[] = [
    {
      id: 'tipo-torneio',
      title: 'Escolha o Tipo',
      description: 'Selecione entre torneio individual ou em equipes.',
      target: '.tipo-torneio-btn',
      position: 'bottom',
    },
    {
      id: 'participantes',
      title: 'Adicione Participantes',
      description: 'Digite os nomes ou cole uma lista de participantes.',
      target: '.participantes-input',
      position: 'top',
    },
    {
      id: 'chaveamento',
      title: 'Gerencie o Chaveamento',
      description: 'Acompanhe e atualize os resultados das partidas.',
      target: '.chaveamento-container',
      position: 'left',
    },
    {
      id: 'compartilhar',
      title: 'Compartilhe',
      description: 'Compartilhe o torneio com outros participantes.',
      target: '.compartilhar-btn',
      position: 'left',
    },
  ];

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (hasSeenTutorial) {
      setIsVisible(false);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  const currentTip = steps[currentStep];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 pointer-events-none"
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`absolute p-4 rounded-lg shadow-lg pointer-events-auto ${
            tema === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          }`}
          style={{
            maxWidth: '300px',
            [currentTip.position]: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <h3 className="text-lg font-semibold mb-2">{currentTip.title}</h3>
          <p className={`text-sm ${tema === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {currentTip.description}
          </p>

          <div className="mt-4 flex justify-between items-center">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep
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

            <button
              onClick={handleNext}
              className={`px-4 py-2 rounded-lg transition-colors ${
                tema === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {currentStep === steps.length - 1 ? 'Concluir' : 'Próximo'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Tutorial;
