import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  tema: 'light' | 'dark';
}

const Feedback: React.FC<Props> = ({ tema }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'other' | null>(null);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    // Simular envio do feedback
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Aqui você implementaria a lógica real de envio do feedback
    console.log({
      type: feedbackType,
      message,
      email,
    });

    setIsSending(false);
    setShowSuccess(true);
    setTimeout(() => {
      setIsOpen(false);
      setShowSuccess(false);
      setFeedbackType(null);
      setMessage('');
      setEmail('');
    }, 2000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 rounded-full p-4 shadow-lg transition-colors ${
          tema === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-lg rounded-2xl p-8 ${
                tema === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              {showSuccess ? (
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-4 text-xl font-semibold">Feedback Enviado!</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Obrigado por nos ajudar a melhorar.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h2 className="mb-6 text-2xl font-bold">Envie seu Feedback</h2>

                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => setFeedbackType('bug')}
                      className={`rounded-lg p-4 text-center transition-colors ${
                        feedbackType === 'bug'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100'
                          : tema === 'dark'
                          ? 'bg-gray-700 hover:bg-gray-600'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-2xl">🐛</span>
                      <p className="mt-2">Reportar Bug</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeedbackType('feature')}
                      className={`rounded-lg p-4 text-center transition-colors ${
                        feedbackType === 'feature'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                          : tema === 'dark'
                          ? 'bg-gray-700 hover:bg-gray-600'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-2xl">💡</span>
                      <p className="mt-2">Sugerir Recurso</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeedbackType('other')}
                      className={`rounded-lg p-4 text-center transition-colors ${
                        feedbackType === 'other'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100'
                          : tema === 'dark'
                          ? 'bg-gray-700 hover:bg-gray-600'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-2xl">💭</span>
                      <p className="mt-2">Outro</p>
                    </button>
                  </div>

                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium">Sua Mensagem</label>
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className={`w-full rounded-lg p-3 ${
                        tema === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                      }`}
                      rows={4}
                      placeholder="Descreva seu feedback..."
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium">Email (opcional)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className={`w-full rounded-lg p-3 ${
                        tema === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                      }`}
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className={`rounded-lg px-4 py-2 transition-colors ${
                        tema === 'dark'
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={!feedbackType || !message || isSending}
                      className={`rounded-lg px-4 py-2 transition-colors ${
                        tema === 'dark'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      } disabled:opacity-50`}
                    >
                      {isSending ? 'Enviando...' : 'Enviar Feedback'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Feedback;
