import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertPdiMetaSchema, insertPdiCompetenciaSchema, insertPdiAcaoSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { ArrowLeft, Plus, Calendar, CheckCircle, XCircle, TrendingUp, Target, Lightbulb, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const metaFormSchema = insertPdiMetaSchema.extend({
  descricao: z.string().min(1, "Descrição é obrigatória"),
  prazo: z.string(),
  status: z.string().default("pendente"),
});

const competenciaFormSchema = insertPdiCompetenciaSchema.extend({
  competencia: z.string().min(1, "Competência é obrigatória"),
  nivelAtual: z.number().min(1).max(10),
  nivelDesejado: z.number().min(1).max(10),
});

const acaoFormSchema = insertPdiAcaoSchema.extend({
  acao: z.string().min(1, "Ação é obrigatória"),
  tipo: z.string().min(1, "Tipo é obrigatório"),
  prazo: z.string(),
  status: z.string().default("pendente"),
});

const statusLabels = {
  em_elaboracao: "Em Elaboração",
  em_andamento: "Em Andamento",
  concluido: "Concluído",
  cancelado: "Cancelado",
  pendente: "Pendente",
  em_progresso: "Em Progresso",
};

const statusColors = {
  em_elaboracao: "bg-yellow-500",
  em_andamento: "bg-blue-500",
  concluido: "bg-green-500",
  cancelado: "bg-gray-500",
  pendente: "bg-yellow-500",
  em_progresso: "bg-blue-500",
};

export default function PDIDetalhes() {
  const { id } = useParams();
  const { toast } = useToast();
  const [openMetaDialog, setOpenMetaDialog] = useState(false);
  const [openCompetenciaDialog, setOpenCompetenciaDialog] = useState(false);
  const [openAcaoDialog, setOpenAcaoDialog] = useState(false);

  const { data: pdi, isLoading } = useQuery<any>({
    queryKey: ["/api/pdis", id],
    queryFn: async () => {
      const res = await fetch(`/api/pdis/${id}`);
      if (!res.ok) throw new Error("PDI não encontrado");
      return res.json();
    },
  });

  const { data: metas = [] } = useQuery<any[]>({
    queryKey: ["/api/pdis", id, "metas"],
    queryFn: async () => {
      const res = await fetch(`/api/pdis/${id}/metas`);
      return res.json();
    },
    enabled: !!id,
  });

  const { data: competencias = [] } = useQuery<any[]>({
    queryKey: ["/api/pdis", id, "competencias"],
    queryFn: async () => {
      const res = await fetch(`/api/pdis/${id}/competencias`);
      return res.json();
    },
    enabled: !!id,
  });

  const { data: acoes = [] } = useQuery<any[]>({
    queryKey: ["/api/pdis", id, "acoes"],
    queryFn: async () => {
      const res = await fetch(`/api/pdis/${id}/acoes`);
      return res.json();
    },
    enabled: !!id,
  });

  const metaForm = useForm<z.infer<typeof metaFormSchema>>({
    resolver: zodResolver(metaFormSchema),
    defaultValues: {
      descricao: "",
      prazo: "",
      status: "pendente",
      resultado: "",
    },
  });

  const competenciaForm = useForm<z.infer<typeof competenciaFormSchema>>({
    resolver: zodResolver(competenciaFormSchema),
    defaultValues: {
      competencia: "",
      nivelAtual: 1,
      nivelDesejado: 10,
      observacoes: "",
    },
  });

  const acaoForm = useForm<z.infer<typeof acaoFormSchema>>({
    resolver: zodResolver(acaoFormSchema),
    defaultValues: {
      acao: "",
      tipo: "",
      prazo: "",
      status: "pendente",
      resultado: "",
    },
  });

  const onSubmitMeta = async (data: z.infer<typeof metaFormSchema>) => {
    try {
      await apiRequest(`/api/pdis/${id}/metas`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      await queryClient.invalidateQueries({ queryKey: ["/api/pdis", id, "metas"] });
      toast({ title: "Sucesso", description: "Meta adicionada com sucesso" });
      setOpenMetaDialog(false);
      metaForm.reset();
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Erro ao adicionar meta" });
    }
  };

  const onSubmitCompetencia = async (data: z.infer<typeof competenciaFormSchema>) => {
    try {
      await apiRequest(`/api/pdis/${id}/competencias`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      await queryClient.invalidateQueries({ queryKey: ["/api/pdis", id, "competencias"] });
      toast({ title: "Sucesso", description: "Competência adicionada com sucesso" });
      setOpenCompetenciaDialog(false);
      competenciaForm.reset();
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Erro ao adicionar competência" });
    }
  };

  const onSubmitAcao = async (data: z.infer<typeof acaoFormSchema>) => {
    try {
      await apiRequest(`/api/pdis/${id}/acoes`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      await queryClient.invalidateQueries({ queryKey: ["/api/pdis", id, "acoes"] });
      toast({ title: "Sucesso", description: "Ação adicionada com sucesso" });
      setOpenAcaoDialog(false);
      acaoForm.reset();
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Erro ao adicionar ação" });
    }
  };

  const handleUpdateStatus = async (type: "meta" | "competencia" | "acao", itemId: number, newStatus: string) => {
    try {
      const endpoint = type === "meta" ? `/api/pdi-metas/${itemId}` : 
                      type === "competencia" ? `/api/pdi-competencias/${itemId}` :
                      `/api/pdi-acoes/${itemId}`;
      
      await apiRequest(endpoint, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
        headers: { "Content-Type": "application/json" },
      });

      await queryClient.invalidateQueries({ queryKey: ["/api/pdis", id, type === "meta" ? "metas" : type === "competencia" ? "competencias" : "acoes"] });
      toast({ title: "Sucesso", description: "Status atualizado" });
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Erro ao atualizar status" });
    }
  };

  const handleDelete = async (type: "meta" | "competencia" | "acao", itemId: number) => {
    try {
      const endpoint = type === "meta" ? `/api/pdi-metas/${itemId}` : 
                      type === "competencia" ? `/api/pdi-competencias/${itemId}` :
                      `/api/pdi-acoes/${itemId}`;
      
      await apiRequest(endpoint, {
        method: "DELETE",
      });

      await queryClient.invalidateQueries({ queryKey: ["/api/pdis", id, type === "meta" ? "metas" : type === "competencia" ? "competencias" : "acoes"] });
      toast({ title: "Sucesso", description: `${type === "meta" ? "Meta" : type === "competencia" ? "Competência" : "Ação"} removida` });
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Erro ao remover item" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!pdi) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">PDI não encontrado</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/pdi">
            <Button variant="outline" size="icon" data-testid="button-voltar">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold" data-testid="text-page-title">
              PDI - {pdi.funcionarioNome}
            </h1>
            <p className="text-muted-foreground mt-1">
              {pdi.funcionarioCargo && `${pdi.funcionarioCargo} • `}
              Gestor: {pdi.gestorNome}
            </p>
          </div>
          <Badge className={statusColors[pdi.status as keyof typeof statusColors]}>
            {statusLabels[pdi.status as keyof typeof statusLabels]}
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do PDI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>
                Período: {format(new Date(pdi.dataInicio), "dd/MM/yyyy", { locale: ptBR })} -{" "}
                {format(new Date(pdi.dataFim), "dd/MM/yyyy", { locale: ptBR })}
              </span>
            </div>
            {pdi.observacoes && (
              <div className="pt-2">
                <p className="text-sm font-medium">Observações:</p>
                <p className="text-sm text-muted-foreground">{pdi.observacoes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="metas" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="metas" data-testid="tab-metas">
              <Target className="w-4 h-4 mr-2" />
              Metas ({metas.length})
            </TabsTrigger>
            <TabsTrigger value="competencias" data-testid="tab-competencias">
              <TrendingUp className="w-4 h-4 mr-2" />
              Competências ({competencias.length})
            </TabsTrigger>
            <TabsTrigger value="acoes" data-testid="tab-acoes">
              <Lightbulb className="w-4 h-4 mr-2" />
              Ações ({acoes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="metas" className="space-y-4 mt-4">
            <div className="flex justify-end">
              <Dialog open={openMetaDialog} onOpenChange={setOpenMetaDialog}>
                <DialogTrigger asChild>
                  <Button data-testid="button-adicionar-meta">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Meta
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Meta</DialogTitle>
                  </DialogHeader>
                  <Form {...metaForm}>
                    <form onSubmit={metaForm.handleSubmit(onSubmitMeta)} className="space-y-4">
                      <FormField
                        control={metaForm.control}
                        name="descricao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição da Meta</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Descreva a meta" data-testid="textarea-meta-descricao" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={metaForm.control}
                        name="prazo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prazo</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} data-testid="input-meta-prazo" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={metaForm.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-meta-status">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="pendente">Pendente</SelectItem>
                                <SelectItem value="em_progresso">Em Progresso</SelectItem>
                                <SelectItem value="concluido">Concluído</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpenMetaDialog(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" data-testid="button-salvar-meta">Adicionar</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {metas.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhuma meta cadastrada ainda.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {metas.map((meta: any) => (
                  <Card key={meta.id} data-testid={`card-meta-${meta.id}`}>
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-medium">{meta.descricao}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>
                              Prazo: {format(new Date(meta.prazo), "dd/MM/yyyy", { locale: ptBR })}
                            </span>
                            <Badge className={statusColors[meta.status as keyof typeof statusColors]} variant="secondary">
                              {statusLabels[meta.status as keyof typeof statusLabels]}
                            </Badge>
                          </div>
                          {meta.resultado && (
                            <p className="text-sm text-muted-foreground mt-2">Resultado: {meta.resultado}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {meta.status !== "concluido" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus("meta", meta.id, "concluido")}
                              data-testid={`button-concluir-meta-${meta.id}`}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete("meta", meta.id)}
                            data-testid={`button-deletar-meta-${meta.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="competencias" className="space-y-4 mt-4">
            <div className="flex justify-end">
              <Dialog open={openCompetenciaDialog} onOpenChange={setOpenCompetenciaDialog}>
                <DialogTrigger asChild>
                  <Button data-testid="button-adicionar-competencia">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Competência
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Competência</DialogTitle>
                  </DialogHeader>
                  <Form {...competenciaForm}>
                    <form onSubmit={competenciaForm.handleSubmit(onSubmitCompetencia)} className="space-y-4">
                      <FormField
                        control={competenciaForm.control}
                        name="competencia"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Competência</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Nome da competência" data-testid="input-competencia" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={competenciaForm.control}
                          name="nivelAtual"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nível Atual (1-10)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  max="10"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  data-testid="input-nivel-atual"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={competenciaForm.control}
                          name="nivelDesejado"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nível Desejado (1-10)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  max="10"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  data-testid="input-nivel-desejado"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={competenciaForm.control}
                        name="observacoes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observações</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Observações sobre a competência"
                                value={field.value || ""}
                                data-testid="textarea-competencia-obs"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpenCompetenciaDialog(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" data-testid="button-salvar-competencia">Adicionar</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {competencias.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhuma competência cadastrada ainda.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {competencias.map((comp: any) => (
                  <Card key={comp.id} data-testid={`card-competencia-${comp.id}`}>
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-medium">{comp.competencia}</p>
                          <div className="flex items-center gap-6 mt-2">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Atual:</span>{" "}
                              <span className="font-medium">{comp.nivelAtual}/10</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Desejado:</span>{" "}
                              <span className="font-medium">{comp.nivelDesejado}/10</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Gap:</span>{" "}
                              <span className="font-medium text-blue-600">
                                {comp.nivelDesejado - comp.nivelAtual}
                              </span>
                            </div>
                          </div>
                          {comp.observacoes && (
                            <p className="text-sm text-muted-foreground mt-2">{comp.observacoes}</p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete("competencia", comp.id)}
                          data-testid={`button-deletar-competencia-${comp.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="acoes" className="space-y-4 mt-4">
            <div className="flex justify-end">
              <Dialog open={openAcaoDialog} onOpenChange={setOpenAcaoDialog}>
                <DialogTrigger asChild>
                  <Button data-testid="button-adicionar-acao">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Ação
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Ação</DialogTitle>
                  </DialogHeader>
                  <Form {...acaoForm}>
                    <form onSubmit={acaoForm.handleSubmit(onSubmitAcao)} className="space-y-4">
                      <FormField
                        control={acaoForm.control}
                        name="acao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição da Ação</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Descreva a ação" data-testid="textarea-acao" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={acaoForm.control}
                        name="tipo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-acao-tipo">
                                  <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="treinamento">Treinamento</SelectItem>
                                <SelectItem value="mentoria">Mentoria</SelectItem>
                                <SelectItem value="projeto">Projeto Prático</SelectItem>
                                <SelectItem value="leitura">Leitura/Estudo</SelectItem>
                                <SelectItem value="curso">Curso</SelectItem>
                                <SelectItem value="outro">Outro</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={acaoForm.control}
                        name="prazo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prazo</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} data-testid="input-acao-prazo" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={acaoForm.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-acao-status">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="pendente">Pendente</SelectItem>
                                <SelectItem value="em_progresso">Em Progresso</SelectItem>
                                <SelectItem value="concluido">Concluído</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpenAcaoDialog(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" data-testid="button-salvar-acao">Adicionar</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {acoes.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Lightbulb className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhuma ação cadastrada ainda.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {acoes.map((acao: any) => (
                  <Card key={acao.id} data-testid={`card-acao-${acao.id}`}>
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-medium">{acao.acao}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <Badge variant="outline">{acao.tipo}</Badge>
                            <span>
                              Prazo: {format(new Date(acao.prazo), "dd/MM/yyyy", { locale: ptBR })}
                            </span>
                            <Badge className={statusColors[acao.status as keyof typeof statusColors]} variant="secondary">
                              {statusLabels[acao.status as keyof typeof statusLabels]}
                            </Badge>
                          </div>
                          {acao.resultado && (
                            <p className="text-sm text-muted-foreground mt-2">Resultado: {acao.resultado}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {acao.status !== "concluido" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus("acao", acao.id, "concluido")}
                              data-testid={`button-concluir-acao-${acao.id}`}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete("acao", acao.id)}
                            data-testid={`button-deletar-acao-${acao.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
