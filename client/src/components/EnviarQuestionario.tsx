import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search, Mail, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Funcionario {
  id: number;
  nome: string;
  cargo: string | null;
  gestorId: number;
}

interface Gestor {
  id: number;
  nome: string;
  empresaId: number;
}

interface EnviarQuestionarioProps {
  tipoDesligamento: "funcionario" | "gestor";
}

export function EnviarQuestionario({ tipoDesligamento }: EnviarQuestionarioProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: funcionarios = [], isLoading: loadingFuncionarios } = useQuery<Funcionario[]>({
    queryKey: ["/api/funcionarios"],
  });

  const { data: gestores = [], isLoading: loadingGestores } = useQuery<Gestor[]>({
    queryKey: ["/api/gestores"],
  });

  const enviarEmailMutation = useMutation({
    mutationFn: async ({ funcionarioId, email }: { funcionarioId: number; email: string }) => {
      return await apiRequest("POST", "/api/enviar-questionario", {
        funcionarioId,
        email,
        tipoDesligamento,
      });
    },
    onSuccess: () => {
      toast({
        title: "Questionário enviado",
        description: "O questionário de desligamento foi enviado por email com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar o questionário. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const filteredFuncionarios = funcionarios.filter((f) =>
    f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.cargo && f.cargo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEnviarEmail = (funcionarioId: number) => {
    // Por enquanto, vamos solicitar o email ao usuário
    const email = prompt("Digite o email do funcionário:");
    if (email) {
      enviarEmailMutation.mutate({ funcionarioId, email });
    }
  };

  const getGestorNome = (gestorId: number) => {
    const gestor = gestores.find((g) => g.id === gestorId);
    return gestor?.nome || "N/A";
  };

  const isLoading = loadingFuncionarios || loadingGestores;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enviar Questionário de Desligamento</CardTitle>
        <CardDescription>
          Pesquise funcionários e envie o questionário de desligamento por email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome ou cargo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-funcionario"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">Carregando...</div>
        ) : filteredFuncionarios.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Nenhum funcionário encontrado
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Gestor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFuncionarios.map((funcionario) => (
                  <TableRow key={funcionario.id} data-testid={`row-funcionario-${funcionario.id}`}>
                    <TableCell className="font-medium">{funcionario.nome}</TableCell>
                    <TableCell>{funcionario.cargo || "N/A"}</TableCell>
                    <TableCell>{getGestorNome(funcionario.gestorId)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEnviarEmail(funcionario.id)}
                        disabled={enviarEmailMutation.isPending}
                        data-testid={`button-enviar-email-${funcionario.id}`}
                      >
                        {enviarEmailMutation.isPending ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Mail className="h-4 w-4 mr-2" />
                        )}
                        Enviar Questionário
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
