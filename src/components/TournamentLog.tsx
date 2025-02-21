import React from 'react';
import { LogAlteracao } from '../types';

interface Props {
  logs: LogAlteracao[];
  tema: 'light' | 'dark';
}

const HistoricoTorneio: React.FC<Props> = ({ logs, tema }) => {
  const formatarData = (data: string) => {
    return new Date(data).toLocaleString();
  };

  const getIconePorTipo = (tipo: LogAlteracao['tipo']) => {
    switch (tipo) {
      case 'criacao':
        return '🆕';
      case 'edicao':
        return '✏️';
      case 'remocao':
        return '🗑️';
      case 'placar':
        return '⚽';
      case 'vencedor':
        return '🏆';
      default:
        return '📝';
    }
  };

  return (
    <div className={`rounded-xl shadow-lg p-6 ${
      tema === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h3 className="text-xl font-semibold mb-4">Histórico de Alterações</h3>

      <div className="space-y-4">
        {logs.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nenhuma alteração registrada
          </p>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`p-4 rounded-lg border-l-4 ${
                tema === 'dark'
                  ? 'bg-gray-700 border-blue-500'
                  : 'bg-gray-50 border-blue-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl" role="img" aria-label="tipo">
                    {getIconePorTipo(log.tipo)}
                  </span>
                  <div>
                    <p className="font-medium">{log.descricao}</p>
                    <p className="text-sm text-gray-500">
                      {log.usuarioNome && `Por ${log.usuarioNome} • `}
                      {formatarData(log.data)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoricoTorneio;
