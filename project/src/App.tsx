import { useState } from 'react';
import EntradaParticipantes from './components/ParticipantInput';
import Chaveamento from './components/Bracket';
import { gerarChaveamento, atualizarChaveamento } from './utils/bracketGenerator';
import { Partida, Participante } from './types';

function App() {
  const [isEquipes, setIsEquipes] = useState(false);
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [mostrarChaveamento, setMostrarChaveamento] = useState(false);

  const handleSubmitParticipantes = (participantes: Participante[]) => {
    const partidasGeradas = gerarChaveamento(participantes);
    setPartidas(partidasGeradas);
    setMostrarChaveamento(true);
  };

  const handleAtualizarPartida = (partidaAtualizada: Partida) => {
    const novasPartidas = atualizarChaveamento(partidas, partidaAtualizada);
    setPartidas(novasPartidas);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-center mb-2 text-blue-900">
          Gerador de Chaveamento de Torneio
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Crie e gerencie seus chaveamentos de torneio facilmente
        </p>
        
        {!mostrarChaveamento ? (
          <div className="max-w-md mx-auto">
            <div className="mb-6 flex justify-center">
              <label className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border">
                <input
                  type="checkbox"
                  checked={isEquipes}
                  onChange={(e) => setIsEquipes(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded"
                />
                <span className="text-gray-700 font-medium">
                  {isEquipes ? 'Torneio em Equipes' : 'Torneio Individual'}
                </span>
              </label>
            </div>
            <EntradaParticipantes
              onSubmit={handleSubmitParticipantes}
              isEquipes={isEquipes}
            />
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setMostrarChaveamento(false)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors border"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Voltar para Entrada
              </button>
              <div className="text-gray-600">
                {isEquipes ? 'Torneio em Equipes' : 'Torneio Individual'}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
              <Chaveamento
                partidas={partidas}
                onAtualizarPartida={handleAtualizarPartida}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;