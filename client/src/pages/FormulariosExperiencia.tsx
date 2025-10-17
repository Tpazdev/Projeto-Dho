import { useQuery, useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileText, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { EnviarFormularioExperiencia } from "@/components/EnviarFormularioExperiencia";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type FormularioExperienciaItem = {
  id: number;
  funcionarioId: number;
  funcionarioNome: string;
  gestorId: number;
  gestorNome: string;
  periodo: string;
  dataLimite: string;
  status: "pendente" | "preenchido" | "aprovado" | "reprovado";
  dataPreenchimento?: string | null;
  desempenho?: number | null;
  pontosFortes?: string | null;
  pontosMelhoria?: string | null;
  recomendacao?: string | null;
  observacoes?: string | null;
};

interface FormulariosExperienciaProps {
  periodo?: string;
}

export default function FormulariosExperiencia({ periodo }: FormulariosExperienciaProps = {}) {
  const { usuario } = useAuth();
  const { toast } = useToast();
  const [dialogAberto, setDialogAberto] = useState(false);
  const [nomePergunta, setNomePergunta] = useState("");
  const [obrigatoria, setObrigatoria] = useState(true);
  
  const { data: allFormularios = [], isLoading } = useQuery<FormularioExperienciaItem[]>({
    queryKey: ["/api/formularios-experiencia"],
  });

  const { data: templates = [] } = useQuery<any[]>({
    queryKey: ["/api/templates-avaliacao-experiencia"],
  });

  const { data: campos = [] } = useQuery<any[]>({
    queryKey: ["/api/campos-avaliacao-experiencia/template", templates.find((t) => t.periodo === periodo)?.id],
    enabled: !!templates.find((t) => t.periodo === periodo),
  });

  const formularios = periodo 
    ? allFormularios.filter(f => f.periodo === periodo)
    : allFormularios;

  const adicionarPerguntaMutation = useMutation({
    mutationFn: async (data: { nome: string; obrigatoria: boolean }) => {
      const template = templates.find((t) => t.periodo === periodo);
      if (!template) {
        throw new Error("Template não encontrado para este período");
      }
      const ultimaOrdem = campos.length > 0 ? Math.max(...campos.map((c) => c.ordem)) : 0;
      return await apiRequest("POST", "/api/campos-avaliacao-experiencia", {
        templateId: template.id,
        nomeCampo: data.nome,
        tipoCampo: "texto",
        obrigatorio: data.obrigatoria ? 1 : 0,
        ordem: ultimaOrdem + 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campos-avaliacao-experiencia/template"] });
      setDialogAberto(false);
      setNomePergunta("");
      setObrigatoria(true);
      toast({
        title: "Sucesso!",
        description: "Pergunta adicionada com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pendente: { label: "Pendente", className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
      preenchido: { label: "Preenchido", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
      aprovado: { label: "Aprovado", className: "bg-green-500/10 text-green-500 border-green-500/20" },
      reprovado: { label: "Reprovado", className: "bg-red-500/10 text-red-500 border-red-500/20" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant="outline" className={config.className} data-testid={`badge-status-${status}`}>
        {config.label}
      </Badge>
    );
  };

  const isVencido = (dataLimite: string) => {
    return new Date(dataLimite) < new Date();
  };

  const getPeriodoTitulo = () => {
    if (periodo === "1") return "Formulários de Experiência - 01° Período";
    if (periodo === "2") return "Formulários de Experiência - 02° Período";
    return "Formulários de Experiência";
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold" data-testid="text-page-title">
            {getPeriodoTitulo()}
          </h1>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const pendentes = formularios.filter((f) => f.status === "pendente");
  const preenchidos = formularios.filter((f) => f.status !== "pendente");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">
            {getPeriodoTitulo()}
          </h1>
          <p className="text-muted-foreground mt-1">
            {periodo ? `Avaliações do ${periodo === "1" ? "primeiro" : "segundo"} período de experiência` : "Avaliações de período de experiência dos funcionários"}
          </p>
        </div>
        {usuario?.role === "admin" && periodo && (
          <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
            <DialogTrigger asChild>
              <Button variant="outline" data-testid="button-adicionar-pergunta">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Pergunta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Pergunta</DialogTitle>
                <DialogDescription>
                  Adicione uma pergunta de texto livre ao formulário de experiência
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pergunta">Texto da Pergunta</Label>
                  <Input
                    id="pergunta"
                    placeholder="Ex: Descreva o comportamento do funcionário"
                    value={nomePergunta}
                    onChange={(e) => setNomePergunta(e.target.value)}
                    data-testid="input-pergunta"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="obrigatoria"
                    checked={obrigatoria}
                    onCheckedChange={(checked) => setObrigatoria(checked as boolean)}
                    data-testid="checkbox-obrigatoria"
                  />
                  <Label htmlFor="obrigatoria" className="cursor-pointer">
                    Campo obrigatório
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDialogAberto(false);
                    setNomePergunta("");
                    setObrigatoria(true);
                  }}
                  data-testid="button-cancelar"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => adicionarPerguntaMutation.mutate({ nome: nomePergunta, obrigatoria })}
                  disabled={!nomePergunta.trim() || adicionarPerguntaMutation.isPending}
                  data-testid="button-salvar-pergunta"
                >
                  {adicionarPerguntaMutation.isPending ? "Salvando..." : "Adicionar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {pendentes.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" data-testid="text-section-pendentes">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Pendentes ({pendentes.length})
          </h2>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead>Nome do Funcionário</TableHead>
                  <TableHead>Nome do Gestor</TableHead>
                  <TableHead className="w-32">Período</TableHead>
                  <TableHead className="w-36">Data Limite</TableHead>
                  <TableHead className="w-32">Status</TableHead>
                  <TableHead className="w-48">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendentes.map((formulario) => {
                  const vencido = isVencido(formulario.dataLimite);
                  
                  return (
                    <TableRow
                      key={formulario.id}
                      className={vencido ? "bg-red-500/5" : ""}
                      data-testid={`row-formulario-${formulario.id}`}
                    >
                      <TableCell className="font-medium" data-testid={`text-id-${formulario.id}`}>
                        {formulario.id}
                      </TableCell>
                      <TableCell data-testid={`text-funcionario-${formulario.id}`}>
                        {formulario.funcionarioNome}
                      </TableCell>
                      <TableCell data-testid={`text-gestor-${formulario.id}`}>
                        {formulario.gestorNome}
                      </TableCell>
                      <TableCell>
                        {formulario.periodo === "1" ? "01° Período" : "02° Período"}
                      </TableCell>
                      <TableCell className={vencido ? "text-red-500 font-semibold" : ""}>
                        {format(new Date(formulario.dataLimite), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(formulario.status)}
                      </TableCell>
                      <TableCell>
                        <EnviarFormularioExperiencia
                          formularioId={formulario.id}
                          gestorNome={formulario.gestorNome}
                          funcionarioNome={formulario.funcionarioNome}
                          periodo={formulario.periodo}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {preenchidos.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4" data-testid="text-section-preenchidos">
            Preenchidos ({preenchidos.length})
          </h2>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead>Nome do Funcionário</TableHead>
                  <TableHead>Nome do Gestor</TableHead>
                  <TableHead className="w-32">Período</TableHead>
                  <TableHead className="w-36">Data Preenchimento</TableHead>
                  <TableHead className="w-32">Desempenho</TableHead>
                  <TableHead className="w-32">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preenchidos.map((formulario) => {
                  return (
                    <TableRow key={formulario.id} data-testid={`row-formulario-${formulario.id}`}>
                      <TableCell className="font-medium" data-testid={`text-id-${formulario.id}`}>
                        {formulario.id}
                      </TableCell>
                      <TableCell data-testid={`text-funcionario-${formulario.id}`}>
                        {formulario.funcionarioNome}
                      </TableCell>
                      <TableCell data-testid={`text-gestor-${formulario.id}`}>
                        {formulario.gestorNome}
                      </TableCell>
                      <TableCell>
                        {formulario.periodo === "1" ? "01° Período" : "02° Período"}
                      </TableCell>
                      <TableCell>
                        {formulario.dataPreenchimento
                          ? format(new Date(formulario.dataPreenchimento), "dd/MM/yyyy", { locale: ptBR })
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {formulario.desempenho ? `${formulario.desempenho}/10` : "-"}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(formulario.status)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {formularios.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground" data-testid="text-empty-state">
              Nenhum formulário de experiência encontrado
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
