import { Link } from "wouter";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DesligamentosTable } from "@/components/DesligamentosTable";

export default function Home() {
  const { data: desligamentos = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/desligamentos"],
  });

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

      {isLoading ? (
        <div className="text-center text-muted-foreground py-8">Carregando...</div>
      ) : (
        <DesligamentosTable desligamentos={desligamentos} />
      )}
    </div>
  );
}
