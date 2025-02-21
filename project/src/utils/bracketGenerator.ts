import { Partida, Participante } from '../types';

export function gerarChaveamento(participantes: Participante[]): Partida[] {
  const partidas: Partida[] = [];
  const totalParticipantes = participantes.length;
  
  // Calcula o número de fases necessárias
  const fases = Math.ceil(Math.log2(Math.max(totalParticipantes, 2)));
  const tamanhoChaveamentoPerfeiro = Math.pow(2, fases);
  
  // Organiza os participantes em pares, com byes no final
  const participantesEmbaralhados = [...participantes].sort(() => Math.random() - 0.5);
  const partidasPrimeiraFase: Partida[] = [];
  
  // Cria partidas da primeira fase
  for (let i = 0; i < tamanhoChaveamentoPerfeiro; i += 2) {
    const partida: Partida = {
      id: `p${partidas.length + partidasPrimeiraFase.length + 1}`,
      fase: 1,
      posicao: i / 2,
      participante1: participantesEmbaralhados[i] || undefined,
      participante2: participantesEmbaralhados[i + 1] || undefined
    };
    
    // Trata byes na primeira fase apenas
    if (partida.participante1 && !partida.participante2 && partida.fase === 1) {
      partida.vencedor = partida.participante1;
      partida.pontuacao1 = 1;
      partida.pontuacao2 = 0;
    }
    
    partidasPrimeiraFase.push(partida);
  }
  
  partidas.push(...partidasPrimeiraFase);
  
  // Cria fases subsequentes
  let partidasFaseAnterior = partidasPrimeiraFase;
  for (let fase = 2; fase <= fases; fase++) {
    const partidasFaseAtual: Partida[] = [];
    const partidasPorFase = Math.pow(2, fases - fase);
    
    for (let i = 0; i < partidasPorFase; i++) {
      const partida: Partida = {
        id: `p${partidas.length + partidasFaseAtual.length + 1}`,
        fase,
        posicao: i,
        participante1: undefined,
        participante2: undefined
      };
      
      // Liga as partidas da fase anterior a esta partida
      const partidaAnterior1 = partidasFaseAnterior[i * 2];
      const partidaAnterior2 = partidasFaseAnterior[i * 2 + 1];
      
      if (partidaAnterior1) {
        partidaAnterior1.proximaPartidaId = partida.id;
        if (partidaAnterior1.vencedor) {
          partida.participante1 = partidaAnterior1.vencedor;
        }
      }
      
      if (partidaAnterior2) {
        partidaAnterior2.proximaPartidaId = partida.id;
        if (partidaAnterior2.vencedor) {
          partida.participante2 = partidaAnterior2.vencedor;
        }
      }
      
      partidasFaseAtual.push(partida);
    }
    
    partidas.push(...partidasFaseAtual);
    partidasFaseAnterior = partidasFaseAtual;
  }
  
  return partidas;
}

export function atualizarChaveamento(partidas: Partida[], partidaAtualizada: Partida): Partida[] {
  const novasPartidas = [...partidas];
  const indicePartida = novasPartidas.findIndex(p => p.id === partidaAtualizada.id);
  
  if (indicePartida === -1) return partidas;
  
  // Determina o vencedor baseado nas pontuações
  let vencedor: Participante | undefined;
  
  // Se há apenas um participante, ele precisa pontuar para avançar
  if (partidaAtualizada.participante1 && !partidaAtualizada.participante2) {
    if (partidaAtualizada.pontuacao1 !== undefined && partidaAtualizada.pontuacao1 > 0) {
      vencedor = partidaAtualizada.participante1;
    }
  } 
  // Se há dois participantes, maior pontuação vence
  else if (partidaAtualizada.pontuacao1 !== undefined && partidaAtualizada.pontuacao2 !== undefined) {
    if (partidaAtualizada.pontuacao1 > partidaAtualizada.pontuacao2) {
      vencedor = partidaAtualizada.participante1;
    } else if (partidaAtualizada.pontuacao2 > partidaAtualizada.pontuacao1) {
      vencedor = partidaAtualizada.participante2;
    }
  }
  
  // Atualiza a partida atual
  novasPartidas[indicePartida] = {
    ...partidaAtualizada,
    vencedor
  };
  
  // Se o vencedor mudou, atualiza as partidas subsequentes
  if (vencedor && partidaAtualizada.proximaPartidaId) {
    const proximaPartida = novasPartidas.find(p => p.id === partidaAtualizada.proximaPartidaId);
    if (proximaPartida) {
      const isPosicaoPar = partidaAtualizada.posicao % 2 === 0;
      const proximaPartidaAtualizada = {
        ...proximaPartida,
        participante1: isPosicaoPar ? vencedor : proximaPartida.participante1,
        participante2: !isPosicaoPar ? vencedor : proximaPartida.participante2,
        pontuacao1: undefined,
        pontuacao2: undefined,
        vencedor: undefined
      };
      
      const indiceProximaPartida = novasPartidas.findIndex(p => p.id === partidaAtualizada.proximaPartidaId);
      novasPartidas[indiceProximaPartida] = proximaPartidaAtualizada;
    }
  }
  
  return novasPartidas;
}