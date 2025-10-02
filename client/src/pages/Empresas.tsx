import { useState } from "react";
import { CrudTable } from "@/components/CrudTable";
import { AddDialog } from "@/components/AddDialog";
import { useToast } from "@/hooks/use-toast";

export default function Empresas() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const mockEmpresas = [
    { id: 1, nome: "Tech Solutions" },
    { id: 2, nome: "Inovação Corp" },
    { id: 3, nome: "Digital Ventures" },
    { id: 4, nome: "Software House Brasil" },
    { id: 5, nome: "Consultoria TI" },
  ];

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

  const handleSubmit = (data: Record<string, string>) => {
    console.log("Nova empresa:", data);
    toast({
      title: "Empresa adicionada",
      description: `${data.nome} foi adicionada com sucesso.`,
    });
    setDialogOpen(false);
  };

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
        data={mockEmpresas}
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
        onSubmit={handleSubmit}
      />
    </div>
  );
}
