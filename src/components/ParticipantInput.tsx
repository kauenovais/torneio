import React, { useState, useEffect, useRef } from 'react';
import { Participante } from '../types';
import '../styles/animations.css';

interface Props {
  onSubmit: (participantes: Participante[]) => void;
  isEquipes: boolean;
  tema: 'light' | 'dark';
  className?: string;
}

const EntradaParticipantes: React.FC<Props> = ({ onSubmit, isEquipes, tema, className }) => {
  const [participantes, setParticipantes] = useState<Participante[]>([
    { id: 1, nome: '', seed: 1 },
  ]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const [isLoadingParticipantes, setIsLoadingParticipantes] = useState(true);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Simula carregamento inicial
    setTimeout(() => setIsLoadingParticipantes(false), 1000);
  }, []);

  useEffect(() => {
    // Atualiza a referência dos inputs quando a lista de participantes muda
    inputRefs.current = inputRefs.current.slice(0, participantes.length);
  }, [participantes]);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const formatarNome = (nome: string): string => {
    if (isEquipes) return nome;

    if (!nome.includes(' ')) return nome;

    const partes = nome.split(' ').filter(parte => parte.trim() !== '');
    if (partes.length <= 1) return partes[0] || '';

    const primeiroNome = partes[0];
    const sobrenomes = partes.slice(1).join(' ');

    if (sobrenomes.length > 6) {
      return `${primeiroNome} ${sobrenomes.slice(0, 6)}.`;
    }

    return `${primeiroNome} ${sobrenomes}`;
  };

  const handleAddParticipante = () => {
    // Não adiciona novo participante se o último estiver vazio
    if (participantes[participantes.length - 1].nome.trim() === '') {
      // Foca no último input vazio
      const lastInput = inputRefs.current[participantes.length - 1];
      lastInput?.focus();
      showFeedback('error', 'Preencha o nome do último participante antes de adicionar outro');
      return;
    }

    const novoParticipante = {
      id: participantes.length + 1,
      nome: '',
      seed: participantes.length + 1,
    };

    setParticipantes([...participantes, novoParticipante]);

    // Foca no novo input após um pequeno delay
    setTimeout(() => {
      const newInput = inputRefs.current[participantes.length];
      newInput?.focus();
    }, 100);
  };

  const handleRemoveParticipante = (id: number) => {
    if (participantes.length > 1) {
      const newParticipantes = participantes
        .filter(p => p.id !== id)
        .map((p, index) => ({ ...p, seed: index + 1 }));
      setParticipantes(newParticipantes);

      // Foca no input anterior após remover
      setTimeout(() => {
        const previousInput = inputRefs.current[newParticipantes.length - 1];
        previousInput?.focus();
      }, 100);
    }
  };

  const handleChange = (id: number, value: string) => {
    setParticipantes(participantes.map(p => (p.id === id ? { ...p, nome: value } : p)));
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, id: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const participante = participantes.find(p => p.id === id);
      if (participante && participante.nome.trim() !== '') {
        handleAddParticipante();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const clipboardData = e.clipboardData.getData('text');
    const nomes = clipboardData
      .split(/[\n,]/) // Divide por nova linha ou vírgula
      .map(nome => nome.trim())
      .filter(nome => nome !== '');

    if (nomes.length > 0) {
      const novosParticipantes = nomes.map((nome, index) => ({
        id: participantes.length + index + 1,
        nome: formatarNome(nome),
        seed: participantes.length + index + 1,
      }));

      // Substitui o participante atual (vazio) e adiciona os novos
      setParticipantes([...participantes.slice(0, -1), ...novosParticipantes]);

      // Foca no último input após colar
      setTimeout(() => {
        const lastInput = inputRefs.current[novosParticipantes.length - 1];
        lastInput?.focus();
      }, 100);

      showFeedback('success', `${nomes.length} participantes adicionados com sucesso`);
    }
  };

  const handleBlur = (id: number, value: string) => {
    const nomeFormatado = formatarNome(value);
    setParticipantes(participantes.map(p => (p.id === id ? { ...p, nome: nomeFormatado } : p)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const participantesFormatados = participantes.map(p => ({
      ...p,
      nome: formatarNome(p.nome),
    }));
    setParticipantes(participantesFormatados);

    const vazios = participantesFormatados.some(p => !p.nome.trim());
    if (vazios) {
      setError('Todos os campos devem ser preenchidos');
      showFeedback('error', 'Preencha todos os campos antes de continuar');
      return;
    }

    const nomesExatos = participantesFormatados.map(p => p.nome.trim());
    const duplicados = nomesExatos.some(
      (nome, index) => nomesExatos.findIndex(n => n === nome) !== index
    );

    if (duplicados) {
      setError(
        'Não são permitidos participantes com exatamente o mesmo nome. Adicione um sobrenome ou identificador para diferenciá-los.'
      );
      showFeedback('error', 'Existem nomes duplicados na lista');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      onSubmit(participantesFormatados);
      showFeedback('success', 'Participantes registrados com sucesso!');
    } catch (error) {
      showFeedback('error', 'Erro ao registrar participantes. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingParticipantes) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
        <div className="space-y-4">
          {[1, 2, 3].map(index => (
            <div key={index} className="skeleton h-16 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 animate-fade-in ${className || ''}`}
      role="form"
      aria-label={
        isEquipes ? 'Formulário de cadastro de equipes' : 'Formulário de cadastro de participantes'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          {participantes.map((participante, index) => (
            <div
              key={participante.id}
              className="flex items-center space-x-3 animate-slide-in"
              role="group"
              aria-label={`Participante ${index + 1}`}
            >
              <div className="flex-grow">
                <label
                  className={`block text-sm font-medium mb-1 ${
                    tema === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                  htmlFor={`participante-${participante.id}`}
                >
                  {isEquipes ? 'Nome da Equipe' : 'Nome do Participante'} {index + 1}
                </label>
                <div className="relative">
                  <input
                    id={`participante-${participante.id}`}
                    type="text"
                    value={participante.nome}
                    onChange={e => handleChange(participante.id, e.target.value)}
                    onKeyPress={e => handleKeyPress(e, participante.id)}
                    onPaste={handlePaste}
                    onBlur={e => handleBlur(participante.id, e.target.value)}
                    ref={el => (inputRefs.current[index] = el)}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all focus-visible ${
                      tema === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder={
                      isEquipes
                        ? 'Digite o nome da equipe ou cole uma lista'
                        : 'Digite o nome completo ou cole uma lista'
                    }
                    aria-label={
                      isEquipes
                        ? `Nome da equipe ${index + 1}`
                        : `Nome do participante ${index + 1}`
                    }
                    required
                  />
                  <div
                    className="tooltip"
                    data-tooltip="Pressione Enter para adicionar mais ou cole uma lista"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              {participantes.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveParticipante(participante.id)}
                  className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors touch-feedback"
                  aria-label={`Remover ${isEquipes ? 'equipe' : 'participante'} ${index + 1}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        {feedback && (
          <div className={`feedback-${feedback.type}`} role="alert">
            {feedback.message}
          </div>
        )}

        {error && (
          <div className="feedback-error" role="alert">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={handleAddParticipante}
            className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors touch-feedback focus-visible"
            aria-label={`Adicionar novo ${isEquipes ? 'equipe' : 'participante'}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
            Adicionar {isEquipes ? 'Equipe' : 'Participante'}
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors touch-feedback focus-visible disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
            aria-label="Gerar chaveamento"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner mr-2" />
                Gerando...
              </>
            ) : (
              'Gerar Chaveamento'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EntradaParticipantes;
