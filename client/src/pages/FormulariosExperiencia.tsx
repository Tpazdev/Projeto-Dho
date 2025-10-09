import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, AlertCircle, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { EnviarFormularioExperiencia } from "@/components/EnviarFormularioExperiencia";

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
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
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
      </div>

      {pendentes.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" data-testid="text-section-pendentes">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Pendentes ({pendentes.length})
          </h2>
          <div className="space-y-4">
            {pendentes.map((formulario) => {
              const vencido = isVencido(formulario.dataLimite);
              
              return (
                <Card
                  key={formulario.id}
                  className={vencido ? "border-red-500/50" : ""}
                  data-testid={`card-formulario-${formulario.id}`}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{formulario.funcionarioNome}</CardTitle>
                      {getStatusBadge(formulario.status)}
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Gestor: {formulario.gestorNome}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className={vencido ? "text-red-500 font-semibold" : ""}>
                        {vencido ? "Vencido em " : "Prazo: "}
                        {format(new Date(formulario.dataLimite), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>

                    <EnviarFormularioExperiencia
                      formularioId={formulario.id}
                      gestorNome={formulario.gestorNome}
                      funcionarioNome={formulario.funcionarioNome}
                      periodo={formulario.periodo}
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {preenchidos.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4" data-testid="text-section-preenchidos">
            Preenchidos ({preenchidos.length})
          </h2>
          <div className="space-y-4">
            {preenchidos.map((formulario) => {
              return (
                <Card key={formulario.id} data-testid={`card-formulario-${formulario.id}`}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{formulario.funcionarioNome}</CardTitle>
                      {getStatusBadge(formulario.status)}
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Gestor: {formulario.gestorNome}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Preenchido em:{" "}
                        {formulario.dataPreenchimento
                          ? format(new Date(formulario.dataPreenchimento), "dd/MM/yyyy", { locale: ptBR })
                          : "-"}
                      </span>
                    </div>
                    {formulario.desempenho && (
                      <div className="text-sm">
                        <span className="font-semibold">Desempenho: </span>
                        {formulario.desempenho}/10
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
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
