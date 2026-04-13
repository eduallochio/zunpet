"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type DeletionRequest = {
  id: string;
  email: string;
  reason: string | null;
  status: "pending" | "processing" | "completed" | "rejected";
  source: "web" | "app";
  created_at: string;
  processed_at: string | null;
  notes: string | null;
};

const STATUS_LABELS: Record<DeletionRequest["status"], string> = {
  pending: "Pendente",
  processing: "Em andamento",
  completed: "Concluído",
  rejected: "Rejeitado",
};

const STATUS_COLORS: Record<DeletionRequest["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  rejected: "bg-gray-100 text-gray-600",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function DeletionsClient({ requests }: { requests: DeletionRequest[] }) {
  const [items, setItems] = useState(requests);
  const [filter, setFilter] = useState<"all" | DeletionRequest["status"]>("all");
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = filter === "all" ? items : items.filter((r) => r.status === filter);

  const counts = {
    all: items.length,
    pending: items.filter((r) => r.status === "pending").length,
    processing: items.filter((r) => r.status === "processing").length,
    completed: items.filter((r) => r.status === "completed").length,
    rejected: items.filter((r) => r.status === "rejected").length,
  };

  async function updateStatus(id: string, status: DeletionRequest["status"]) {
    setLoading(id);
    try {
      const res = await fetch("/api/deletion-request/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((r) =>
            r.id === id
              ? { ...r, status, processed_at: status === "completed" || status === "rejected" ? new Date().toISOString() : r.processed_at }
              : r
          )
        );
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Solicitações de exclusão</h1>
        <p className="text-sm text-gray-500 mt-1">Gerencie os pedidos de exclusão de conta dos usuários.</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "pending", "processing", "completed", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === f
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f === "all" ? "Todos" : STATUS_LABELS[f]} ({counts[f]})
          </button>
        ))}
      </div>

      {/* Tabela */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">
          Nenhuma solicitação encontrada.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => (
            <div key={req.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-900 text-sm">{req.email}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[req.status]}`}>
                      {STATUS_LABELS[req.status]}
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                      via {req.source === "web" ? "site" : "app"}
                    </span>
                  </div>

                  {req.reason && (
                    <p className="text-xs text-gray-500 mt-1.5 italic">"{req.reason}"</p>
                  )}

                  <p className="text-xs text-gray-400 mt-1">
                    Solicitado em {formatDate(req.created_at)}
                    {req.processed_at && ` · Processado em ${formatDate(req.processed_at)}`}
                  </p>
                </div>

                {/* Ações */}
                {req.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={loading === req.id}
                      onClick={() => updateStatus(req.id, "processing")}
                      className="text-xs h-8"
                    >
                      Iniciar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={loading === req.id}
                      onClick={() => updateStatus(req.id, "rejected")}
                      className="text-xs h-8 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Rejeitar
                    </Button>
                  </div>
                )}

                {req.status === "processing" && (
                  <Button
                    size="sm"
                    disabled={loading === req.id}
                    onClick={() => updateStatus(req.id, "completed")}
                    className="text-xs h-8 bg-green-600 hover:bg-green-700"
                  >
                    {loading === req.id ? "..." : "Marcar como concluído"}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
