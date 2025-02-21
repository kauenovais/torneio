export interface Participante {
  id: number;
  nome: string;
  seed: number;
  pontos?: number;
  vitorias?: number;
  derrotas?: number;
}

export interface Partida {
  id: string;
  rodada: number;
  participante1: Participante | null;
  participante2: Participante | null;
  placar1?: number;
  placar2?: number;
  vencedor?: Participante;
  byeAutomatico: boolean;
  partidaAnterior1?: string;
  partidaAnterior2?: string;
  dataHora?: string;
  local?: string;
  observacoes?: string;
}

export interface ConfiguracaoTorneio {
  corPrimaria: string;
  corSecundaria: string;
  logo?: string;
  formatoChaveamento: 'simples' | 'duplo' | 'grupos';
  permitirEmpate: boolean;
  pontosPorVitoria: number;
  pontosPorEmpate: number;
  tempoLimitePorPartida?: number;
}

export interface Estatisticas {
  totalParticipantes: number;
  totalPartidas: number;
  totalFinalizadas: number;
  mediaGolsPorPartida?: number;
  participanteMaisVitorias?: Participante;
  participanteMaisPontos?: Participante;
  maiorPlacar?: {
    partida: Partida;
    placarTotal: number;
  };
}

export interface LogAlteracao {
  id: string;
  data: string;
  tipo: 'criacao' | 'edicao' | 'remocao' | 'placar' | 'vencedor';
  usuarioId?: string;
  usuarioNome?: string;
  descricao: string;
  partidaId?: string;
  participanteId?: number;
}

export interface Administrador {
  id: string;
  nome: string;
  email: string;
  permissoes: ('editar' | 'excluir' | 'gerenciar_usuarios' | 'definir_placares')[];
}

export interface Torneio {
  id: string;
  nome: string;
  data: string;
  tipo: 'individual' | 'equipe';
  partidas: Partida[];
  participantes: Participante[];
  criadorId?: string;
  criadorNome?: string;
  configuracao: ConfiguracaoTorneio;
  estatisticas: Estatisticas;
  logAlteracoes: LogAlteracao[];
  administradores: Administrador[];
  status: 'criado' | 'em_andamento' | 'finalizado';
  dataCriacao: string;
  dataAtualizacao: string;
  linkPermanente: string;
  qrCode?: string;
}
