import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Database, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExternalDbResponse {
  success: boolean;
  data: any[];
  rowCount: number;
}

export default function DadosExternos() {
  const { data, isLoading, error, refetch } = useQuery<ExternalDbResponse>({
    queryKey: ["/api/external-db/r34fun"],
  });

  const funcionarios = data?.data || [];
  const rowCount = data?.rowCount || 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dados Externos - Funcionários</h1>
          <p className="text-muted-foreground mt-1">
            Dados da tabela r34fun do banco SQL Server externo
          </p>
        </div>
        <div className="text-center text-muted-foreground py-8">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          Carregando dados...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dados Externos - Funcionários</h1>
          <p className="text-muted-foreground mt-1">
            Dados da tabela r34fun do banco SQL Server externo
          </p>
        </div>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Erro ao Carregar Dados</CardTitle>
            <CardDescription>
              Não foi possível conectar ao banco de dados externo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "Erro desconhecido"}
            </p>
            <Button 
              onClick={() => refetch()} 
              className="mt-4"
              data-testid="button-retry"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dados Externos - Funcionários</h1>
          <p className="text-muted-foreground mt-1">
            Dados da tabela r34fun do banco SQL Server externo
          </p>
        </div>
        <Button 
          onClick={() => refetch()} 
          variant="outline"
          data-testid="button-refresh"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <CardTitle>Registros Encontrados</CardTitle>
          </div>
          <CardDescription>
            Total de {rowCount} funcionário(s) na tabela r34fun
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rowCount === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Nenhum registro encontrado na tabela
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="table-funcionarios">
                <thead>
                  <tr className="border-b">
                    {funcionarios.length > 0 && Object.keys(funcionarios[0]).map((key) => (
                      <th key={key} className="text-left py-3 px-4 font-semibold">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {funcionarios.map((funcionario: any, index: number) => (
                    <tr key={index} className="border-b hover-elevate" data-testid={`row-funcionario-${index}`}>
                      {Object.values(funcionario).map((value: any, i: number) => (
                        <td key={i} className="py-3 px-4 text-sm">
                          {value === null ? (
                            <span className="text-muted-foreground italic">null</span>
                          ) : typeof value === 'object' ? (
                            JSON.stringify(value)
                          ) : (
                            String(value)
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
