import React, { useState } from 'react';
import { ConfiguracaoTorneio } from '../types';

interface Props {
  onSave: (config: ConfiguracaoTorneio) => void;
  configInicial?: ConfiguracaoTorneio;
  tema: 'light' | 'dark';
}

const configPadrao: ConfiguracaoTorneio = {
  corPrimaria: '#3B82F6',
  corSecundaria: '#1D4ED8',
  formatoChaveamento: 'simples',
  permitirEmpate: false,
  pontosPorVitoria: 3,
  pontosPorEmpate: 1
};

const ConfiguracaoTorneio: React.FC<Props> = ({ onSave, configInicial, tema }) => {
  const [config, setConfig] = useState<ConfiguracaoTorneio>(configInicial || configPadrao);
  const [logoPreview, setLogoPreview] = useState<string | undefined>(config.logo);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setLogoPreview(base64);
        setConfig({ ...config, logo: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(config);
  };

  return (
    <div className={`rounded-xl shadow-lg p-6 ${
      tema === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h3 className="text-xl font-semibold mb-4">Configurações do Torneio</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Cores */}
          <div>
            <label className="block text-sm font-medium mb-1">Cor Primária</label>
            <input
              type="color"
              value={config.corPrimaria}
              onChange={(e) => setConfig({ ...config, corPrimaria: e.target.value })}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cor Secundária</label>
            <input
              type="color"
              value={config.corSecundaria}
              onChange={(e) => setConfig({ ...config, corSecundaria: e.target.value })}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>

          {/* Logo */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Logo do Torneio</label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  tema === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Escolher Arquivo
              </label>
              {logoPreview && (
                <img src={logoPreview} alt="Logo Preview" className="h-10 w-10 object-contain" />
              )}
            </div>
          </div>

          {/* Formato do Chaveamento */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Formato do Chaveamento</label>
            <select
              value={config.formatoChaveamento}
              onChange={(e) => setConfig({ ...config, formatoChaveamento: e.target.value as 'simples' | 'duplo' | 'grupos' })}
              className={`w-full px-4 py-2 rounded-lg border ${
                tema === 'dark'
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="simples">Eliminação Simples</option>
              <option value="duplo">Eliminação Dupla</option>
              <option value="grupos">Fase de Grupos + Eliminatórias</option>
            </select>
          </div>

          {/* Regras */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Regras</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.permitirEmpate}
                  onChange={(e) => setConfig({ ...config, permitirEmpate: e.target.checked })}
                  className="rounded"
                />
                <span>Permitir Empates</span>
              </label>
            </div>
          </div>

          {/* Pontuação */}
          <div>
            <label className="block text-sm font-medium mb-1">Pontos por Vitória</label>
            <input
              type="number"
              value={config.pontosPorVitoria}
              onChange={(e) => setConfig({ ...config, pontosPorVitoria: Number(e.target.value) })}
              min="1"
              className={`w-full px-4 py-2 rounded-lg border ${
                tema === 'dark'
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Pontos por Empate</label>
            <input
              type="number"
              value={config.pontosPorEmpate}
              onChange={(e) => setConfig({ ...config, pontosPorEmpate: Number(e.target.value) })}
              min="0"
              className={`w-full px-4 py-2 rounded-lg border ${
                tema === 'dark'
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>

          {/* Tempo Limite */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Tempo Limite por Partida (minutos)</label>
            <input
              type="number"
              value={config.tempoLimitePorPartida || ''}
              onChange={(e) => setConfig({ ...config, tempoLimitePorPartida: Number(e.target.value) || undefined })}
              min="0"
              placeholder="Sem limite"
              className={`w-full px-4 py-2 rounded-lg border ${
                tema === 'dark'
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Salvar Configurações
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfiguracaoTorneio;
