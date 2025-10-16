import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Mail, CheckCircle, XCircle, Loader2, ExternalLink } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface DesligamentoData {
  id: number;
  funcionarioNome: string;
  cargo: string;
  gestorNome: string;
  empresaNome: string;
  dataDesligamento: string;
  emailColaborador?: string | null;
  questionarioEnviado?: number;
  questionarioRespondido?: number;
}

interface DesligamentosTableProps {
  desligamentos: DesligamentoData[];
}

export function DesligamentosTable({ desligamentos }: DesligamentosTableProps) {
  const { toast } = useToast();
  const [linkCopiado, setLinkCopiado] = useState<number | null>(null);

  const enviarQuestionarioMutation = useMutation({
    mutationFn: async (desligamentoId: number) => {
      const response = await apiRequest(`/api/desligamentos/${desligamentoId}/enviar-questionario`, {
        method: "POST",
      });
      return response;
    },
    onSuccess: (data, desligamentoId) => {
      toast({
        title: "Questionário enviado!",
        description: "O colaborador receberá o link por email.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/desligamentos"] });
      
      // Copiar link para área de transferência (para teste)
      if (data.linkQuestionario) {
        navigator.clipboard.writeText(data.linkQuestionario);
        setLinkCopiado(desligamentoId);
        setTimeout(() => setLinkCopiado(null), 3000);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao enviar questionário",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Funcionário</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Gestor</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Data do Desligamento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {desligamentos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Nenhum desligamento registrado
                </TableCell>
              </TableRow>
            ) : (
              desligamentos.map((desligamento) => (
                <TableRow key={desligamento.id} data-testid={`row-desligamento-${desligamento.id}`}>
                  <TableCell className="font-medium" data-testid={`text-funcionario-${desligamento.id}`}>
                    {desligamento.funcionarioNome}
                  </TableCell>
                  <TableCell data-testid={`text-cargo-${desligamento.id}`}>
                    {desligamento.cargo}
                  </TableCell>
                  <TableCell data-testid={`text-gestor-${desligamento.id}`}>
                    {desligamento.gestorNome}
                  </TableCell>
                  <TableCell data-testid={`text-empresa-${desligamento.id}`}>
                    {desligamento.empresaNome}
                  </TableCell>
                  <TableCell data-testid={`text-data-${desligamento.id}`}>
                    {format(new Date(desligamento.dataDesligamento), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    {desligamento.questionarioRespondido === 1 ? (
                      <Badge variant="default" className="gap-1" data-testid={`badge-respondido-${desligamento.id}`}>
                        <CheckCircle className="h-3 w-3" />
                        Respondido
                      </Badge>
                    ) : desligamento.questionarioEnviado === 1 ? (
                      <Badge variant="secondary" className="gap-1" data-testid={`badge-enviado-${desligamento.id}`}>
                        <Mail className="h-3 w-3" />
                        Enviado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1" data-testid={`badge-pendente-${desligamento.id}`}>
                        <XCircle className="h-3 w-3" />
                        Pendente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {!desligamento.emailColaborador ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled
                            data-testid={`button-enviar-email-${desligamento.id}`}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Enviar
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Email do colaborador não cadastrado
                        </TooltipContent>
                      </Tooltip>
                    ) : desligamento.questionarioRespondido === 1 ? (
                      <Badge variant="default">Concluído</Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant={desligamento.questionarioEnviado === 1 ? "outline" : "default"}
                        onClick={() => enviarQuestionarioMutation.mutate(desligamento.id)}
                        disabled={enviarQuestionarioMutation.isPending}
                        data-testid={`button-enviar-email-${desligamento.id}`}
                      >
                        {enviarQuestionarioMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Enviando...
                          </>
                        ) : linkCopiado === desligamento.id ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Link copiado!
                          </>
                        ) : (
                          <>
                            <Mail className="h-4 w-4 mr-2" />
                            {desligamento.questionarioEnviado === 1 ? "Reenviar" : "Enviar Email"}
                          </>
                        )}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
