export interface Participante {
  id: number;
  nome: string;
  seed: number;
}

export interface Partida {
  id: string;
  rodada: number;
  participante1: Participante | null;
  participante2: Participante | null;
  placar1?: number;
  placar2?: number;
  vencedor: Participante | null;
  byeAutomatico: boolean;
  partidaAnterior1?: string;
  partidaAnterior2?: string;
}
