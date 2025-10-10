import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
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
import { QuestionarioDesligamentoForm } from "./QuestionarioDesligamentoForm";

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

interface Desligamento {
  id: number;
  funcionarioId: number;
  empresaId: number;
  gestorId: number;
  dataDesligamento: string;
  motivo: string | null;
  tipoDesligamento: string;
}

interface EnviarQuestionarioProps {
  tipoDesligamento: "funcionario" | "gestor";
}

export function EnviarQuestionario({ tipoDesligamento }: EnviarQuestionarioProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [questionarioDialogOpen, setQuestionarioDialogOpen] = useState(false);
  const [selectedDesligamento, setSelectedDesligamento] = useState<{ id: number; funcionarioNome: string } | null>(null);

  const { data: funcionarios = [], isLoading: loadingFuncionarios } = useQuery<Funcionario[]>({
    queryKey: ["/api/funcionarios"],
  });

  const { data: gestores = [], isLoading: loadingGestores } = useQuery<Gestor[]>({
    queryKey: ["/api/gestores"],
  });

  const { data: desligamentos = [], isLoading: loadingDesligamentos } = useQuery<Desligamento[]>({
    queryKey: ["/api/desligamentos"],
  });

  const filteredDesligamentos = desligamentos
    .filter((d) => d.tipoDesligamento === tipoDesligamento)
    .map((d) => {
      const funcionario = funcionarios.find((f) => f.id === d.funcionarioId);
      return {
        ...d,
        funcionarioNome: funcionario?.nome || "N/A",
        funcionarioCargo: funcionario?.cargo || "N/A",
        gestorNome: gestores.find((g) => g.id === d.gestorId)?.nome || "N/A",
      };
    })
    .filter((d) =>
      d.funcionarioNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.funcionarioCargo.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleAbrirQuestionario = (desligamentoId: number, funcionarioNome: string) => {
    setSelectedDesligamento({ id: desligamentoId, funcionarioNome });
    setQuestionarioDialogOpen(true);
  };

  const handleQuestionarioSuccess = () => {
    setQuestionarioDialogOpen(false);
    setSelectedDesligamento(null);
  };

  const isLoading = loadingFuncionarios || loadingGestores || loadingDesligamentos;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Questionário de Desligamento</CardTitle>
        <CardDescription>
          Preencha o questionário de desligamento para funcionários que foram desligados
          {tipoDesligamento === "gestor" ? " pela empresa" : " por iniciativa própria"}
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
        ) : filteredDesligamentos.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Nenhum desligamento encontrado
          </div>
        ) : (
          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Gestor</TableHead>
                  <TableHead>Data Desligamento</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDesligamentos.map((desligamento) => (
                  <TableRow key={desligamento.id} data-testid={`row-desligamento-${desligamento.id}`}>
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
                        onClick={() => handleAbrirQuestionario(desligamento.id, desligamento.funcionarioNome)}
                        data-testid={`button-abrir-questionario-${desligamento.id}`}
                      >
                        Preencher Questionário
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={questionarioDialogOpen} onOpenChange={setQuestionarioDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Questionário de Desligamento</DialogTitle>
            <DialogDescription>
              {selectedDesligamento?.funcionarioNome && (
                <>Respondendo questionário para: {selectedDesligamento.funcionarioNome}</>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedDesligamento && (
            <QuestionarioDesligamentoForm
              desligamentoId={selectedDesligamento.id}
              tipoDesligamento={tipoDesligamento}
              onSuccess={handleQuestionarioSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
