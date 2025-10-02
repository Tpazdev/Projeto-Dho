import { useState } from "react";
import { AddDialog } from "../AddDialog";
import { Button } from "@/components/ui/button";

export default function AddDialogExample() {
  const [open, setOpen] = useState(false);

  const fields = [
    {
      name: "nome",
      label: "Nome",
      type: "text" as const,
      placeholder: "Digite o nome",
      required: true,
    },
  ];

  const handleSubmit = (data: Record<string, string>) => {
    console.log("Dialog submitted:", data);
    setOpen(false);
  };

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>Abrir Dialog</Button>
      <AddDialog
        open={open}
        onOpenChange={setOpen}
        title="Adicionar Empresa"
        description="Preencha os dados para adicionar uma nova empresa"
        fields={fields}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
