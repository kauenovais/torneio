import { useState, useEffect } from 'react';
import EntradaParticipantes from './components/ParticipantInput';
import Chaveamento from './components/Bracket';
import { gerarChaveamento, atualizarChaveamento } from './utils/bracketGenerator';
import { Partida, Participante } from './types';
import './styles/animations.css';

function App() {
  const [isEquipes, setIsEquipes] = useState(false);
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [mostrarChaveamento, setMostrarChaveamento] = useState(false);
  const [tema, setTema] = useState<'light' | 'dark'>('light');
  const [torneioSalvo, setTorneioSalvo] = useState<boolean>(false);

  useEffect(() => {
    // Carregar tema do localStorage
    const temaLocal = localStorage.getItem('tema') as 'light' | 'dark';
    if (temaLocal) setTema(temaLocal);

    // Carregar torneio salvo
    const torneioSalvoLocal = localStorage.getItem('torneioAtual');
    if (torneioSalvoLocal) {
      const dados = JSON.parse(torneioSalvoLocal);
      setPartidas(dados.partidas);
      setIsEquipes(dados.isEquipes);
      setMostrarChaveamento(true);
      setTorneioSalvo(true);
    }
  }, []);

  const toggleTema = () => {
    const novoTema = tema === 'light' ? 'dark' : 'light';
    setTema(novoTema);
    localStorage.setItem('tema', novoTema);
  };

  const handleSubmitParticipantes = (participantes: Participante[]) => {
    const partidasGeradas = gerarChaveamento(participantes);
    setPartidas(partidasGeradas);
    setMostrarChaveamento(true);
    setTorneioSalvo(false);
  };

  const handleAtualizarPartida = (partidaAtualizada: Partida) => {
    const novasPartidas = atualizarChaveamento(partidas, partidaAtualizada);
    setPartidas(novasPartidas);
    
    // Salvar no localStorage
    localStorage.setItem('torneioAtual', JSON.stringify({
      partidas: novasPartidas,
      isEquipes
    }));
    setTorneioSalvo(true);
  };

  const handleNovoTorneio = () => {
    if (window.confirm('Tem certeza que deseja iniciar um novo torneio? O torneio atual será perdido.')) {
      localStorage.removeItem('torneioAtual');
      setMostrarChaveamento(false);
      setPartidas([]);
      setTorneioSalvo(false);
    }
  };

  const formatarChaveamentoParaTexto = () => {
    let texto = '🏆 CHAVEAMENTO DO TORNEIO 🏆\n\n';
    
    // Organiza as partidas por rodada
    const maxRodada = Math.max(...partidas.map(p => p.rodada));
    
    for (let rodada = 1; rodada <= maxRodada; rodada++) {
      const partidasRodada = partidas.filter(p => p.rodada === rodada);
      texto += `${rodada === maxRodada ? '🏁 FINAL' : `📍 ${rodada}ª RODADA`}\n`;
      texto += '━━━━━━━━━━━━━━━━━━━━━━\n';
      
      partidasRodada.forEach((partida, index) => {
        const p1Nome = partida.participante1?.nome || '?';
        const p2Nome = partida.participante2?.nome || '?';
        const placar1 = partida.placar1 !== undefined ? partida.placar1 : '-';
        const placar2 = partida.placar2 !== undefined ? partida.placar2 : '-';
        
        texto += `${index + 1}. ${p1Nome} ${placar1} x ${placar2} ${p2Nome}\n`;
        
        if (partida.vencedor) {
          texto += `   ✅ Vencedor: ${partida.vencedor.nome}\n`;
        } else if (partida.byeAutomatico) {
          texto += `   ⏩ Passagem Automática: ${p1Nome}\n`;
        }
        texto += '\n';
      });
      texto += '\n';
    }
    
    texto += `\n📱 Crie seu próprio chaveamento em: ${window.location.href}`;
    
    return texto;
  };

  const handleCompartilhar = async () => {
    const textoChaveamento = formatarChaveamentoParaTexto();

    // Tenta usar a API de Compartilhamento se disponível
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Chaveamento do Torneio',
          text: textoChaveamento
        });
        return;
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
      }
    }

    // Se a API de Compartilhamento não estiver disponível, copia para a área de transferência
    try {
      await navigator.clipboard.writeText(textoChaveamento);
      alert('Chaveamento copiado para a área de transferência!');
    } catch (err) {
      console.error('Erro ao copiar dados:', err);
      alert('Erro ao copiar o chaveamento.');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      tema === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-50'
    }`}>
      <div className="container mx-auto py-8 px-4">
        <header className="flex justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold ${
            tema === 'dark' ? 'text-white' : 'text-blue-900'
          }`}>
            Gerador de Chaveamento
          </h1>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTema}
              className={`p-2 rounded-lg transition-colors ${
                tema === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              {tema === 'dark' ? '🌞' : '🌙'}
            </button>

            {mostrarChaveamento && (
              <div className="flex gap-2">
                <button
                  onClick={handleNovoTorneio}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    tema === 'dark'
                      ? 'bg-gray-800 hover:bg-gray-700'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  Novo Torneio
                </button>
                <button
                  onClick={handleCompartilhar}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Compartilhar
                </button>
              </div>
            )}
          </div>
        </header>

        {!mostrarChaveamento ? (
          <div className="max-w-md mx-auto animate-fade-in">
            <div className="mb-6 flex justify-center">
              <label className={`inline-flex items-center gap-3 px-4 py-2 rounded-lg shadow-sm border ${
                tema === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <input
                  type="checkbox"
                  checked={isEquipes}
                  onChange={(e) => setIsEquipes(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded"
                />
                <span className={tema === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
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
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setMostrarChaveamento(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  tema === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Voltar
              </button>
              <div className={tema === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                {isEquipes ? 'Torneio em Equipes' : 'Torneio Individual'}
                {torneioSalvo && ' • Salvo'}
              </div>
            </div>
            <div className={`rounded-xl shadow-lg p-6 overflow-x-auto ${
              tema === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
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