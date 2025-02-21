import React, { useState, useEffect } from 'react';
import { Participante } from '../types';
import '../styles/animations.css';

interface Props {
  onSubmit: (participantes: Participante[]) => void;
  isEquipes: boolean;
}

const EntradaParticipantes: React.FC<Props> = ({ onSubmit, isEquipes }) => {
  const [participantes, setParticipantes] = useState<Participante[]>([{ id: 1, nome: '', seed: 1 }]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detecta se é dispositivo móvel
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      return;
    }

    setParticipantes([
      ...participantes,
      { id: participantes.length + 1, nome: '', seed: participantes.length + 1 }
    ]);
  };

  const handleRemoveParticipante = (id: number) => {
    if (participantes.length > 1) {
      const newParticipantes = participantes.filter(p => p.id !== id)
        .map((p, index) => ({ ...p, seed: index + 1 }));
      setParticipantes(newParticipantes);
    }
  };

  const handleChange = (id: number, value: string) => {
    setParticipantes(participantes.map(p =>
      p.id === id ? { ...p, nome: value } : p
    ));
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, id: number) => {
    if (e.key === 'Enter' && !isMobile) {
      e.preventDefault();
      const participante = participantes.find(p => p.id === id);
      if (participante && participante.nome.trim() !== '') {
        handleAddParticipante();
        // Foca no novo input após um pequeno delay
        setTimeout(() => {
          const inputs = document.querySelectorAll('input[type="text"]');
          const lastInput = inputs[inputs.length - 1] as HTMLInputElement;
          lastInput?.focus();
        }, 100);
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
        seed: participantes.length + index + 1
      }));

      // Substitui o participante atual (vazio) e adiciona os novos
      setParticipantes([
        ...participantes.slice(0, -1),
        ...novosParticipantes
      ]);
    }
  };

  const handleBlur = (id: number, value: string) => {
    const nomeFormatado = formatarNome(value);
    setParticipantes(participantes.map(p =>
      p.id === id ? { ...p, nome: nomeFormatado } : p
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const participantesFormatados = participantes.map(p => ({
      ...p,
      nome: formatarNome(p.nome)
    }));
    setParticipantes(participantesFormatados);

    const vazios = participantesFormatados.some(p => !p.nome.trim());
    if (vazios) {
      setError('Todos os campos devem ser preenchidos');
      return;
    }

    const nomesExatos = participantesFormatados.map(p => p.nome.trim());
    const duplicados = nomesExatos.some((nome, index) => 
      nomesExatos.findIndex(n => n === nome) !== index
    );

    if (duplicados) {
      setError('Não são permitidos participantes com exatamente o mesmo nome. Adicione um sobrenome ou identificador para diferenciá-los.');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      onSubmit(participantesFormatados);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          {participantes.map((participante, index) => (
            <div
              key={participante.id}
              className="flex items-center space-x-3 animate-slide-in"
            >
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isEquipes ? 'Nome da Equipe' : 'Nome do Participante'} {index + 1}
                </label>
                <input
                  type="text"
                  value={participante.nome}
                  onChange={(e) => handleChange(participante.id, e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, participante.id)}
                  onPaste={handlePaste}
                  onBlur={(e) => handleBlur(participante.id, e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder={isEquipes 
                    ? 'Digite o nome da equipe ou cole uma lista' 
                    : 'Digite o nome completo ou cole uma lista'
                  }
                />
                {!isEquipes && (
                  <p className="mt-1 text-xs text-gray-500">
                    {isMobile 
                      ? 'Digite o nome ou cole uma lista separada por vírgulas ou linhas'
                      : 'Digite o nome e pressione Enter para adicionar mais, ou cole uma lista'
                    }
                  </p>
                )}
              </div>
              {participantes.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveParticipante(participante.id)}
                  className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg animate-shake">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={handleAddParticipante}
            className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors hover-scale"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Adicionar {isEquipes ? 'Equipe' : 'Participante'}
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors hover-scale disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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