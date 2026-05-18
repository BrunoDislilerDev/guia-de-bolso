"use client";

import { useEffect, useState } from "react";
import AdminShell, { useAdminAuth } from "@/components/admin/AdminShell";
import { createClient } from "@/lib/supabase";

function getInitial(user) {
  return (user.nome || user.full_name || user.email || "?").charAt(0).toUpperCase();
}

export default function AdminUsuariosPage() {
  const { loading } = useAdminAuth();
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    if (!loading) loadUsuarios();
  }, [loading]);

  async function loadUsuarios() {
    const supabase = createClient();
    const { data } = await supabase
      .from("perfis")
      .select("*")
      .order("created_at", { ascending: false });
    setUsuarios(data ?? []);
  }

  async function toggleRole(usuario) {
    const supabase = createClient();
    const nextRole = usuario.role === "admin" ? "user" : "admin";
    setUsuarios((items) =>
      items.map((item) => (item.id === usuario.id ? { ...item, role: nextRole } : item))
    );
    await supabase.from("perfis").update({ role: nextRole }).eq("id", usuario.id);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f4f3] text-[#5a6b66]">
        Carregando admin...
      </div>
    );
  }

  return (
    <AdminShell title="Usuários">
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-[#1a4a3a] text-white">
            <tr>
              <th className="p-3">Usuário</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Cadastro</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td className="p-4 text-[#5a6b66]" colSpan={5}>
                  Nenhum perfil encontrado.
                </td>
              </tr>
            ) : (
              usuarios.map((usuario) => (
                <tr key={usuario.id} className="border-t border-[#eef3f1]">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {usuario.foto_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={usuario.foto_url}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d4ede8] font-bold text-[#1a4a3a]">
                          {getInitial(usuario)}
                        </div>
                      )}
                      <span className="font-semibold text-[#1a2e28]">
                        {usuario.nome || usuario.full_name || "Sem nome"}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">{usuario.email || "—"}</td>
                  <td className="p-3">
                    <span className="rounded-full bg-[#f0f4f3] px-3 py-1 text-xs font-semibold text-[#1a4a3a]">
                      {usuario.role || "user"}
                    </span>
                  </td>
                  <td className="p-3">
                    {usuario.created_at
                      ? new Date(usuario.created_at).toLocaleDateString("pt-BR")
                      : "—"}
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => toggleRole(usuario)}
                      className="rounded-lg bg-[#1a4a3a] px-3 py-2 text-sm font-semibold text-white"
                    >
                      Tornar {usuario.role === "admin" ? "user" : "admin"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
