import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Trash2, Edit } from "lucide-react";
import type { QuestionarioDesligamento, PerguntaDesligamento } from "@shared/schema";

export default function QuestionariosDesligamento() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [perguntasDialogOpen, setPerguntasDialogOpen] = useState(false);
  const [selectedQuestionario, setSelectedQuestionario] = useState<number | null>(null);
  const [novoQuestionario, setNovoQuestionario] = useState({
    titulo: "",
    descricao: "",
    tipoDesligamento: "funcionario" as "funcionario" | "gestor",
  });
  const [novaPergunta, setNovaPergunta] = useState({
    pergunta: "",
    tipo: "texto_livre" as "escala" | "multipla_escolha" | "texto_livre",
    obrigatoria: 1,
    ordem: 1,
  });

  const { data: questionarios = [] } = useQuery<QuestionarioDesligamento[]>({
    queryKey: ["/api/questionarios-desligamento"],
  });

  const { data: perguntas = [] } = useQuery<PerguntaDesligamento[]>({
    queryKey: ["/api/questionarios-desligamento", selectedQuestionario, "perguntas"],
    enabled: selectedQuestionario !== null,
  });

  const criarQuestionarioMutation = useMutation({
    mutationFn: async (data: typeof novoQuestionario) => {
      const response = await apiRequest(
        "POST",
        "/api/questionarios-desligamento",
        { ...data, dataCriacao: new Date().toISOString().split('T')[0], ativo: 1 }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questionarios-desligamento"] });
      setDialogOpen(false);
      setNovoQuestionario({ titulo: "", descricao: "", tipoDesligamento: "funcionario" });
      toast({
        title: "Questionário criado",
        description: "O questionário foi criado com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar o questionário",
        variant: "destructive",
      });
    },
  });

  const deletarQuestionarioMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/questionarios-desligamento/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questionarios-desligamento"] });
      toast({
        title: "Questionário deletado",
        description: "O questionário foi removido com sucesso",
      });
    },
  });

  const criarPerguntaMutation = useMutation({
    mutationFn: async (data: typeof novaPergunta) => {
      const response = await apiRequest(
        "POST",
        `/api/questionarios-desligamento/${selectedQuestionario}/perguntas`,
        data
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questionarios-desligamento", selectedQuestionario, "perguntas"] });
      setNovaPergunta({ pergunta: "", tipo: "texto_livre", obrigatoria: 1, ordem: (perguntas.length || 0) + 1 });
      toast({
        title: "Pergunta adicionada",
        description: "A pergunta foi adicionada ao questionário",
      });
    },
  });

  const deletarPerguntaMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/perguntas-desligamento/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questionarios-desligamento", selectedQuestionario, "perguntas"] });
      toast({
        title: "Pergunta removida",
        description: "A pergunta foi removida do questionário",
      });
    },
  });

  const handleCriarQuestionario = () => {
    if (!novoQuestionario.titulo.trim()) {
      toast({
        title: "Erro",
        description: "O título do questionário é obrigatório",
        variant: "destructive",
      });
      return;
    }
    criarQuestionarioMutation.mutate(novoQuestionario);
  };

  const handleAdicionarPergunta = () => {
    if (!novaPergunta.pergunta.trim()) {
      toast({
        title: "Erro",
        description: "O texto da pergunta é obrigatório",
        variant: "destructive",
      });
      return;
    }
    criarPerguntaMutation.mutate(novaPergunta);
  };

  const abrirPerguntasDialog = (questionarioId: number) => {
    setSelectedQuestionario(questionarioId);
    setPerguntasDialogOpen(true);
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Questionários de Desligamento</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os questionários enviados aos funcionários e gestores
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-novo-questionario">
                <Plus className="h-4 w-4 mr-2" />
                Novo Questionário
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Questionário</DialogTitle>
                <DialogDescription>
                  Preencha os dados do novo questionário de desligamento
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="titulo">Título</Label>
                  <Input
                    id="titulo"
                    data-testid="input-titulo-questionario"
                    value={novoQuestionario.titulo}
                    onChange={(e) => setNovoQuestionario({ ...novoQuestionario, titulo: e.target.value })}
                    placeholder="Ex: Questionário de Desligamento - 2025"
                  />
                </div>
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    data-testid="input-descricao-questionario"
                    value={novoQuestionario.descricao || ""}
                    onChange={(e) => setNovoQuestionario({ ...novoQuestionario, descricao: e.target.value })}
                    placeholder="Descreva o objetivo do questionário"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select
                    value={novoQuestionario.tipoDesligamento}
                    onValueChange={(value: "funcionario" | "gestor") => 
                      setNovoQuestionario({ ...novoQuestionario, tipoDesligamento: value })
                    }
                  >
                    <SelectTrigger id="tipo" data-testid="select-tipo-questionario">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="funcionario">Funcionário</SelectItem>
                      <SelectItem value="gestor">Gestor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  data-testid="button-cancelar-questionario"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCriarQuestionario}
                  disabled={criarQuestionarioMutation.isPending}
                  data-testid="button-salvar-questionario"
                >
                  Criar Questionário
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {questionarios.map((questionario) => (
            <Card key={questionario.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{questionario.titulo}</CardTitle>
                    <CardDescription className="mt-1">
                      {questionario.descricao || "Sem descrição"}
                    </CardDescription>
                    <div className="flex gap-4 mt-3">
                      <span className="text-sm text-muted-foreground">
                        Tipo: <span className="font-medium">{questionario.tipoDesligamento === "funcionario" ? "Funcionário" : "Gestor"}</span>
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Criado em: <span className="font-medium">{new Date(questionario.dataCriacao).toLocaleDateString('pt-BR')}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => abrirPerguntasDialog(questionario.id)}
                      data-testid={`button-editar-perguntas-${questionario.id}`}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Gerenciar Perguntas
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deletarQuestionarioMutation.mutate(questionario.id)}
                      data-testid={`button-deletar-questionario-${questionario.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}

          {questionarios.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">Nenhum questionário criado ainda</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Clique em "Novo Questionário" para começar
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Dialog de perguntas */}
        <Dialog open={perguntasDialogOpen} onOpenChange={setPerguntasDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Gerenciar Perguntas</DialogTitle>
              <DialogDescription>
                Adicione e gerencie as perguntas deste questionário
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">Adicionar Nova Pergunta</h3>
                <div>
                  <Label htmlFor="texto-pergunta">Texto da Pergunta</Label>
                  <Textarea
                    id="texto-pergunta"
                    data-testid="input-texto-pergunta"
                    value={novaPergunta.pergunta}
                    onChange={(e) => setNovaPergunta({ ...novaPergunta, pergunta: e.target.value })}
                    placeholder="Digite a pergunta..."
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipo-pergunta">Tipo</Label>
                    <Select
                      value={novaPergunta.tipo}
                      onValueChange={(value: "escala" | "multipla_escolha" | "texto_livre") => 
                        setNovaPergunta({ ...novaPergunta, tipo: value })
                      }
                    >
                      <SelectTrigger id="tipo-pergunta" data-testid="select-tipo-pergunta">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="texto_livre">Texto Livre</SelectItem>
                        <SelectItem value="escala">Escala (1-10)</SelectItem>
                        <SelectItem value="multipla_escolha">Múltipla Escolha</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="obrigatoria">Obrigatória?</Label>
                    <Select
                      value={novaPergunta.obrigatoria.toString()}
                      onValueChange={(value) => 
                        setNovaPergunta({ ...novaPergunta, obrigatoria: parseInt(value) })
                      }
                    >
                      <SelectTrigger id="obrigatoria" data-testid="select-obrigatoria-pergunta">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Sim</SelectItem>
                        <SelectItem value="0">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  onClick={handleAdicionarPergunta}
                  disabled={criarPerguntaMutation.isPending}
                  className="w-full"
                  data-testid="button-adicionar-pergunta"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Pergunta
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Perguntas ({perguntas.length})</h3>
                {perguntas.map((pergunta, index) => (
                  <div key={pergunta.id} className="border rounded-lg p-4 flex items-start justify-between hover-elevate">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">#{index + 1}</span>
                        <span className="text-sm">{pergunta.pergunta}</span>
                      </div>
                      <div className="flex gap-4 mt-2">
                        <span className="text-xs text-muted-foreground">
                          Tipo: {pergunta.tipo === "texto_livre" ? "Texto Livre" : pergunta.tipo === "escala" ? "Escala" : "Múltipla Escolha"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {pergunta.obrigatoria ? "Obrigatória" : "Opcional"}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletarPerguntaMutation.mutate(pergunta.id)}
                      data-testid={`button-deletar-pergunta-${pergunta.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {perguntas.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Nenhuma pergunta adicionada ainda
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setPerguntasDialogOpen(false);
                  setSelectedQuestionario(null);
                }}
                data-testid="button-fechar-perguntas"
              >
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
