import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CrudTable } from "@/components/CrudTable";
import { AddDialog } from "@/components/AddDialog";
import { GestorDetalhesDialog } from "@/components/GestorDetalhesDialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export default function Gestores() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detalhesDialogOpen, setDetalhesDialogOpen] = useState(false);
  const [gestorSelecionado, setGestorSelecionado] = useState<any>(null);
  const { toast } = useToast();

  const { data: empresas = [] } = useQuery({
    queryKey: ["/api/empresas"],
  });

  const { data: gestores = [], isLoading } = useQuery({
    queryKey: ["/api/gestores"],
  });

  const mutation = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      return await apiRequest("POST", "/api/gestores", {
        nome: data.nome,
        empresaId: parseInt(data.empresaId),
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/gestores"] });
      toast({
        title: "Gestor adicionado",
        description: `${variables.nome} foi adicionado com sucesso.`,
      });
      setDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao adicionar gestor.",
        variant: "destructive",
      });
    },
  });

  const gestoresWithEmpresa = gestores.map((gestor: any) => {
    const empresa = empresas.find((e: any) => e.id === gestor.empresaId);
    return {
      ...gestor,
      empresaNome: empresa?.nome || "N/A",
    };
  });

  const columns = [
    { header: "ID", accessor: "id" as const },
    { header: "Nome do Gestor", accessor: "nome" as const },
    { header: "Empresa", accessor: "empresaNome" as const },
  ];

  const fields = [
    {
      name: "nome",
      label: "Nome do Gestor",
      type: "text" as const,
      placeholder: "Digite o nome do gestor",
      required: true,
    },
    {
      name: "empresaId",
      label: "Empresa",
      type: "select" as const,
      placeholder: "Selecione uma empresa",
      required: true,
      options: empresas.map((e: any) => ({
        value: e.id.toString(),
        label: e.nome,
      })),
    },
  ];

  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestores</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie os gestores cadastrados no sistema
        </p>
      </div>

      <CrudTable
        title="Gestores Cadastrados"
        data={gestoresWithEmpresa}
        columns={columns}
        onAddClick={() => setDialogOpen(true)}
        emptyMessage="Nenhum gestor cadastrado"
        actions={(row) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setGestorSelecionado(row);
              setDetalhesDialogOpen(true);
            }}
            data-testid={`button-ver-detalhes-${row.id}`}
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
        )}
      />

      <AddDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Adicionar Gestor"
        description="Preencha os dados para adicionar um novo gestor"
        fields={fields}
        onSubmit={(data) => mutation.mutate(data)}
      />

      <GestorDetalhesDialog
        open={detalhesDialogOpen}
        onOpenChange={setDetalhesDialogOpen}
        gestor={gestorSelecionado}
      />
    </div>
  );
}
