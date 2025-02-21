import React, { useState } from 'react';
import { Administrador } from '../types';

interface Props {
  administradores: Administrador[];
  onAdicionarAdmin: (admin: Omit<Administrador, 'id'>) => void;
  onRemoverAdmin: (id: string) => void;
  onAtualizarPermissoes: (id: string, permissoes: Administrador['permissoes']) => void;
  tema: 'light' | 'dark';
}

const GerenciarAdministradores: React.FC<Props> = ({
  administradores,
  onAdicionarAdmin,
  onRemoverAdmin,
  onAtualizarPermissoes,
  tema
}) => {
  const [novoAdmin, setNovoAdmin] = useState({ nome: '', email: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!novoAdmin.nome.trim() || !novoAdmin.email.trim()) {
      setError('Preencha todos os campos');
      return;
    }

    if (!novoAdmin.email.includes('@')) {
      setError('Email inválido');
      return;
    }

    onAdicionarAdmin({
      nome: novoAdmin.nome.trim(),
      email: novoAdmin.email.trim(),
      permissoes: ['editar', 'definir_placares']
    });

    setNovoAdmin({ nome: '', email: '' });
  };

  const permissoesDisponiveis = [
    { valor: 'editar', label: 'Editar Torneio' },
    { valor: 'excluir', label: 'Excluir Torneio' },
    { valor: 'gerenciar_usuarios', label: 'Gerenciar Usuários' },
    { valor: 'definir_placares', label: 'Definir Placares' }
  ];

  return (
    <div className={`rounded-xl shadow-lg p-6 ${
      tema === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h3 className="text-xl font-semibold mb-4">Gerenciar Administradores</h3>

      {/* Formulário para adicionar novo admin */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              type="text"
              value={novoAdmin.nome}
              onChange={(e) => setNovoAdmin({ ...novoAdmin, nome: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border ${
                tema === 'dark'
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
              placeholder="Nome do administrador"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={novoAdmin.email}
              onChange={(e) => setNovoAdmin({ ...novoAdmin, email: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border ${
                tema === 'dark'
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
              placeholder="email@exemplo.com"
            />
          </div>
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <div className="mt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Adicionar Administrador
          </button>
        </div>
      </form>

      {/* Lista de administradores */}
      <div className="space-y-4">
        {administradores.map((admin) => (
          <div
            key={admin.id}
            className={`p-4 rounded-lg ${
              tema === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-medium">{admin.nome}</h4>
                <p className="text-sm text-gray-500">{admin.email}</p>
              </div>
              <button
                onClick={() => onRemoverAdmin(admin.id)}
                className="text-red-600 hover:text-red-700 transition-colors"
              >
                Remover
              </button>
            </div>

            <div className="space-y-2">
              {permissoesDisponiveis.map((permissao) => (
                <label key={permissao.valor} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={admin.permissoes.includes(permissao.valor as any)}
                    onChange={(e) => {
                      const novasPermissoes = e.target.checked
                        ? [...admin.permissoes, permissao.valor]
                        : admin.permissoes.filter(p => p !== permissao.valor);
                      onAtualizarPermissoes(admin.id, novasPermissoes as Administrador['permissoes']);
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{permissao.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {administradores.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            Nenhum administrador cadastrado
          </p>
        )}
      </div>
    </div>
  );
};

export default GerenciarAdministradores;
