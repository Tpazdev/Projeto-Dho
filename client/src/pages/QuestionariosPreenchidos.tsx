import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Eye, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Funcionario {
  id: number;
  nome: string;
  cargo: string | null;
}

interface Gestor {
  id: number;
  nome: string;
}

interface Desligamento {
  id: number;
  funcionarioId: number;
  gestorId: number;
  dataDesligamento: string;
  tipoDesligamento: string;
}

interface RespostaDesligamento {
  id: number;
  desligamentoId: number;
  questionarioId: number;
  perguntaId: number;
  valorEscala: number | null;
  textoResposta: string | null;
  dataResposta: string;
}

interface DesligamentoComRespostas {
  desligamentoId: number;
}

interface Pergunta {
  id: number;
  pergunta: string;
  tipo: string;
}

interface QuestionariosPreenchidosProps {
  tipoDesligamento: "funcionario" | "gestor";
}

export default function QuestionariosPreenchidos({ tipoDesligamento }: QuestionariosPreenchidosProps) {
  const { usuario } = useAuth();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [respostasDialogOpen, setRespostasDialogOpen] = useState(false);
  const [selectedDesligamento, setSelectedDesligamento] = useState<{ 
    id: number; 
    funcionarioNome: string;
    gestorNome: string;
    dataDesligamento: string;
  } | null>(null);

  // Redirect non-authorized users (apenas funcionários)
  useEffect(() => {
    if (usuario && usuario.role !== "admin" && usuario.role !== "gestor") {
      navigate("/dashboard");
    }
  }, [usuario, navigate]);

  // Show nothing while checking permissions
  if (!usuario || (usuario.role !== "admin" && usuario.role !== "gestor")) {
    return null;
  }

  const { data: funcionarios = [] } = useQuery<Funcionario[]>({
    queryKey: ["/api/funcionarios"],
  });

  const { data: gestores = [] } = useQuery<Gestor[]>({
    queryKey: ["/api/gestores"],
  });

  const { data: desligamentos = [] } = useQuery<Desligamento[]>({
    queryKey: ["/api/desligamentos"],
  });

  const { data: todosDesligamentosComRespostas = [], isError: errorDesligamentosComRespostas } = useQuery<DesligamentoComRespostas[]>({
    queryKey: ["/api/desligamentos-com-respostas"],
  });

  // Filtrar desligamentos com respostas
  const desligamentosComRespostas = desligamentos
    .filter((d) => d.tipoDesligamento === tipoDesligamento)
    .filter((d) => todosDesligamentosComRespostas.some((dr) => dr.desligamentoId === d.id))
    .map((d) => {
      const funcionario = funcionarios.find((f) => f.id === d.funcionarioId);
      const gestor = gestores.find((g) => g.id === d.gestorId);
      return {
        ...d,
        funcionarioNome: funcionario?.nome || "N/A",
        funcionarioCargo: funcionario?.cargo || "N/A",
        gestorNome: gestor?.nome || "N/A",
      };
    })
    .filter((d) =>
      d.funcionarioNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.funcionarioCargo.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleVisualizarRespostas = (
    desligamentoId: number, 
    funcionarioNome: string,
    gestorNome: string,
    dataDesligamento: string
  ) => {
    setSelectedDesligamento({ 
      id: desligamentoId, 
      funcionarioNome,
      gestorNome,
      dataDesligamento 
    });
    setRespostasDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          Questionários Preenchidos - {tipoDesligamento === "funcionario" ? "Iniciativa do Funcionário" : "Iniciativa da Empresa"}
        </h1>
        <p className="text-muted-foreground mt-1">
          Visualize os questionários de desligamento que foram preenchidos
        </p>
      </div>

      {errorDesligamentosComRespostas && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao Carregar Dados</AlertTitle>
          <AlertDescription>
            Não foi possível carregar os questionários preenchidos. Tente novamente mais tarde.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Questionários Preenchidos</CardTitle>
          <CardDescription>
            Lista de questionários de desligamento respondidos
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

          {desligamentosComRespostas.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Nenhum questionário preenchido encontrado
            </div>
          ) : (
            <div className="border rounded-md overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Gestor</TableHead>
                    <TableHead>Data Desligamento</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {desligamentosComRespostas.map((desligamento) => (
                    <TableRow key={desligamento.id} data-testid={`row-desligamento-${desligamento.id}`}>
                      <TableCell>{desligamento.id}</TableCell>
                      <TableCell className="font-medium">{desligamento.funcionarioNome}</TableCell>
                      <TableCell>{desligamento.funcionarioCargo}</TableCell>
                      <TableCell>{desligamento.gestorNome}</TableCell>
                      <TableCell>
                        {new Date(desligamento.dataDesligamento).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVisualizarRespostas(
                            desligamento.id, 
                            desligamento.funcionarioNome,
                            desligamento.gestorNome,
                            desligamento.dataDesligamento
                          )}
                          data-testid={`button-visualizar-${desligamento.id}`}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar Respostas
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

      <Dialog open={respostasDialogOpen} onOpenChange={setRespostasDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Respostas do Questionário</DialogTitle>
            <DialogDescription>
              {selectedDesligamento && (
                <>
                  <div className="mt-2 space-y-1">
                    <div><strong>Funcionário:</strong> {selectedDesligamento.funcionarioNome}</div>
                    <div><strong>Gestor:</strong> {selectedDesligamento.gestorNome}</div>
                    <div><strong>Data do Desligamento:</strong> {new Date(selectedDesligamento.dataDesligamento).toLocaleDateString('pt-BR')}</div>
                  </div>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedDesligamento && (
            <RespostasView desligamentoId={selectedDesligamento.id} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RespostasView({ desligamentoId }: { desligamentoId: number }) {
  const { data: respostas = [], isLoading: loadingRespostas } = useQuery<RespostaDesligamento[]>({
    queryKey: ["/api/respostas-desligamento", desligamentoId],
    queryFn: () => fetch(`/api/respostas-desligamento/${desligamentoId}`).then(res => res.json()),
  });

  // Buscar perguntas do questionário usado nas respostas
  const questionarioId = respostas[0]?.questionarioId;
  
  const { data: perguntas = [], isLoading: loadingPerguntas } = useQuery<Pergunta[]>({
    queryKey: ["/api/questionarios-desligamento", questionarioId, "perguntas"],
    queryFn: () => fetch(`/api/questionarios-desligamento/${questionarioId}/perguntas`).then(res => res.json()),
    enabled: !!questionarioId,
  });

  if (loadingRespostas || loadingPerguntas) {
    return <div className="text-center py-8">Carregando respostas...</div>;
  }

  if (respostas.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Nenhuma resposta encontrada</div>;
  }

  return (
    <div className="space-y-6">
      {respostas.map((resposta, index) => {
        const pergunta = perguntas.find(p => p.id === resposta.perguntaId);
        
        return (
          <div key={resposta.id} className="border-b pb-4 last:border-0" data-testid={`resposta-${resposta.id}`}>
            <div className="mb-2">
              <span className="font-semibold text-sm text-muted-foreground">Pergunta {index + 1}</span>
            </div>
            <div className="mb-3">
              <p className="font-medium">{pergunta?.pergunta || "Pergunta não encontrada"}</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-md">
              <span className="text-sm text-muted-foreground">Resposta:</span>
              <div className="mt-1">
                {pergunta?.tipo === "escala" && resposta.valorEscala !== null ? (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-base px-3 py-1">
                      {resposta.valorEscala}
                    </Badge>
                    <span className="text-sm text-muted-foreground">de 10</span>
                  </div>
                ) : resposta.textoResposta ? (
                  <p className="text-foreground whitespace-pre-wrap">{resposta.textoResposta}</p>
                ) : (
                  <p className="text-muted-foreground italic">Sem resposta</p>
                )}
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Respondido em: {new Date(resposta.dataResposta).toLocaleDateString('pt-BR')}
            </div>
          </div>
        );
      })}
    </div>
  );
}
