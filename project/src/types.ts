export interface Participante {
  id: number;
  nome: string;
  seed: number;
}

export interface Partida {
  id: string;
  rodada: number;
  participante1?: Participante;
  participante2?: Participante;
  placar1?: number;
  placar2?: number;
  vencedor?: Participante;
  byeAutomatico: boolean;
  partidaAnterior1?: string;
  partidaAnterior2?: string;
}
