export interface Participante {
  id: number;
  nome: string;
  seed: number;
}

export interface Partida {
  id: string;
  rodada: number;
  posicao: number;
  participante1?: Participante;
  participante2?: Participante;
  placar1?: number;
  placar2?: number;
  vencedor?: Participante;
  proximaPartidaId?: string;
  byeAutomatico?: boolean; // Indica se é uma passagem automática
}