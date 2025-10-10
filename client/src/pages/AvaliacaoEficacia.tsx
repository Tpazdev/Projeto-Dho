import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "wouter";

type TreinamentoComParticipantes = {
  id: number;
  titulo: string;
  tipo: string;
  dataInicio: string;
  dataFim: string;
  status: string;
  gestorNome: string | null;
  totalParticipantes: number;
  participantesAvaliados: number;
};

export default function AvaliacaoEficacia() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: treinamentos = [], isLoading } = useQuery<TreinamentoComParticipantes[]>({
    queryKey: ["/api/treinamentos"],
  });

  // Filtrar apenas treinamentos concluídos
  const treinamentosConcluidos = treinamentos.filter((t) => t.status === "concluido");

  // Filtrar por termo de busca
  const treinamentosFiltrados = treinamentosConcluidos.filter((treinamento) =>
    treinamento.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTipoLabel = (tipo: string) => {
    const tipos = {
      onboarding: "Onboarding",
      tecnico: "Técnico",
      comportamental: "Comportamental",
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  };

  const getStatusBadge = (participantesAvaliados: number, totalParticipantes: number) => {
    if (totalParticipantes === 0) return null;
    
    const percentual = (participantesAvaliados / totalParticipantes) * 100;
    
    if (percentual === 100) {
      return <Badge variant="default" className="bg-green-500">Completo</Badge>;
    } else if (percentual > 0) {
      return <Badge variant="secondary">Parcial ({participantesAvaliados}/{totalParticipantes})</Badge>;
    } else {
      return <Badge variant="destructive">Pendente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Avaliação de Eficácia de Treinamento</h1>
        <p className="text-muted-foreground mt-1">
          Avalie a eficácia dos treinamentos concluídos através das avaliações dos participantes
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Treinamentos Concluídos</CardTitle>
          <CardDescription>
            Lista de treinamentos concluídos disponíveis para avaliação de eficácia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar treinamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-buscar-treinamento"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">Carregando...</div>
          ) : treinamentosFiltrados.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {treinamentosConcluidos.length === 0 
                ? "Nenhum treinamento concluído encontrado"
                : "Nenhum treinamento encontrado com esse termo de busca"}
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Gestor</TableHead>
                    <TableHead>Avaliações</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {treinamentosFiltrados.map((treinamento) => (
                    <TableRow key={treinamento.id} data-testid={`row-treinamento-${treinamento.id}`}>
                      <TableCell>{treinamento.id}</TableCell>
                      <TableCell className="font-medium">{treinamento.titulo}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getTipoLabel(treinamento.tipo)}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(treinamento.dataInicio), "dd/MM/yyyy", { locale: ptBR })} -{" "}
                        {format(new Date(treinamento.dataFim), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>{treinamento.gestorNome || "N/A"}</TableCell>
                      <TableCell>
                        {getStatusBadge(treinamento.participantesAvaliados || 0, treinamento.totalParticipantes || 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/treinamentos/${treinamento.id}`}>
                          <Button size="sm" variant="outline" data-testid={`button-avaliar-${treinamento.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-lg">Sobre a Avaliação de Eficácia</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            A avaliação de eficácia permite analisar os resultados dos treinamentos concluídos:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
            <li>Visualize as notas e feedback dos participantes</li>
            <li>Acompanhe o percentual de avaliações completadas</li>
            <li>Identifique pontos de melhoria nos treinamentos</li>
            <li>Gere relatórios de efetividade</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
