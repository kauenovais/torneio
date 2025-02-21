import { Partida, Participante } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function gerarChaveamento(participantes: Participante[]): Partida[] {
  const rodadas = Math.ceil(Math.log2(participantes.length));
  const totalParticipantes = Math.pow(2, rodadas);
  const partidas: Partida[] = [];

  // Primeira rodada
  const participantesComBye = [...participantes];
  while (participantesComBye.length < totalParticipantes) {
    participantesComBye.push(null as unknown as Participante);
  }

  // Cria as partidas da primeira rodada
  for (let i = 0; i < participantesComBye.length; i += 2) {
    const participante1 = participantesComBye[i] || null;
    const participante2 = participantesComBye[i + 1] || null;

    partidas.push({
      id: uuidv4(),
      rodada: 1,
      participante1,
      participante2,
      vencedor: participante1 && !participante2 ? participante1 : undefined,
      byeAutomatico: Boolean(participante1) && !participante2,
      placar1: undefined,
      placar2: undefined
    });
  }

  // Cria as partidas das rodadas seguintes
  let partidasRodadaAnterior = partidas.filter(p => p.rodada === 1);
  for (let rodada = 2; rodada <= rodadas; rodada++) {
    for (let i = 0; i < partidasRodadaAnterior.length; i += 2) {
      const partidaAnterior1 = partidasRodadaAnterior[i];
      const partidaAnterior2 = partidasRodadaAnterior[i + 1];

      const participante1 = partidaAnterior1?.vencedor || null;
      const participante2 = partidaAnterior2?.vencedor || null;

      partidas.push({
        id: uuidv4(),
        rodada,
        participante1,
        participante2,
        vencedor: participante1 && !participante2 ? participante1 : undefined,
        byeAutomatico: Boolean(participante1) && !participante2,
        placar1: undefined,
        placar2: undefined,
        partidaAnterior1: partidaAnterior1?.id,
        partidaAnterior2: partidaAnterior2?.id
      });
    }
    partidasRodadaAnterior = partidas.filter(p => p.rodada === rodada);
  }

  return partidas;
}

export function atualizarChaveamento(partidas: Partida[], partidaAtualizada: Partida): Partida[] {
  const partidasAtualizadas = partidas.map(partida => {
    if (partida.id === partidaAtualizada.id) {
      return partidaAtualizada;
    }

    if (partida.partidaAnterior1 === partidaAtualizada.id || partida.partidaAnterior2 === partidaAtualizada.id) {
      const partidaAnterior1 = partidas.find(p => p.id === partida.partidaAnterior1);
      const partidaAnterior2 = partidas.find(p => p.id === partida.partidaAnterior2);

      const participante1 = partidaAnterior1?.vencedor || null;
      const participante2 = partidaAnterior2?.vencedor || null;

      return {
        ...partida,
        participante1,
        participante2,
        vencedor: participante1 && !participante2 ? participante1 : undefined,
        byeAutomatico: Boolean(participante1) && !participante2,
        placar1: undefined,
        placar2: undefined
      };
    }

    return partida;
  });

  const algumaPropagacao = partidasAtualizadas.some((partida, index) => {
    const partidaOriginal = partidas[index];
    return JSON.stringify(partida) !== JSON.stringify(partidaOriginal);
  });

  if (algumaPropagacao) {
    return atualizarChaveamento(partidasAtualizadas, partidaAtualizada);
  }

  return partidasAtualizadas;
}
