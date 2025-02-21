import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingStep {
  title: string;
  description: string;
  icon: JSX.Element;
}

interface Props {
  onComplete: () => void;
  tema: 'light' | 'dark';
}

const Onboarding: React.FC<Props> = ({ onComplete, tema }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('hasSeenOnboarding');
    if (seen) {
      onComplete();
    }
  }, [onComplete]);

  const steps: OnboardingStep[] = [
    {
      title: 'Bem-vindo ao Gerenciador de Torneios',
      description: 'Crie e gerencie seus torneios de forma simples e intuitiva.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16"
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
    },
    {
      title: 'Escolha o Tipo de Torneio',
      description: 'Individual ou em equipes, você decide como organizar sua competição.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      title: 'Acompanhe em Tempo Real',
      description: 'Atualize resultados e veja as estatísticas instantaneamente.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  const handleComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`relative w-full max-w-lg rounded-2xl p-8 ${
          tema === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="mb-6 flex justify-center">{steps[currentStep].icon}</div>
            <h2 className="mb-4 text-2xl font-bold">{steps[currentStep].title}</h2>
            <p className="mb-8 text-gray-600 dark:text-gray-300">
              {steps[currentStep].description}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 0}
            className={`rounded-lg px-4 py-2 transition-colors ${
              tema === 'dark'
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } disabled:opacity-50`}
          >
            Anterior
          </button>
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  currentStep === index
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
          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              className={`rounded-lg px-4 py-2 transition-colors ${
                tema === 'dark'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Próximo
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className={`rounded-lg px-4 py-2 transition-colors ${
                tema === 'dark'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              Começar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
