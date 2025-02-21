# Contribuindo para o Gerador de Chaveamento de Torneio

Obrigado por considerar contribuir para o Gerador de Chaveamento! Este é um projeto focado em criar uma ferramenta intuitiva e eficiente para gerenciamento de torneios.

## 📝 Código de Conduta

- Seja respeitoso com outros contribuidores
- Mantenha discussões focadas no projeto
- Evite comentários discriminatórios
- Aceite críticas construtivas
- Ajude outros contribuidores quando possível

## 🐛 Reportando Bugs

Ao reportar bugs, inclua:

1. **Título Descritivo**
   Exemplo: "Placar não atualiza ao clicar em participante com bye"

2. **Descrição Detalhada**
   - **Passos para Reproduzir:**
     1. Crie um torneio com 3 participantes
     2. Gere o chaveamento
     3. Tente atualizar o placar do participante com bye
   - **Comportamento Esperado:** O placar deveria atualizar
   - **Comportamento Atual:** O placar permanece zerado

3. **Ambiente**
   - Navegador (ex: Chrome 120.0.6099.109)
   - Sistema Operacional (ex: Windows 11)
   - Dispositivo (Desktop/Mobile)
   - Resolução da Tela

4. **Screenshots ou Vídeos**
   Se possível, adicione imagens ou gravações do problema

## 💡 Sugerindo Melhorias

Para sugerir melhorias:

1. **Tipos de Sugestões Aceitas:**
   - Novas funcionalidades para o chaveamento
   - Melhorias na interface do usuário
   - Otimizações de performance
   - Novos formatos de torneio
   - Recursos de compartilhamento

2. **Formato da Sugestão:**
   ```markdown
   ## Título da Sugestão
   
   ### Descrição
   Explique detalhadamente sua sugestão
   
   ### Caso de Uso
   - Exemplo de como seria usado
   - Quem se beneficiaria
   
   ### Implementação Sugerida
   - Ideias técnicas iniciais
   - Possíveis desafios
   ```

## 🚀 Processo de Desenvolvimento

1. **Setup do Ambiente**
   ```bash
   # Clone o repositório
   git clone https://github.com/seu-usuario/gerador-chaveamento.git
   cd gerador-chaveamento
   
   # Instale as dependências
   npm install
   
   # Inicie o servidor de desenvolvimento
   npm run dev
   ```

2. **Branches**
   - `main` - Produção
   - `develop` - Desenvolvimento
   - `feature/*` - Novas funcionalidades
   - `fix/*` - Correções de bugs
   - `docs/*` - Documentação

3. **Commits**
   Use commits semânticos:
   ```bash
   feat: adiciona sistema de pontuação
   fix: corrige atualização do placar
   docs: atualiza documentação de API
   style: formata código
   refactor: otimiza lógica do chaveamento
   ```

## 🎨 Padrões de Código

1. **TypeScript**
   - Use tipos explícitos
   - Evite `any`
   - Documente interfaces complexas

2. **React**
   ```typescript
   // Componentes funcionais com tipos
   interface Props {
     partidas: Partida[];
     onAtualizarPartida: (partida: Partida) => void;
   }

   const Chaveamento: React.FC<Props> = ({ partidas, onAtualizarPartida }) => {
     // ...
   };
   ```

3. **Estilização**
   - Use classes Tailwind
   - Mantenha consistência com o design system
   - Siga o padrão de cores existente

4. **Estado**
   - Use hooks do React apropriadamente
   - Evite estado global desnecessário
   - Mantenha a lógica de estado próxima ao uso

## ✅ Testes

1. **Tipos de Testes**
   - Unitários para funções de chaveamento
   - Integração para fluxos completos
   - E2E para funcionalidades críticas

2. **Cobertura Mínima**
   - Funções de geração de chaveamento: 100%
   - Componentes principais: 80%
   - Utilitários: 90%

## 📱 PWA

Ao contribuir com funcionalidades PWA:

1. **Service Worker**
   - Mantenha cache atualizado
   - Gerencie offline fallbacks
   - Teste em diferentes dispositivos

2. **Manifesto**
   - Atualize ícones quando necessário
   - Mantenha metadata consistente

## 🔒 Segurança

1. **Validações**
   - Sanitize inputs de usuário
   - Valide dados do localStorage
   - Previna XSS em nomes de participantes

2. **Dados**
   - Não armazene dados sensíveis
   - Use HTTPS para compartilhamento
   - Limite tamanho dos dados salvos

## 📦 Deploy

1. **Vercel**
   - Verifique builds em PRs
   - Teste previews gerados
   - Confirme configurações de ambiente

2. **Performance**
   - Mantenha bundle size otimizado
   - Verifique Lighthouse scores
   - Otimize carregamento de assets

## ❓ Suporte

- **Issues:** Use para bugs e sugestões
- **Discussões:** Dúvidas e ideias
- **Email:** suporte@gerador-chaveamento.com
- **Discord:** [Link do servidor]

## 🎉 Processo de PR

1. **Antes do PR**
   - Testes passando
   - Código formatado
   - Documentação atualizada
   - Branch atualizada com main

2. **Descrição do PR**
   ```markdown
   ## Descrição
   Explique as mudanças

   ## Tipo de Mudança
   - [ ] Bug fix
   - [ ] Nova feature
   - [ ] Breaking change
   - [ ] Documentação

   ## Screenshots
   Se aplicável, adicione screenshots

   ## Checklist
   - [ ] Testes adicionados
   - [ ] Documentação atualizada
   - [ ] Build passa localmente
   ```

Agradecemos sua contribuição para tornar o Gerador de Chaveamento ainda melhor! 🏆 