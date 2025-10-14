import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Edit, MoveUp, MoveDown, Settings } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { QuestionarioDesligamento, PerguntaDesligamento } from "@shared/schema";

interface GerenciarPerguntasQuestionarioProps {
  tipoDesligamento: "funcionario" | "gestor";
}

const perguntaFormSchema = z.object({
  pergunta: z.string().min(1, "Pergunta é obrigatória"),
  tipo: z.enum(["texto_livre", "multipla_escolha", "escala"]),
  opcoes: z.string().optional(),
  obrigatoria: z.boolean().default(true),
  ordem: z.number().min(1),
});

type PerguntaFormData = z.infer<typeof perguntaFormSchema>;

export function GerenciarPerguntasQuestionario({ tipoDesligamento }: GerenciarPerguntasQuestionarioProps) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPergunta, setEditingPergunta] = useState<PerguntaDesligamento | null>(null);

  const { data: questionarios = [] } = useQuery<QuestionarioDesligamento[]>({
    queryKey: ["/api/questionarios-desligamento"],
  });

  const questionarioAtivo = questionarios.find(
    (q) => q.ativo === 1 && q.tipoDesligamento === tipoDesligamento
  );

  const { data: perguntas = [] } = useQuery<PerguntaDesligamento[]>({
    queryKey: ["/api/questionarios-desligamento", questionarioAtivo?.id, "perguntas"],
    enabled: !!questionarioAtivo,
  });

  const form = useForm<PerguntaFormData>({
    resolver: zodResolver(perguntaFormSchema),
    defaultValues: {
      pergunta: "",
      tipo: "texto_livre",
      opcoes: "",
      obrigatoria: true,
      ordem: (perguntas?.length || 0) + 1,
    },
  });

  const criarQuestionarioMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/questionarios-desligamento", {
        titulo: `Questionário de Desligamento - ${tipoDesligamento === "gestor" ? "Empresa" : "Colaborador"}`,
        descricao: "Questionário padrão de desligamento",
        tipoDesligamento,
        ativo: 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questionarios-desligamento"] });
      toast({
        title: "Sucesso",
        description: "Questionário criado com sucesso",
      });
    },
  });

  const adicionarPerguntaMutation = useMutation({
    mutationFn: async (data: PerguntaFormData) => {
      if (!questionarioAtivo) throw new Error("Questionário não encontrado");
      
      const payload = {
        questionarioId: questionarioAtivo.id,
        pergunta: data.pergunta,
        tipo: data.tipo,
        opcoes: data.tipo === "multipla_escolha" && data.opcoes 
          ? data.opcoes.split("\n").map(o => o.trim()).filter(o => o) 
          : null,
        obrigatoria: data.obrigatoria ? 1 : 0,
        ordem: data.ordem,
      };
      
      return await apiRequest("POST", `/api/questionarios-desligamento/${questionarioAtivo.id}/perguntas`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/questionarios-desligamento", questionarioAtivo?.id, "perguntas"] 
      });
      toast({
        title: "Sucesso",
        description: "Pergunta adicionada com sucesso",
      });
      setDialogOpen(false);
      form.reset({
        pergunta: "",
        tipo: "texto_livre",
        opcoes: "",
        obrigatoria: true,
        ordem: (perguntas?.length || 0) + 1,
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível adicionar a pergunta",
      });
    },
  });

  const editarPerguntaMutation = useMutation({
    mutationFn: async (data: PerguntaFormData & { id: number }) => {
      const payload = {
        pergunta: data.pergunta,
        tipo: data.tipo,
        opcoes: data.tipo === "multipla_escolha" && data.opcoes 
          ? data.opcoes.split("\n").map(o => o.trim()).filter(o => o) 
          : null,
        obrigatoria: data.obrigatoria ? 1 : 0,
        ordem: data.ordem,
      };
      
      return await apiRequest("PATCH", `/api/perguntas-desligamento/${data.id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/questionarios-desligamento", questionarioAtivo?.id, "perguntas"] 
      });
      toast({
        title: "Sucesso",
        description: "Pergunta atualizada com sucesso",
      });
      setDialogOpen(false);
      setEditingPergunta(null);
      form.reset();
    },
  });

  const deletarPerguntaMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/perguntas-desligamento/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/questionarios-desligamento", questionarioAtivo?.id, "perguntas"] 
      });
      toast({
        title: "Sucesso",
        description: "Pergunta deletada com sucesso",
      });
    },
  });

  const reordenarPerguntaMutation = useMutation({
    mutationFn: async ({ id, novaOrdem }: { id: number; novaOrdem: number }) => {
      return await apiRequest("PATCH", `/api/perguntas-desligamento/${id}`, {
        ordem: novaOrdem,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/questionarios-desligamento", questionarioAtivo?.id, "perguntas"] 
      });
    },
  });

  const onSubmit = (data: PerguntaFormData) => {
    if (editingPergunta) {
      editarPerguntaMutation.mutate({ ...data, id: editingPergunta.id });
    } else {
      adicionarPerguntaMutation.mutate(data);
    }
  };

  const handleEdit = (pergunta: PerguntaDesligamento) => {
    setEditingPergunta(pergunta);
    form.reset({
      pergunta: pergunta.pergunta,
      tipo: pergunta.tipo as "texto_livre" | "multipla_escolha" | "escala",
      opcoes: pergunta.opcoes?.join("\n") || "",
      obrigatoria: pergunta.obrigatoria === 1,
      ordem: pergunta.ordem,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja deletar esta pergunta?")) {
      deletarPerguntaMutation.mutate(id);
    }
  };

  const handleMoveUp = (pergunta: PerguntaDesligamento) => {
    const sorted = [...perguntas].sort((a, b) => a.ordem - b.ordem);
    const currentIndex = sorted.findIndex(p => p.id === pergunta.id);
    if (currentIndex > 0) {
      const previousPergunta = sorted[currentIndex - 1];
      reordenarPerguntaMutation.mutate({ id: pergunta.id, novaOrdem: previousPergunta.ordem });
      reordenarPerguntaMutation.mutate({ id: previousPergunta.id, novaOrdem: pergunta.ordem });
    }
  };

  const handleMoveDown = (pergunta: PerguntaDesligamento) => {
    const sorted = [...perguntas].sort((a, b) => a.ordem - b.ordem);
    const currentIndex = sorted.findIndex(p => p.id === pergunta.id);
    if (currentIndex < sorted.length - 1) {
      const nextPergunta = sorted[currentIndex + 1];
      reordenarPerguntaMutation.mutate({ id: pergunta.id, novaOrdem: nextPergunta.ordem });
      reordenarPerguntaMutation.mutate({ id: nextPergunta.id, novaOrdem: pergunta.ordem });
    }
  };

  const getTipoPerguntaLabel = (tipo: string) => {
    switch (tipo) {
      case "texto_livre":
        return "Texto Livre";
      case "multipla_escolha":
        return "Múltipla Escolha";
      case "escala":
        return "Escala (1-10)";
      default:
        return tipo;
    }
  };

  if (!questionarioAtivo) {
    return (
      <Card className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-900 dark:bg-yellow-950/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <CardTitle className="text-lg">Questionário Não Configurado</CardTitle>
                <CardDescription className="mt-1">
                  Não há questionário ativo para este tipo de desligamento.
                </CardDescription>
              </div>
            </div>
            <Button 
              onClick={() => criarQuestionarioMutation.mutate()}
              disabled={criarQuestionarioMutation.isPending}
              data-testid="button-criar-questionario"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Questionário
            </Button>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg">Gerenciar Perguntas do Questionário</CardTitle>
              <CardDescription className="mt-1">
                {questionarioAtivo.titulo} - Adicione e edite perguntas livremente
              </CardDescription>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingPergunta(null);
              form.reset();
            }
          }}>
            <DialogTrigger asChild>
              <Button data-testid="button-adicionar-pergunta">
                <Plus className="h-4 w-4 mr-2" />
                Nova Pergunta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingPergunta ? "Editar Pergunta" : "Adicionar Nova Pergunta"}
                </DialogTitle>
                <DialogDescription>
                  Crie perguntas personalizadas para a entrevista de desligamento
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="pergunta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pergunta</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Digite a pergunta..."
                            className="min-h-[80px]"
                            data-testid="textarea-pergunta"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Resposta</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-tipo">
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="texto_livre">Texto Livre</SelectItem>
                            <SelectItem value="multipla_escolha">Múltipla Escolha</SelectItem>
                            <SelectItem value="escala">Escala (1-10)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Define como o funcionário responderá a pergunta
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("tipo") === "multipla_escolha" && (
                    <FormField
                      control={form.control}
                      name="opcoes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Opções (uma por linha)</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Opção 1&#10;Opção 2&#10;Opção 3"
                              className="min-h-[100px]"
                              data-testid="textarea-opcoes"
                            />
                          </FormControl>
                          <FormDescription>
                            Digite cada opção em uma linha separada
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="obrigatoria"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Pergunta Obrigatória</FormLabel>
                          <FormDescription>
                            O funcionário deve responder esta pergunta
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-obrigatoria"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setDialogOpen(false);
                        setEditingPergunta(null);
                        form.reset();
                      }}
                      data-testid="button-cancelar"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={adicionarPerguntaMutation.isPending || editarPerguntaMutation.isPending}
                      data-testid="button-salvar"
                    >
                      {editingPergunta ? "Atualizar" : "Adicionar"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {perguntas.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Nenhuma pergunta cadastrada ainda. Clique em "Nova Pergunta" para começar.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {[...perguntas]
              .sort((a, b) => a.ordem - b.ordem)
              .map((pergunta, index) => (
                <div
                  key={pergunta.id}
                  className="p-4 bg-muted/50 rounded-lg border"
                  data-testid={`pergunta-item-${index + 1}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          Pergunta {index + 1}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {getTipoPerguntaLabel(pergunta.tipo)}
                        </Badge>
                        {pergunta.obrigatoria === 1 && (
                          <Badge variant="destructive" className="text-xs">
                            Obrigatória
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium mb-2">{pergunta.pergunta}</p>
                      {pergunta.tipo === "multipla_escolha" && pergunta.opcoes && (
                        <div className="text-xs text-muted-foreground mt-2">
                          <strong>Opções:</strong> {pergunta.opcoes.join(", ")}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveUp(pergunta)}
                        disabled={index === 0}
                        data-testid={`button-move-up-${index + 1}`}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveDown(pergunta)}
                        disabled={index === perguntas.length - 1}
                        data-testid={`button-move-down-${index + 1}`}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(pergunta)}
                        data-testid={`button-edit-${index + 1}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(pergunta.id)}
                        data-testid={`button-delete-${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
