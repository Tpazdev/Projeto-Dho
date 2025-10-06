import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CrudTable } from "@/components/CrudTable";
import { AddDialog } from "@/components/AddDialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Empresas() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: empresas = [], isLoading } = useQuery({
    queryKey: ["/api/empresas"],
  });

  const mutation = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      return await apiRequest("POST", "/api/empresas", data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/empresas"] });
      toast({
        title: "Empresa adicionada",
        description: `${variables.nome} foi adicionada com sucesso.`,
      });
      setDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao adicionar empresa.",
        variant: "destructive",
      });
    },
  });

  const columns = [
    { header: "ID", accessor: "id" as const },
    { header: "Nome da Empresa", accessor: "nome" as const },
  ];

  const fields = [
    {
      name: "nome",
      label: "Nome da Empresa",
      type: "text" as const,
      placeholder: "Digite o nome da empresa",
      required: true,
    },
  ];

  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Empresas</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie as empresas cadastradas no sistema
        </p>
      </div>

      <CrudTable
        title="Empresas Cadastradas"
        data={empresas}
        columns={columns}
        onAddClick={() => setDialogOpen(true)}
        emptyMessage="Nenhuma empresa cadastrada"
      />

      <AddDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Adicionar Empresa"
        description="Preencha os dados para adicionar uma nova empresa"
        fields={fields}
        onSubmit={(data) => mutation.mutate(data)}
      />
    </div>
  );
}
