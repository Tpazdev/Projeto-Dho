import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileText, Settings } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { EnviarFormularioExperiencia } from "@/components/EnviarFormularioExperiencia";
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
  const { data: allFormularios = [], isLoading } = useQuery<FormularioExperienciaItem[]>({
    queryKey: ["/api/formularios-experiencia"],
  });

  const formularios = periodo 
    ? allFormularios.filter(f => f.periodo === periodo)
    : allFormularios;

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
        {usuario?.role === "admin" && (
          <Link href="/formularios-experiencia/configuracao">
            <Button variant="outline" data-testid="button-configurar-perguntas">
              <Settings className="w-4 h-4 mr-2" />
              Configurar Perguntas
            </Button>
          </Link>
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
