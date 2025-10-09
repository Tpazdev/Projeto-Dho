import { Link } from "wouter";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DesligamentosTable, type DesligamentoData } from "@/components/DesligamentosTable";
import { EnviarQuestionario } from "@/components/EnviarQuestionario";

interface DesligamentoCompleto extends DesligamentoData {
  motivo: string | null;
  tipoDesligamento: string;
  funcionarioId: number;
  empresaId: number;
  gestorId: number;
}

export default function DesligamentosGestor() {
  const { data: desligamentos = [], isLoading } = useQuery<DesligamentoCompleto[]>({
    queryKey: ["/api/desligamentos"],
  });

  // Filtra desligamentos iniciados pelo gestor/empresa
  const desligamentosPorGestor = desligamentos.filter((d) => 
    d.tipoDesligamento === "gestor"
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Entrevista de desligamento – por parte da empresa</h1>
          <p className="text-muted-foreground mt-1">
            Desligamentos iniciados pela empresa (demissão, término de contrato, etc.)
          </p>
        </div>
        <Link href="/desligamento/novo">
          <Button data-testid="button-novo-desligamento">
            <Plus className="h-4 w-4 mr-2" />
            Novo Desligamento
          </Button>
        </Link>
      </div>

      <EnviarQuestionario tipoDesligamento="gestor" />

      {isLoading ? (
        <div className="text-center text-muted-foreground py-8">Carregando...</div>
      ) : desligamentosPorGestor.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          Nenhum desligamento por gestor encontrado
        </div>
      ) : (
        <DesligamentosTable desligamentos={desligamentosPorGestor} />
      )}
    </div>
  );
}
