export interface Participante {
  id: string;
  nome: string;
}

export interface Partida {
  id: string;
  fase: number;
  posicao: number;
  participante1?: Participante;
  participante2?: Participante;
  pontuacao1?: number;
  pontuacao2?: number;
  vencedor?: Participante;
  proximaPartidaId?: string;
}