import { useState, useEffect } from 'react';
import EntradaParticipantes from './components/ParticipantInput';
import Chaveamento from './components/Bracket';
import ConfiguracaoTorneio from './components/TournamentConfig';
import EstatisticasTorneio from './components/TournamentStats';
import HistoricoTorneio from './components/TournamentLog';
import GerenciarAdministradores from './components/TournamentAdmins';
import ExportarImportar from './components/TournamentExport';
import CompartilharTorneio from './components/TournamentShare';
import GraficosTorneio from './components/TournamentCharts';
import { gerarChaveamento, atualizarChaveamento } from './utils/bracketGenerator';
import {
  Partida,
  Participante,
  Torneio,
  ConfiguracaoTorneio as IConfiguracaoTorneio,
  Administrador,
  LogAlteracao,
} from './types';
import { v4 as uuidv4 } from 'uuid';
import './styles/animations.css';

// URL base da aplicação
const BASE_URL =
  typeof window !== 'undefined' ? window.location.origin : 'https://seu-dominio.vercel.app';

// Configuração padrão do torneio
const configPadrao: IConfiguracaoTorneio = {
  corPrimaria: '#3B82F6',
  corSecundaria: '#1D4ED8',
  formatoChaveamento: 'simples',
  permitirEmpate: false,
  pontosPorVitoria: 3,
  pontosPorEmpate: 1,
};

function App() {
  const [isEquipes, setIsEquipes] = useState<boolean | null>(null);
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [mostrarChaveamento, setMostrarChaveamento] = useState(false);
  const [tema, setTema] = useState<'light' | 'dark'>('light');
  const [torneioSalvo, setTorneioSalvo] = useState<boolean>(false);
  const [torneio, setTorneio] = useState<Torneio | null>(null);
  const [nomeTorneio, setNomeTorneio] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [configuracao, setConfiguracao] = useState<IConfiguracaoTorneio>(configPadrao);
  const [administradores, setAdministradores] = useState<Administrador[]>([]);
  const [logAlteracoes, setLogAlteracoes] = useState<LogAlteracao[]>([]);
  const [abaAtiva, setAbaAtiva] = useState<
    'chaveamento' | 'config' | 'stats' | 'admins' | 'export' | 'share'
  >('chaveamento');

  useEffect(() => {
    // Carregar tema do localStorage
    const temaLocal = localStorage.getItem('tema') as 'light' | 'dark';
    if (temaLocal) setTema(temaLocal);

    // Carregar torneio salvo
    const torneioSalvoLocal = localStorage.getItem('torneioAtual');
    if (torneioSalvoLocal) {
      const dados = JSON.parse(torneioSalvoLocal);
      setTorneio(dados);
      setPartidas(dados.partidas);
      setIsEquipes(dados.tipo === 'equipe');
      setNomeTorneio(dados.nome);
      setConfiguracao(dados.configuracao || configPadrao);
      setAdministradores(dados.administradores || []);
      setLogAlteracoes(dados.logAlteracoes || []);
      setMostrarChaveamento(true);
      setTorneioSalvo(true);
    }
  }, []);

  const toggleTema = () => {
    const novoTema = tema === 'light' ? 'dark' : 'light';
    setTema(novoTema);
    localStorage.setItem('tema', novoTema);
  };

  const registrarAlteracao = (
    tipo: LogAlteracao['tipo'],
    descricao: string,
    dados?: { partidaId?: string; participanteId?: number }
  ) => {
    const novaAlteracao: LogAlteracao = {
      id: uuidv4(),
      data: new Date().toISOString(),
      tipo,
      descricao,
      ...dados,
    };
    setLogAlteracoes(prev => [novaAlteracao, ...prev]);
  };

  const handleSubmitParticipantes = (participantes: Participante[]) => {
    if (!nomeTorneio.trim()) {
      setError('Por favor, insira o nome do torneio');
      return;
    }

    const partidasGeradas = gerarChaveamento(participantes);
    const novoTorneio: Torneio = {
      id: uuidv4(),
      nome: nomeTorneio.trim(),
      data: new Date().toISOString(),
      tipo: isEquipes ? 'equipe' : 'individual',
      partidas: partidasGeradas,
      participantes,
      configuracao,
      estatisticas: {
        totalParticipantes: participantes.length,
        totalPartidas: partidasGeradas.length,
        totalFinalizadas: 0,
      },
      logAlteracoes: [],
      administradores: [],
      status: 'criado',
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
      linkPermanente: `${BASE_URL}/torneio/${uuidv4()}`,
    };

    setTorneio(novoTorneio);
    setPartidas(partidasGeradas);
    setMostrarChaveamento(true);
    setTorneioSalvo(false);
    setError('');

    registrarAlteracao(
      'criacao',
      `Torneio "${nomeTorneio}" criado com ${participantes.length} participantes`
    );
  };

  const handleAtualizarPartida = (partidaAtualizada: Partida) => {
    const novasPartidas = atualizarChaveamento(partidas, partidaAtualizada);

    if (torneio) {
      // Atualiza estatísticas
      const estatisticasAtualizadas = {
        ...torneio.estatisticas,
        totalFinalizadas: novasPartidas.filter(p => p.vencedor).length,
        mediaGolsPorPartida: calcularMediaGols(novasPartidas),
        participanteMaisVitorias: encontrarParticipanteMaisVitorias(novasPartidas),
        participanteMaisPontos: encontrarParticipanteMaisPontos(novasPartidas),
        maiorPlacar: encontrarMaiorPlacar(novasPartidas),
      };

      const torneioAtualizado = {
        ...torneio,
        partidas: novasPartidas,
        estatisticas: estatisticasAtualizadas,
        dataAtualizacao: new Date().toISOString(),
        status: verificarStatusTorneio(novasPartidas),
      };

      setTorneio(torneioAtualizado);
      setPartidas(novasPartidas);
      localStorage.setItem('torneioAtual', JSON.stringify(torneioAtualizado));
      setTorneioSalvo(true);

      // Registra a alteração
      if (partidaAtualizada.vencedor) {
        registrarAlteracao(
          'vencedor',
          `${partidaAtualizada.vencedor.nome} venceu a partida ${partidaAtualizada.placar1} x ${partidaAtualizada.placar2}`,
          { partidaId: partidaAtualizada.id }
        );
      } else if (
        partidaAtualizada.placar1 !== undefined ||
        partidaAtualizada.placar2 !== undefined
      ) {
        registrarAlteracao(
          'placar',
          `Placar atualizado: ${partidaAtualizada.placar1} x ${partidaAtualizada.placar2}`,
          { partidaId: partidaAtualizada.id }
        );
      }
    }
  };

  const handleNovoTorneio = () => {
    if (
      window.confirm(
        'Tem certeza que deseja iniciar um novo torneio? O torneio atual será perdido.'
      )
    ) {
      localStorage.removeItem('torneioAtual');
      setMostrarChaveamento(false);
      setPartidas([]);
      setTorneio(null);
      setNomeTorneio('');
      setTorneioSalvo(false);
      setIsEquipes(null);
      setError('');
      setConfiguracao(configPadrao);
      setAdministradores([]);
      setLogAlteracoes([]);
      setAbaAtiva('chaveamento');
    }
  };

  const handleSalvarConfiguracao = (novaConfig: IConfiguracaoTorneio) => {
    setConfiguracao(novaConfig);
    if (torneio) {
      const torneioAtualizado = {
        ...torneio,
        configuracao: novaConfig,
        dataAtualizacao: new Date().toISOString(),
      };
      setTorneio(torneioAtualizado);
      localStorage.setItem('torneioAtual', JSON.stringify(torneioAtualizado));
      registrarAlteracao('edicao', 'Configurações do torneio atualizadas');
    }
  };

  const handleAdicionarAdmin = (admin: Omit<Administrador, 'id'>) => {
    const novoAdmin: Administrador = {
      ...admin,
      id: uuidv4(),
    };
    setAdministradores(prev => [...prev, novoAdmin]);
    if (torneio) {
      const torneioAtualizado = {
        ...torneio,
        administradores: [...administradores, novoAdmin],
        dataAtualizacao: new Date().toISOString(),
      };
      setTorneio(torneioAtualizado);
      localStorage.setItem('torneioAtual', JSON.stringify(torneioAtualizado));
      registrarAlteracao('edicao', `Administrador ${admin.nome} adicionado`);
    }
  };

  const handleRemoverAdmin = (id: string) => {
    setAdministradores(prev => prev.filter(a => a.id !== id));
    if (torneio) {
      const adminRemovido = administradores.find(a => a.id === id);
      const torneioAtualizado = {
        ...torneio,
        administradores: administradores.filter(a => a.id !== id),
        dataAtualizacao: new Date().toISOString(),
      };
      setTorneio(torneioAtualizado);
      localStorage.setItem('torneioAtual', JSON.stringify(torneioAtualizado));
      if (adminRemovido) {
        registrarAlteracao('remocao', `Administrador ${adminRemovido.nome} removido`);
      }
    }
  };

  const handleAtualizarPermissoes = (id: string, permissoes: Administrador['permissoes']) => {
    setAdministradores(prev => prev.map(a => (a.id === id ? { ...a, permissoes } : a)));
    if (torneio) {
      const adminAtualizado = administradores.find(a => a.id === id);
      const torneioAtualizado = {
        ...torneio,
        administradores: administradores.map(a => (a.id === id ? { ...a, permissoes } : a)),
        dataAtualizacao: new Date().toISOString(),
      };
      setTorneio(torneioAtualizado);
      localStorage.setItem('torneioAtual', JSON.stringify(torneioAtualizado));
      if (adminAtualizado) {
        registrarAlteracao(
          'edicao',
          `Permissões do administrador ${adminAtualizado.nome} atualizadas`
        );
      }
    }
  };

  const handleImportarTorneio = (torneioImportado: Torneio) => {
    setTorneio(torneioImportado);
    setPartidas(torneioImportado.partidas);
    setIsEquipes(torneioImportado.tipo === 'equipe');
    setNomeTorneio(torneioImportado.nome);
    setConfiguracao(torneioImportado.configuracao);
    setAdministradores(torneioImportado.administradores);
    setLogAlteracoes(torneioImportado.logAlteracoes);
    setMostrarChaveamento(true);
    setTorneioSalvo(true);
    localStorage.setItem('torneioAtual', JSON.stringify(torneioImportado));
    registrarAlteracao('edicao', 'Torneio importado com sucesso');
  };

  // Funções auxiliares para estatísticas
  const calcularMediaGols = (partidas: Partida[]): number => {
    const partidasComPlacar = partidas.filter(
      p => p.placar1 !== undefined && p.placar2 !== undefined
    );
    if (partidasComPlacar.length === 0) return 0;

    const totalGols = partidasComPlacar.reduce(
      (sum, p) => sum + (p.placar1 || 0) + (p.placar2 || 0),
      0
    );
    return totalGols / partidasComPlacar.length;
  };

  const encontrarParticipanteMaisVitorias = (partidas: Partida[]): Participante | undefined => {
    const vitoriasPorParticipante = new Map<number, number>();

    partidas.forEach(p => {
      if (p.vencedor) {
        const vitorias = vitoriasPorParticipante.get(p.vencedor.id) || 0;
        vitoriasPorParticipante.set(p.vencedor.id, vitorias + 1);
      }
    });

    if (vitoriasPorParticipante.size === 0) return undefined;

    const [idMaisVitorias] = [...vitoriasPorParticipante.entries()].reduce((max, [id, vitorias]) =>
      vitorias > max[1] ? [id, vitorias] : max
    );

    return torneio?.participantes.find(p => p.id === idMaisVitorias);
  };

  const encontrarParticipanteMaisPontos = (partidas: Partida[]): Participante | undefined => {
    const pontosPorParticipante = new Map<number, number>();

    partidas.forEach(p => {
      if (p.vencedor) {
        const pontos = pontosPorParticipante.get(p.vencedor.id) || 0;
        pontosPorParticipante.set(p.vencedor.id, pontos + configuracao.pontosPorVitoria);
      } else if (p.placar1 === p.placar2 && configuracao.permitirEmpate) {
        [p.participante1, p.participante2].forEach(participante => {
          if (participante) {
            const pontos = pontosPorParticipante.get(participante.id) || 0;
            pontosPorParticipante.set(participante.id, pontos + configuracao.pontosPorEmpate);
          }
        });
      }
    });

    if (pontosPorParticipante.size === 0) return undefined;

    const [idMaisPontos] = [...pontosPorParticipante.entries()].reduce((max, [id, pontos]) =>
      pontos > max[1] ? [id, pontos] : max
    );

    return torneio?.participantes.find(p => p.id === idMaisPontos);
  };

  const encontrarMaiorPlacar = (partidas: Partida[]) => {
    const partidasComPlacar = partidas.filter(
      p => p.placar1 !== undefined && p.placar2 !== undefined
    );

    if (partidasComPlacar.length === 0) return undefined;

    return partidasComPlacar.reduce((max, partida) => {
      const placarTotal = (partida.placar1 || 0) + (partida.placar2 || 0);
      const maxPlacarTotal = max?.placarTotal || 0;
      return placarTotal > maxPlacarTotal ? { partida, placarTotal } : max;
    }, undefined as { partida: Partida; placarTotal: number } | undefined);
  };

  const verificarStatusTorneio = (partidas: Partida[]): Torneio['status'] => {
    if (partidas.every(p => p.vencedor)) return 'finalizado';
    if (partidas.some(p => p.vencedor)) return 'em_andamento';
    return 'criado';
  };

  const formatarChaveamentoParaTexto = () => {
    if (!torneio) return '';

    let texto = `🏆 ${torneio.nome.toUpperCase()} 🏆\n\n`;
    texto += `📅 Data: ${new Date(torneio.data).toLocaleDateString()}\n`;
    texto += `👥 Tipo: ${
      torneio.tipo === 'individual' ? 'Torneio Individual' : 'Torneio em Equipes'
    }\n\n`;

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

    texto += `\n📱 Acompanhe este torneio em: ${BASE_URL}`;

    return texto;
  };

  const handleCompartilhar = async () => {
    const textoChaveamento = formatarChaveamentoParaTexto();

    // Tenta usar a API de Compartilhamento se disponível
    if (navigator.share) {
      try {
        await navigator.share({
          title: torneio?.nome || 'Chaveamento do Torneio',
          text: textoChaveamento,
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

  const renderSelecaoTipoTorneio = () => (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h2
        className={`text-2xl font-bold mb-8 text-center ${
          tema === 'dark' ? 'text-white' : 'text-gray-800'
        }`}
      >
        Selecione o Tipo de Torneio
      </h2>
      <div className="grid md:grid-cols-2 gap-6 px-4">
        <button
          onClick={() => setIsEquipes(false)}
          className={`
            p-8 rounded-xl shadow-lg transition-all duration-300
            flex flex-col items-center justify-center gap-4
            hover:transform hover:scale-105
            ${tema === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-blue-50'}
          `}
        >
          <div className="text-5xl">👤</div>
          <h3
            className={`text-xl font-semibold ${tema === 'dark' ? 'text-white' : 'text-gray-800'}`}
          >
            Torneio Individual
          </h3>
          <p className={`text-center ${tema === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Para competições entre jogadores individuais
          </p>
        </button>

        <button
          onClick={() => setIsEquipes(true)}
          className={`
            p-8 rounded-xl shadow-lg transition-all duration-300
            flex flex-col items-center justify-center gap-4
            hover:transform hover:scale-105
            ${tema === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-blue-50'}
          `}
        >
          <div className="text-5xl">👥</div>
          <h3
            className={`text-xl font-semibold ${tema === 'dark' ? 'text-white' : 'text-gray-800'}`}
          >
            Torneio em Equipes
          </h3>
          <p className={`text-center ${tema === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Para competições entre times ou equipes
          </p>
        </button>
      </div>
    </div>
  );

  const renderNomeTorneio = () => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Nome do Torneio
      </label>
      <input
        type="text"
        value={nomeTorneio}
        onChange={e => {
          setNomeTorneio(e.target.value);
          setError('');
        }}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
          tema === 'dark'
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
        }`}
        placeholder="Digite o nome do torneio"
      />
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        tema === 'dark' ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-50'
      }`}
    >
      <div className="container mx-auto py-8 px-4">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="w-full sm:w-auto text-center sm:text-left">
            <h1
              className={`text-4xl font-bold ${tema === 'dark' ? 'text-white' : 'text-blue-900'}`}
            >
              {torneio?.nome || 'Gerador de Chaveamento'}
            </h1>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-4 w-full sm:w-auto">
            <button
              onClick={toggleTema}
              className={`p-2 rounded-lg transition-colors ${
                tema === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
              }`}
            >
              {tema === 'dark' ? '🌞' : '🌙'}
            </button>

            {mostrarChaveamento && (
              <div className="flex gap-2">
                <button
                  onClick={handleNovoTorneio}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    tema === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
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
          isEquipes === null ? (
            renderSelecaoTipoTorneio()
          ) : (
            <div className="max-w-md mx-auto animate-fade-in">
              <div className="mb-6 flex justify-center">
                <button
                  onClick={() => setIsEquipes(null)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    tema === 'dark'
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      : 'bg-white hover:bg-gray-50 text-gray-700'
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
                      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Voltar para Seleção
                </button>
              </div>
              {renderNomeTorneio()}
              <EntradaParticipantes onSubmit={handleSubmitParticipantes} isEquipes={isEquipes} />
            </div>
          )
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Voltar
              </button>
              <div className={tema === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                {isEquipes ? 'Torneio em Equipes' : 'Torneio Individual'}
                {torneioSalvo && ' • Salvo'}
              </div>
            </div>
            <div
              className={`rounded-xl shadow-lg p-6 overflow-x-auto ${
                tema === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <Chaveamento partidas={partidas} onAtualizarPartida={handleAtualizarPartida} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
