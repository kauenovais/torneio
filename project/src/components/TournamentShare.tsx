import React from 'react';
import { Torneio } from '../types';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon
} from 'react-share';

interface Props {
  torneio: Torneio;
  tema: 'light' | 'dark';
}

const CompartilharTorneio: React.FC<Props> = ({ torneio, tema }) => {
  const url = torneio.linkPermanente;
  const titulo = `${torneio.nome} - Acompanhe o torneio ao vivo!`;
  const descricao = `Torneio ${torneio.tipo === 'individual' ? 'Individual' : 'em Equipes'} com ${torneio.participantes.length} participantes. Confira os resultados!`;

  return (
    <div className={`rounded-xl shadow-lg p-6 ${
      tema === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h3 className="text-xl font-semibold mb-4">Compartilhar Torneio</h3>

      <div className="space-y-6">
        {/* Link do Torneio */}
        <div>
          <label className="block text-sm font-medium mb-2">Link do Torneio</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={url}
              readOnly
              className={`flex-1 px-4 py-2 rounded-lg border ${
                tema === 'dark'
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-gray-50 border-gray-300'
              }`}
            />
            <button
              onClick={() => navigator.clipboard.writeText(url)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Copiar
            </button>
          </div>
        </div>

        {/* Redes Sociais */}
        <div>
          <h4 className="font-medium mb-4">Compartilhar nas Redes Sociais</h4>
          <div className="flex flex-wrap gap-4 justify-center">
            <FacebookShareButton url={url} quote={titulo}>
              <div className="flex flex-col items-center gap-2">
                <FacebookIcon size={48} round />
                <span className="text-sm">Facebook</span>
              </div>
            </FacebookShareButton>

            <TwitterShareButton url={url} title={titulo}>
              <div className="flex flex-col items-center gap-2">
                <TwitterIcon size={48} round />
                <span className="text-sm">Twitter</span>
              </div>
            </TwitterShareButton>

            <WhatsappShareButton url={url} title={titulo} separator=" - ">
              <div className="flex flex-col items-center gap-2">
                <WhatsappIcon size={48} round />
                <span className="text-sm">WhatsApp</span>
              </div>
            </WhatsappShareButton>

            <TelegramShareButton url={url} title={titulo}>
              <div className="flex flex-col items-center gap-2">
                <TelegramIcon size={48} round />
                <span className="text-sm">Telegram</span>
              </div>
            </TelegramShareButton>
          </div>
        </div>

        {/* Mensagem Personalizada */}
        <div>
          <h4 className="font-medium mb-2">Mensagem para Compartilhar</h4>
          <textarea
            value={`${titulo}\n\n${descricao}\n\nAcesse: ${url}`}
            readOnly
            rows={4}
            className={`w-full px-4 py-2 rounded-lg border ${
              tema === 'dark'
                ? 'bg-gray-700 border-gray-600'
                : 'bg-gray-50 border-gray-300'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default CompartilharTorneio;
