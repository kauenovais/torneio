import { useState } from 'react';
import classNames from 'classnames';
import { Participante } from '../types';

interface EntradaParticipantesProps {
  onSubmit: (participantes: Participante[]) => void;
  isEquipes: boolean;
}

export default function EntradaParticipantes({ onSubmit, isEquipes }: EntradaParticipantesProps) {
  const [listaParticipantes, setListaParticipantes] = useState<string>('');
  const [erro, setErro] = useState<string>('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');
    
    try {
      const nomes = listaParticipantes
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map(nome => nome.trim())
        .filter(nome => nome.length > 0);

      if (nomes.length < 2) {
        throw new Error('Por favor, insira pelo menos 2 participantes');
      }

      const nomesUnicos = new Set(nomes);
      if (nomesUnicos.size !== nomes.length) {
        throw new Error('Cada participante deve ter um nome único');
      }

      const participantes: Participante[] = nomes.map((nome, index) => ({
        id: `p${index + 1}`,
        nome
      }));

      await new Promise(resolve => setTimeout(resolve, 500));
      onSubmit(participantes);
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao processar participantes');
    } finally {
      setCarregando(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const textColado = e.clipboardData.getData('text');
    const valorAtual = listaParticipantes;
    
    const novoValor = valorAtual 
      ? valorAtual.trim() + '\n' + textColado 
      : textColado;
    
    setListaParticipantes(novoValor);
    setErro('');
  };

  const getQuantidadeParticipantes = () => {
    return listaParticipantes
      .split('\n')
      .map(linha => linha.trim())
      .filter(linha => linha.length > 0)
      .length;
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">
          Digite os {isEquipes ? 'Times' : 'Participantes'}
        </h2>
        
        <div className="mb-4 text-sm text-gray-600">
          <p className="font-medium mb-2">💡 Dicas:</p>
          <ul className="list-disc ml-5 space-y-2">
            <li>Cole uma lista de nomes diretamente</li>
            <li>Um nome por linha</li>
            <li>Linhas em branco são ignoradas</li>
            <li>Com número ímpar de participantes, um receberá passagem automática</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              className={classNames(
                "w-full h-48 p-3 border rounded-lg mb-1 font-mono text-sm transition-colors",
                "focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none",
                "resize-none placeholder-gray-400",
                {
                  'border-red-300 bg-red-50': erro,
                  'border-gray-300 hover:border-blue-300': !erro
                }
              )}
              value={listaParticipantes}
              onChange={(e) => {
                setListaParticipantes(e.target.value);
                setErro('');
              }}
              onPaste={handlePaste}
              placeholder={`Digite ou cole os nomes ${isEquipes ? 'dos times' : 'dos participantes'} aqui...\n\nExemplo:\n${
                isEquipes 
                  ? 'Time A\nTime B\nTime C' 
                  : 'João Silva\nMaria Santos\nPedro Costa'
              }`}
              disabled={carregando}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {getQuantidadeParticipantes()} participante(s)
            </div>
          </div>

          {erro && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center gap-2 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{erro}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={carregando}
              className={classNames(
                "flex-1 bg-blue-500 text-white py-2 px-4 rounded-md",
                "transition-all duration-200 flex items-center justify-center gap-2",
                {
                  'opacity-50 cursor-not-allowed': carregando,
                  'hover:bg-blue-600': !carregando
                }
              )}
            >
              {carregando ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Gerando...</span>
                </>
              ) : (
                'Gerar Chaveamento'
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setListaParticipantes('');
                setErro('');
              }}
              disabled={carregando}
              className={classNames(
                "px-4 py-2 text-gray-600 rounded-md",
                "transition-colors duration-200",
                {
                  'opacity-50 cursor-not-allowed': carregando,
                  'hover:bg-gray-100 hover:text-gray-800': !carregando
                }
              )}
            >
              Limpar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}