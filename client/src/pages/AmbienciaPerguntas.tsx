import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowLeft, Trash2, MoveUp, MoveDown } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

type PerguntaClima = {
  id: number;
  pesquisaId: number;
  texto: string;
  tipo: string;
  opcoes: string[] | null;
  ordem: number;
  obrigatoria: number;
};

const perguntaSchema = z.object({
  texto: z.string().min(1, "Pergunta é obrigatória"),
  tipo: z.enum(["escala", "multipla_escolha", "texto_livre"]),
  opcoes: z.string().optional(),
  obrigatoria: z.boolean().default(true),
});

type PerguntaFormData = z.infer<typeof perguntaSchema>;

export default function AmbienciaPerguntas() {
  const { toast } = useToast();
  const [, params] = useRoute("/ambiencia/:id/perguntas");
  const pesquisaId = params?.id ? parseInt(params.id) : 0;
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: pesquisa } = useQuery({
    queryKey: ["/api/pesquisas-clima", pesquisaId],
    queryFn: () => fetch(`/api/pesquisas-clima/${pesquisaId}`).then(res => res.json()),
    enabled: !!pesquisaId,
  });

  const { data: perguntas = [], isLoading } = useQuery<PerguntaClima[]>({
    queryKey: ["/api/pesquisas-clima", pesquisaId, "perguntas"],
    queryFn: () => fetch(`/api/pesquisas-clima/${pesquisaId}/perguntas`).then(res => res.json()),
    enabled: !!pesquisaId,
  });

  const form = useForm<PerguntaFormData>({
    resolver: zodResolver(perguntaSchema),
    defaultValues: {
      texto: "",
      tipo: "escala",
      opcoes: "",
      obrigatoria: true,
    },
  });

  const tipo = form.watch("tipo");

  const createMutation = useMutation({
    mutationFn: async (data: PerguntaFormData) => {
      const payload = {
        texto: data.texto,
        tipo: data.tipo,
        opcoes: data.tipo === "multipla_escolha" && data.opcoes
          ? data.opcoes.split(",").map(o => o.trim())
          : null,
        ordem: perguntas.length + 1,
        obrigatoria: data.obrigatoria ? 1 : 0,
      };
      return await apiRequest("POST", `/api/pesquisas-clima/${pesquisaId}/perguntas`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pesquisas-clima", pesquisaId, "perguntas"] });
      toast({
        title: "Sucesso!",
        description: "Pergunta criada com sucesso",
      });
      setDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar a pergunta",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/perguntas-clima/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pesquisas-clima", pesquisaId, "perguntas"] });
      toast({
        title: "Sucesso!",
        description: "Pergunta deletada com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível deletar a pergunta",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PerguntaFormData) => {
    createMutation.mutate(data);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja deletar esta pergunta?")) {
      deleteMutation.mutate(id);
    }
  };

  const getTipoBadge = (tipo: string) => {
    const tipoConfig = {
      escala: { label: "Escala 1-10", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
      multipla_escolha: { label: "Múltipla Escolha", className: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
      texto_livre: { label: "Texto Livre", className: "bg-green-500/10 text-green-500 border-green-500/20" },
    };

    const config = tipoConfig[tipo as keyof typeof tipoConfig] || tipoConfig.escala;
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => window.location.href = "/ambiencia"}
          data-testid="button-voltar"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold" data-testid="text-page-title">
            {pesquisa?.titulo || "Perguntas da Pesquisa"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as perguntas desta pesquisa de clima
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} data-testid="button-adicionar-pergunta">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Pergunta
        </Button>
      </div>

      <div className="space-y-4">
        {perguntas.map((pergunta, index) => (
          <Card key={pergunta.id} data-testid={`card-pergunta-${pergunta.id}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-muted-foreground">#{index + 1}</span>
                    <CardTitle className="text-lg">{pergunta.texto}</CardTitle>
                  </div>
                  {pergunta.opcoes && pergunta.opcoes.length > 0 && (
                    <CardDescription className="mt-2">
                      Opções: {pergunta.opcoes.join(", ")}
                    </CardDescription>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {getTipoBadge(pergunta.tipo)}
                  {pergunta.obrigatoria === 1 && (
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                      Obrigatória
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(pergunta.id)}
                  data-testid={`button-deletar-${pergunta.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {perguntas.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-muted-foreground" data-testid="text-empty-state">
              Nenhuma pergunta criada ainda
            </p>
            <Button onClick={() => setDialogOpen(true)} className="mt-4" data-testid="button-criar-primeira">
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Pergunta
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Pergunta</DialogTitle>
            <DialogDescription>
              Adicione uma nova pergunta à pesquisa de clima
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="texto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pergunta</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Ex: Como você avalia o ambiente de trabalho?"
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-tipo">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="escala" data-testid="option-escala">Escala (1-10)</SelectItem>
                        <SelectItem value="multipla_escolha" data-testid="option-multipla">Múltipla Escolha</SelectItem>
                        <SelectItem value="texto_livre" data-testid="option-texto">Texto Livre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {tipo === "escala" && "O funcionário avalia de 1 a 10"}
                      {tipo === "multipla_escolha" && "O funcionário escolhe uma opção"}
                      {tipo === "texto_livre" && "O funcionário escreve uma resposta livre"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {tipo === "multipla_escolha" && (
                <FormField
                  control={form.control}
                  name="opcoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opções</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Separe as opções por vírgula: Ótimo, Bom, Regular, Ruim"
                          data-testid="input-opcoes"
                        />
                      </FormControl>
                      <FormDescription>
                        Separe as opções por vírgula
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
                      <div className="text-sm text-muted-foreground">
                        O funcionário deve responder esta pergunta
                      </div>
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
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} data-testid="button-cancelar">
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending} data-testid="button-salvar">
                  Adicionar Pergunta
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
