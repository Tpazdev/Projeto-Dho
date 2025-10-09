import { Link } from "wouter";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DesligamentosTable } from "@/components/DesligamentosTable";

interface Desligamento {
  id: number;
  dataDesligamento: string;
  motivo: string | null;
  tipoDesligamento: string;
  funcionarioId: number;
  empresaId: number;
  gestorId: number;
}

export default function DesligamentosFuncionario() {
  const { data: desligamentos = [], isLoading } = useQuery<Desligamento[]>({
    queryKey: ["/api/desligamentos"],
  });

  // Filtra desligamentos iniciados pelo funcionário
  const desligamentosPorFuncionario = desligamentos.filter((d) => 
    d.tipoDesligamento === "funcionario"
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Desligamentos por Funcionário</h1>
          <p className="text-muted-foreground mt-1">
            Desligamentos iniciados pelo funcionário (pedido de demissão, abandono, etc.)
          </p>
        </div>
        <Link href="/desligamento/novo">
          <Button data-testid="button-novo-desligamento">
            <Plus className="h-4 w-4 mr-2" />
            Novo Desligamento
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground py-8">Carregando...</div>
      ) : desligamentosPorFuncionario.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          Nenhum desligamento por funcionário encontrado
        </div>
      ) : (
        <DesligamentosTable desligamentos={desligamentosPorFuncionario} />
      )}
    </div>
  );
}
