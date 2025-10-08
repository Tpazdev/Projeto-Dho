import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Clock, Users, Plus, Trash2, CheckCircle, XCircle, Loader2 } from "lucide-react";

type TreinamentoDetalhes = {
  id: number;
  titulo: string;
  tipo: string;
  descricao: string | null;
  gestorId: number;
  gestorNome: string | null;
  dataInicio: string;
  dataFim: string;
  cargaHoraria: number | null;
  status: string;
};

type ParticipanteItem = {
  id: number;
  treinamentoId: number;
  funcionarioId: number;
  funcionarioNome: string | null;
  funcionarioCargo: string | null;
  status: string;
  dataInscricao: string;
  dataConclusao: string | null;
  avaliacaoNota: number | null;
  observacoes: string | null;
};

const participanteSchema = z.object({
  funcionarioId: z.coerce.number().min(1, "Funcionário obrigatório"),
  status: z.enum(["inscrito", "em_progresso", "concluido", "reprovado"]).default("inscrito"),
});

const avaliacaoSchema = z.object({
  status: z.enum(["concluido", "reprovado"]),
  avaliacaoNota: z.coerce.number().min(0).max(10).optional(),
  observacoes: z.string().optional(),
  dataConclusao: z.string(),
});

export default function TreinamentoDetalhes() {
  const [, params] = useRoute("/treinamentos/:id");
  const [, setLocation] = useLocation();
  const [dialogAddOpen, setDialogAddOpen] = useState(false);
  const [avaliarDialogOpen, setAvaliarDialogOpen] = useState(false);
  const [selectedParticipante, setSelectedParticipante] = useState<ParticipanteItem | null>(null);
  const { toast } = useToast();
  const id = params?.id ? parseInt(params.id) : null;

  const { data: treinamento } = useQuery<TreinamentoDetalhes>({
    queryKey: ["/api/treinamentos", id],
    enabled: !!id,
  });

  const { data: participantes = [] } = useQuery<ParticipanteItem[]>({
    queryKey: ["/api/treinamentos", id, "participantes"],
    enabled: !!id,
  });

  const { data: funcionarios = [] } = useQuery<{ id: number; nome: string; cargo: string | null }[]>({
    queryKey: ["/api/funcionarios"],
  });

  const formAdd = useForm({
    resolver: zodResolver(participanteSchema),
    defaultValues: {
      funcionarioId: 0,
      status: "inscrito" as const,
    },
  });

  const formAvaliacao = useForm({
    resolver: zodResolver(avaliacaoSchema),
    defaultValues: {
      status: "concluido" as const,
      avaliacaoNota: 0,
      observacoes: "",
      dataConclusao: new Date().toISOString().split("T")[0],
    },
  });

  const addParticipanteMutation = useMutation({
    mutationFn: async (data: { funcionarioId: number; status: string }) => {
      return await apiRequest("POST", `/api/treinamentos/${id}/participantes`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/treinamentos", id, "participantes"] });
      toast({
        title: "Sucesso!",
        description: "Participante adicionado com sucesso",
      });
      setDialogAddOpen(false);
      formAdd.reset();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o participante",
        variant: "destructive",
      });
    },
  });

  const avaliarMutation = useMutation({
    mutationFn: async (data: { status: string; avaliacaoNota?: number; observacoes?: string; dataConclusao: string }) => {
      if (!selectedParticipante) throw new Error("Nenhum participante selecionado");
      return await apiRequest("PATCH", `/api/participantes/${selectedParticipante.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/treinamentos", id, "participantes"] });
      toast({
        title: "Sucesso!",
        description: "Avaliação salva com sucesso",
      });
      setAvaliarDialogOpen(false);
      setSelectedParticipante(null);
      formAvaliacao.reset();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a avaliação",
        variant: "destructive",
      });
    },
  });

  const removeParticipanteMutation = useMutation({
    mutationFn: async (participanteId: number) => {
      return await apiRequest("DELETE", `/api/participantes/${participanteId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/treinamentos", id, "participantes"] });
      toast({
        title: "Sucesso!",
        description: "Participante removido com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível remover o participante",
        variant: "destructive",
      });
    },
  });

  const handleAddParticipante = (data: { funcionarioId: number; status: string }) => {
    addParticipanteMutation.mutate(data);
  };

  const handleAvaliar = (participante: ParticipanteItem) => {
    setSelectedParticipante(participante);
    formAvaliacao.setValue("status", "concluido");
    formAvaliacao.setValue("avaliacaoNota", participante.avaliacaoNota || 0);
    formAvaliacao.setValue("observacoes", participante.observacoes || "");
    formAvaliacao.setValue("dataConclusao", new Date().toISOString().split("T")[0]);
    setAvaliarDialogOpen(true);
  };

  const handleSaveAvaliacao = (data: any) => {
    avaliarMutation.mutate(data);
  };

  const getTipoLabel = (tipo: string) => {
    const tipos = {
      onboarding: "Onboarding",
      tecnico: "Técnico",
      comportamental: "Comportamental",
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  };

  const getStatusLabel = (status: string) => {
    const statusMap = {
      inscrito: "Inscrito",
      em_progresso: "Em Progresso",
      concluido: "Concluído",
      reprovado: "Reprovado",
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusBadgeColor = (status: string) => {
    const cores = {
      inscrito: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      em_progresso: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      concluido: "bg-green-500/10 text-green-500 border-green-500/20",
      reprovado: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return cores[status as keyof typeof cores] || "";
  };

  if (!id || !treinamento) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setLocation("/treinamentos")} data-testid="button-voltar">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Treinamento não encontrado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => setLocation("/treinamentos")} data-testid="button-voltar">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <Card data-testid="card-treinamento-info">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl">{treinamento.titulo}</CardTitle>
              <CardDescription className="mt-2">
                {getTipoLabel(treinamento.tipo)} • Gestor: {treinamento.gestorNome}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <span className="font-semibold">Período:</span>
                <p>
                  {new Date(treinamento.dataInicio).toLocaleDateString("pt-BR")}
                  {" - "}
                  {new Date(treinamento.dataFim).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
            {treinamento.cargaHoraria && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <span className="font-semibold">Carga Horária:</span>
                  <p>{treinamento.cargaHoraria}h</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <span className="font-semibold">Participantes:</span>
                <p>{participantes.length}</p>
              </div>
            </div>
          </div>
          {treinamento.descricao && (
            <div>
              <p className="text-sm font-semibold mb-1">Descrição:</p>
              <p className="text-sm text-muted-foreground">{treinamento.descricao}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold" data-testid="text-participantes-title">
            Participantes
          </h2>
          <Dialog open={dialogAddOpen} onOpenChange={setDialogAddOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-adicionar-participante">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Participante
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Participante</DialogTitle>
                <DialogDescription>Selecione o funcionário para inscrever no treinamento</DialogDescription>
              </DialogHeader>
              <Form {...formAdd}>
                <form onSubmit={formAdd.handleSubmit(handleAddParticipante)} className="space-y-4">
                  <FormField
                    control={formAdd.control}
                    name="funcionarioId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funcionário</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger data-testid="select-funcionario">
                              <SelectValue placeholder="Selecione o funcionário" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {funcionarios
                              .filter(
                                (f) => !participantes.some((p) => p.funcionarioId === f.id)
                              )
                              .map((func) => (
                                <SelectItem
                                  key={func.id}
                                  value={func.id.toString()}
                                  data-testid={`option-funcionario-${func.id}`}
                                >
                                  {func.nome} {func.cargo && `- ${func.cargo}`}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogAddOpen(false)}
                      data-testid="button-cancelar-add"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={addParticipanteMutation.isPending} data-testid="button-confirmar-add">
                      {addParticipanteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Adicionar
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {participantes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground" data-testid="text-empty-participantes">
                Nenhum participante inscrito
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {participantes.map((participante) => (
              <Card key={participante.id} data-testid={`card-participante-${participante.id}`}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-semibold">{participante.funcionarioNome}</p>
                        <Badge variant="outline" className={getStatusBadgeColor(participante.status)}>
                          {getStatusLabel(participante.status)}
                        </Badge>
                      </div>
                      {participante.funcionarioCargo && (
                        <p className="text-sm text-muted-foreground mt-1">{participante.funcionarioCargo}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Inscrito em: {new Date(participante.dataInscricao).toLocaleDateString("pt-BR")}
                      </p>
                      {participante.dataConclusao && (
                        <p className="text-xs text-muted-foreground">
                          Concluído em: {new Date(participante.dataConclusao).toLocaleDateString("pt-BR")}
                        </p>
                      )}
                      {participante.avaliacaoNota !== null && (
                        <p className="text-sm mt-1">
                          <span className="font-semibold">Nota:</span> {participante.avaliacaoNota}/10
                        </p>
                      )}
                      {participante.observacoes && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {participante.observacoes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {participante.status !== "concluido" && participante.status !== "reprovado" && (
                        <Button
                          size="sm"
                          onClick={() => handleAvaliar(participante)}
                          data-testid={`button-avaliar-${participante.id}`}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Avaliar
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeParticipanteMutation.mutate(participante.id)}
                        disabled={removeParticipanteMutation.isPending}
                        data-testid={`button-remover-${participante.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={avaliarDialogOpen} onOpenChange={setAvaliarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Avaliar Participante</DialogTitle>
            <DialogDescription>
              Registre a conclusão e avaliação de {selectedParticipante?.funcionarioNome}
            </DialogDescription>
          </DialogHeader>
          <Form {...formAvaliacao}>
            <form onSubmit={formAvaliacao.handleSubmit(handleSaveAvaliacao)} className="space-y-4">
              <FormField
                control={formAvaliacao.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resultado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-resultado">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="concluido" data-testid="option-concluido">Aprovado/Concluído</SelectItem>
                        <SelectItem value="reprovado" data-testid="option-reprovado">Reprovado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formAvaliacao.control}
                name="avaliacaoNota"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nota (0-10)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="10" {...field} data-testid="input-nota" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formAvaliacao.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-[80px]" data-testid="textarea-observacoes-avaliacao" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAvaliarDialogOpen(false)}
                  data-testid="button-cancelar-avaliacao"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={avaliarMutation.isPending} data-testid="button-salvar-avaliacao">
                  {avaliarMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar Avaliação
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
