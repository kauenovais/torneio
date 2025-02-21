import React, { useRef, useState } from 'react';
import { Torneio } from '../types';
import QRCode from 'qrcode.react';

interface Props {
  torneio: Torneio;
  onImportar: (torneio: Torneio) => void;
  tema: 'light' | 'dark';
}

const ExportarImportar: React.FC<Props> = ({ torneio, onImportar, tema }) => {
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportar = () => {
    const dataStr = JSON.stringify(torneio, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `torneio-${torneio.nome.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const conteudo = event.target?.result as string;
        const torneioImportado = JSON.parse(conteudo) as Torneio;

        // Validação básica
        if (!torneioImportado.id || !torneioImportado.nome || !torneioImportado.partidas) {
          throw new Error('Arquivo de torneio inválido');
        }

        onImportar(torneioImportado);
        setError('');
      } catch (err) {
        setError('Erro ao importar torneio. Verifique se o arquivo está correto.');
      }
    };
    reader.readAsText(file);
  };

  const handleBackup = () => {
    const backupKey = `torneio_backup_${new Date().toISOString()}`;
    localStorage.setItem(backupKey, JSON.stringify(torneio));
    alert('Backup criado com sucesso!');
  };

  return (
    <div className={`rounded-xl shadow-lg p-6 ${
      tema === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h3 className="text-xl font-semibold mb-4">Exportar / Importar</h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Exportar e Backup */}
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Exportar Torneio</h4>
            <button
              onClick={handleExportar}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Baixar JSON
            </button>
          </div>

          <div>
            <h4 className="font-medium mb-2">Backup Local</h4>
            <button
              onClick={handleBackup}
              className={`w-full px-4 py-2 rounded-lg transition-colors ${
                tema === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Criar Backup
            </button>
          </div>
        </div>

        {/* Importar e QR Code */}
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Importar Torneio</h4>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportar}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`w-full px-4 py-2 rounded-lg transition-colors ${
                tema === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Selecionar Arquivo
            </button>
            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>

          <div>
            <h4 className="font-medium mb-2">QR Code</h4>
            <div className={`p-4 rounded-lg ${
              tema === 'dark' ? 'bg-white' : 'bg-gray-100'
            }`}>
              <QRCode
                value={torneio.linkPermanente}
                size={128}
                level="H"
                includeMargin
                className="mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportarImportar;
