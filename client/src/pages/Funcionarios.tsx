import { useState } from "react";
import { CrudTable } from "@/components/CrudTable";
import { AddDialog } from "@/components/AddDialog";
import { useToast } from "@/hooks/use-toast";

export default function Funcionarios() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const mockGestores = [
    { id: 1, nome: "Ana Santos" },
    { id: 2, nome: "João Costa" },
    { id: 3, nome: "Patricia Lima" },
    { id: 4, nome: "Roberto Alves" },
  ];

  const mockFuncionarios = [
    { id: 1, nome: "Carlos Silva", cargo: "Desenvolvedor Senior", gestorId: 1, gestorNome: "Ana Santos" },
    { id: 2, nome: "Maria Oliveira", cargo: "Gerente de Projetos", gestorId: 2, gestorNome: "João Costa" },
    { id: 3, nome: "Pedro Santos", cargo: "Analista de Sistemas", gestorId: 1, gestorNome: "Ana Santos" },
    { id: 4, nome: "Juliana Costa", cargo: "Designer UX", gestorId: 3, gestorNome: "Patricia Lima" },
    { id: 5, nome: "Roberto Almeida", cargo: "Engenheiro de Software", gestorId: 4, gestorNome: "Roberto Alves" },
  ];

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
      options: mockGestores.map((g) => ({
        value: g.id.toString(),
        label: g.nome,
      })),
    },
  ];

  const handleSubmit = (data: Record<string, string>) => {
    console.log("Novo funcionário:", data);
    toast({
      title: "Funcionário adicionado",
      description: `${data.nome} foi adicionado com sucesso.`,
    });
    setDialogOpen(false);
  };

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
        data={mockFuncionarios}
        columns={columns}
        onAddClick={() => setDialogOpen(true)}
        emptyMessage="Nenhum funcionário cadastrado"
      />

      <AddDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Adicionar Funcionário"
        description="Preencha os dados para adicionar um novo funcionário"
        fields={fields}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
