import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CrudTable } from "@/components/CrudTable";
import { AddDialog } from "@/components/AddDialog";
import { FuncionarioDetalhesDialog } from "@/components/FuncionarioDetalhesDialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function Funcionarios() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detalhesDialogOpen, setDetalhesDialogOpen] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<any>(null);
  const { toast } = useToast();

  const { data: gestores = [] } = useQuery({
    queryKey: ["/api/gestores"],
  });

  const { data: funcionarios = [], isLoading } = useQuery({
    queryKey: ["/api/funcionarios"],
  });

  const mutation = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      return await apiRequest("POST", "/api/funcionarios", {
        nome: data.nome,
        cargo: data.cargo,
        gestorId: parseInt(data.gestorId),
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/funcionarios"] });
      toast({
        title: "Funcionário adicionado",
        description: `${variables.nome} foi adicionado com sucesso.`,
      });
      setDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao adicionar funcionário.",
        variant: "destructive",
      });
    },
  });

  const funcionariosWithGestor = funcionarios.map((funcionario: any) => {
    const gestor = gestores.find((g: any) => g.id === funcionario.gestorId);
    return {
      ...funcionario,
      gestorNome: gestor?.nome || "N/A",
    };
  });

  const columns = [
    { header: "ID", accessor: "id" as const },
    { header: "Nome do Funcionário", accessor: "nome" as const },
    { header: "Cargo", accessor: "cargo" as const },
    { header: "Gestor", accessor: "gestorNome" as const },
  ];

  const fields = [
    {
      name: "nome",
      label: "Nome do Funcionário",
      type: "text" as const,
      placeholder: "Digite o nome do funcionário",
      required: true,
    },
    {
      name: "cargo",
      label: "Cargo",
      type: "text" as const,
      placeholder: "Digite o cargo",
      required: true,
    },
    {
      name: "gestorId",
      label: "Gestor",
      type: "select" as const,
      placeholder: "Selecione um gestor",
      required: true,
      options: gestores.map((g: any) => ({
        value: g.id.toString(),
        label: g.nome,
      })),
    },
  ];

  const handleVerDetalhes = (funcionario: any) => {
    setFuncionarioSelecionado(funcionario);
    setDetalhesDialogOpen(true);
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Funcionários</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie os funcionários cadastrados no sistema
        </p>
      </div>

      <CrudTable
        title="Funcionários Cadastrados"
        data={funcionariosWithGestor}
        columns={columns}
        onAddClick={() => setDialogOpen(true)}
        emptyMessage="Nenhum funcionário cadastrado"
        actions={(funcionario) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVerDetalhes(funcionario)}
            data-testid={`button-detalhes-${funcionario.id}`}
          >
            <FileText className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
        )}
      />

      <AddDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Adicionar Funcionário"
        description="Preencha os dados para adicionar um novo funcionário"
        fields={fields}
        onSubmit={(data) => mutation.mutate(data)}
      />

      <FuncionarioDetalhesDialog
        open={detalhesDialogOpen}
        onOpenChange={setDetalhesDialogOpen}
        funcionario={funcionarioSelecionado}
      />
    </div>
  );
}
