import { useLocation } from "wouter";
import { DesligamentoForm } from "@/components/DesligamentoForm";
import { useToast } from "@/hooks/use-toast";

export default function NovoDesligamento() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const mockEmpresas = [
    { id: 1, nome: "Tech Solutions" },
    { id: 2, nome: "Inovação Corp" },
    { id: 3, nome: "Digital Ventures" },
  ];

  const mockGestores = [
    { id: 1, nome: "Ana Santos", empresaId: 1 },
    { id: 2, nome: "João Costa", empresaId: 2 },
    { id: 3, nome: "Patricia Lima", empresaId: 3 },
    { id: 4, nome: "Roberto Alves", empresaId: 1 },
  ];

  const mockFuncionarios = [
    { id: 1, nome: "Carlos Silva", cargo: "Desenvolvedor Senior", gestorId: 1 },
    { id: 2, nome: "Maria Oliveira", cargo: "Gerente de Projetos", gestorId: 2 },
    { id: 3, nome: "Pedro Santos", cargo: "Analista de Sistemas", gestorId: 1 },
    { id: 4, nome: "Juliana Costa", cargo: "Designer UX", gestorId: 3 },
    { id: 5, nome: "Roberto Almeida", cargo: "Engenheiro de Software", gestorId: 4 },
  ];

  const handleSubmit = (data: any) => {
    console.log("Desligamento registrado:", data);
    toast({
      title: "Desligamento registrado",
      description: "O desligamento foi registrado com sucesso.",
    });
    setTimeout(() => setLocation("/"), 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Novo Desligamento</h1>
        <p className="text-muted-foreground mt-1">
          Registre um novo desligamento de funcionário
        </p>
      </div>

      <DesligamentoForm
        empresas={mockEmpresas}
        gestores={mockGestores}
        funcionarios={mockFuncionarios}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
