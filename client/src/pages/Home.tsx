import { Link } from "wouter";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DesligamentosTable } from "@/components/DesligamentosTable";

export default function Home() {
  const mockDesligamentos = [
    {
      id: 1,
      funcionarioNome: "Carlos Silva",
      cargo: "Desenvolvedor Senior",
      gestorNome: "Ana Santos",
      empresaNome: "Tech Solutions",
      dataDesligamento: "2024-01-15",
    },
    {
      id: 2,
      funcionarioNome: "Maria Oliveira",
      cargo: "Gerente de Projetos",
      gestorNome: "João Costa",
      empresaNome: "Inovação Corp",
      dataDesligamento: "2024-02-20",
    },
    {
      id: 3,
      funcionarioNome: "Pedro Santos",
      cargo: "Analista de Sistemas",
      gestorNome: "Ana Santos",
      empresaNome: "Tech Solutions",
      dataDesligamento: "2024-03-10",
    },
    {
      id: 4,
      funcionarioNome: "Juliana Costa",
      cargo: "Designer UX",
      gestorNome: "Patricia Lima",
      empresaNome: "Digital Ventures",
      dataDesligamento: "2024-03-25",
    },
    {
      id: 5,
      funcionarioNome: "Roberto Almeida",
      cargo: "Engenheiro de Software",
      gestorNome: "Ana Santos",
      empresaNome: "Tech Solutions",
      dataDesligamento: "2024-04-05",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Desligamentos</h1>
          <p className="text-muted-foreground mt-1">
            Visualize e gerencie todos os desligamentos registrados
          </p>
        </div>
        <Link href="/desligamento/novo">
          <Button data-testid="button-novo-desligamento">
            <Plus className="h-4 w-4 mr-2" />
            Novo Desligamento
          </Button>
        </Link>
      </div>

      <DesligamentosTable desligamentos={mockDesligamentos} />
    </div>
  );
}
