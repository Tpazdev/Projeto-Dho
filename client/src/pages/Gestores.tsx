import { useState } from "react";
import { CrudTable } from "@/components/CrudTable";
import { AddDialog } from "@/components/AddDialog";
import { useToast } from "@/hooks/use-toast";

export default function Gestores() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const mockEmpresas = [
    { id: 1, nome: "Tech Solutions" },
    { id: 2, nome: "Inovação Corp" },
    { id: 3, nome: "Digital Ventures" },
  ];

  const mockGestores = [
    { id: 1, nome: "Ana Santos", empresaId: 1, empresaNome: "Tech Solutions" },
    { id: 2, nome: "João Costa", empresaId: 2, empresaNome: "Inovação Corp" },
    { id: 3, nome: "Patricia Lima", empresaId: 3, empresaNome: "Digital Ventures" },
    { id: 4, nome: "Roberto Alves", empresaId: 1, empresaNome: "Tech Solutions" },
    { id: 5, nome: "Fernanda Silva", empresaId: 2, empresaNome: "Inovação Corp" },
  ];

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
      options: mockEmpresas.map((e) => ({
        value: e.id.toString(),
        label: e.nome,
      })),
    },
  ];

  const handleSubmit = (data: Record<string, string>) => {
    console.log("Novo gestor:", data);
    toast({
      title: "Gestor adicionado",
      description: `${data.nome} foi adicionado com sucesso.`,
    });
    setDialogOpen(false);
  };

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
        data={mockGestores}
        columns={columns}
        onAddClick={() => setDialogOpen(true)}
        emptyMessage="Nenhum gestor cadastrado"
      />

      <AddDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Adicionar Gestor"
        description="Preencha os dados para adicionar um novo gestor"
        fields={fields}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
