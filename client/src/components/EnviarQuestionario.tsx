import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search, Mail, Loader2, Copy, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState("");
  const [currentFuncionario, setCurrentFuncionario] = useState("");
  const { toast } = useToast();

  const { data: funcionarios = [], isLoading: loadingFuncionarios } = useQuery<Funcionario[]>({
    queryKey: ["/api/funcionarios"],
  });

  const { data: gestores = [], isLoading: loadingGestores } = useQuery<Gestor[]>({
    queryKey: ["/api/gestores"],
  });

  const enviarEmailMutation = useMutation({
    mutationFn: async ({ funcionarioId, email, funcionarioNome }: { funcionarioId: number; email: string; funcionarioNome: string }) => {
      const response = await apiRequest("POST", "/api/enviar-questionario", {
        funcionarioId,
        email,
        tipoDesligamento,
      });
      return { ...(await response.json()), funcionarioNome };
    },
    onSuccess: (data) => {
      if (tipoDesligamento === "gestor" && data.link) {
        setCurrentLink(data.link);
        setCurrentFuncionario(data.funcionarioNome);
        setLinkDialogOpen(true);
        toast({
          title: "Link do questionário gerado",
          description: "O link do Microsoft Forms está pronto para ser enviado ao colaborador.",
        });
      } else {
        toast({
          title: "Questionário enviado",
          description: "O questionário de desligamento foi enviado por email com sucesso.",
        });
      }
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

  const handleEnviarEmail = (funcionarioId: number, funcionarioNome: string) => {
    // Por enquanto, vamos solicitar o email ao usuário
    const email = prompt("Digite o email do funcionário:");
    if (email) {
      enviarEmailMutation.mutate({ funcionarioId, email, funcionarioNome });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentLink);
    toast({
      title: "Link copiado",
      description: "O link foi copiado para a área de transferência.",
    });
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
                        onClick={() => handleEnviarEmail(funcionario.id, funcionario.nome)}
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

      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Link do Questionário - Microsoft Forms</DialogTitle>
            <DialogDescription>
              Envie este link para o colaborador {currentFuncionario} responder o questionário de desligamento
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-mono break-all">{currentLink}</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCopyLink}
                className="flex-1"
                data-testid="button-copy-link"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar Link
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(currentLink, '_blank')}
                className="flex-1"
                data-testid="button-open-link"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir no Navegador
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold mb-2">Mensagem sugerida para o colaborador:</p>
              <div className="bg-background border rounded-lg p-3">
                <p>Prezado(a) {currentFuncionario},</p>
                <p className="mt-2">Por favor, acesse o link abaixo para responder o questionário de desligamento:</p>
                <p className="mt-2 font-mono text-xs break-all text-primary">{currentLink}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
