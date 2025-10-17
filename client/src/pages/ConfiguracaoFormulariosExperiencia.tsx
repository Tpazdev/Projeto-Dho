import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, GripVertical, Edit2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { TemplateAvaliacaoExperiencia, CampoAvaliacaoExperiencia } from "@shared/schema";

export default function ConfiguracaoFormulariosExperiencia() {
  const { toast } = useToast();
  const [periodoSelecionado, setPeriodoSelecionado] = useState<"1" | "2">("1");
  const [dialogCampoAberto, setDialogCampoAberto] = useState(false);
  const [campoEditando, setCampoEditando] = useState<CampoAvaliacaoExperiencia | null>(null);

  const { data: templates = [] } = useQuery<TemplateAvaliacaoExperiencia[]>({
    queryKey: ["/api/templates-avaliacao-experiencia"],
  });

  const templateAtual = templates.find((t) => t.periodo === periodoSelecionado && t.ativo === 1);

  const { data: campos = [] } = useQuery<CampoAvaliacaoExperiencia[]>({
    queryKey: ["/api/campos-avaliacao-experiencia/template", templateAtual?.id],
    enabled: !!templateAtual,
  });

  const criarTemplateMutation = useMutation({
    mutationFn: async (data: { nome: string; descricao: string; periodo: string }) => {
      return await apiRequest(`/api/templates-avaliacao-experiencia`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates-avaliacao-experiencia"] });
      toast({
        title: "Sucesso!",
        description: "Template criado com sucesso",
      });
    },
  });

  const criarCampoMutation = useMutation({
    mutationFn: async (data: any) => {
      if (campoEditando) {
        return await apiRequest(`/api/campos-avaliacao-experiencia/${campoEditando.id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });
      }
      return await apiRequest(`/api/campos-avaliacao-experiencia`, {
        method: "POST",
        body: JSON.stringify({ ...data, templateId: templateAtual?.id }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campos-avaliacao-experiencia/template", templateAtual?.id] });
      setDialogCampoAberto(false);
      setCampoEditando(null);
      toast({
        title: "Sucesso!",
        description: campoEditando ? "Campo atualizado com sucesso" : "Campo adicionado com sucesso",
      });
    },
  });

  const deletarCampoMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/campos-avaliacao-experiencia/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campos-avaliacao-experiencia/template", templateAtual?.id] });
      toast({
        title: "Sucesso!",
        description: "Campo removido com sucesso",
      });
    },
  });

  const criarTemplateSeNaoExistir = async (periodo: "1" | "2") => {
    const nomeTemplate = periodo === "1" ? "Avaliação 01° Período (30 dias)" : "Avaliação 02° Período (60 dias)";
    await criarTemplateMutation.mutateAsync({
      nome: nomeTemplate,
      descricao: `Template de avaliação para o ${periodo === "1" ? "primeiro" : "segundo"} período de experiência`,
      periodo,
    });
  };

  const handleSalvarCampo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const opcoes = formData.get("opcoes") as string;
    const opcoesArray = opcoes ? opcoes.split(",").map((o) => o.trim()).filter((o) => o) : null;

    const data = {
      nomeCampo: formData.get("nomeCampo") as string,
      tipoCampo: formData.get("tipoCampo") as string,
      opcoes: opcoesArray,
      obrigatorio: formData.get("obrigatorio") === "true" ? 1 : 0,
      ordem: campos.length + 1,
    };

    criarCampoMutation.mutate(data);
  };

  const getTipoCampoLabel = (tipo: string) => {
    const tipos: Record<string, string> = {
      texto: "Texto",
      numero: "Número",
      escala: "Escala (1-10)",
      multipla_escolha: "Múltipla Escolha",
      sim_nao: "Sim/Não",
    };
    return tipos[tipo] || tipo;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-titulo">
          Configuração de Formulários de Experiência
        </h1>
        <p className="text-muted-foreground">
          Configure os campos personalizados para os formulários de avaliação de experiência
        </p>
      </div>

      <Tabs value={periodoSelecionado} onValueChange={(v) => setPeriodoSelecionado(v as "1" | "2")}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="1" data-testid="tab-periodo-1">01° Período (30 dias)</TabsTrigger>
          <TabsTrigger value="2" data-testid="tab-periodo-2">02° Período (60 dias)</TabsTrigger>
        </TabsList>

        <TabsContent value={periodoSelecionado} className="space-y-4">
          {!templateAtual ? (
            <Card>
              <CardHeader>
                <CardTitle>Template não configurado</CardTitle>
                <CardDescription>
                  Crie um template para este período para começar a adicionar campos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => criarTemplateSeNaoExistir(periodoSelecionado)}
                  disabled={criarTemplateMutation.isPending}
                  data-testid="button-criar-template"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Template
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle data-testid="text-template-nome">{templateAtual.nome}</CardTitle>
                      <CardDescription>{templateAtual.descricao}</CardDescription>
                    </div>
                    <Dialog open={dialogCampoAberto} onOpenChange={setDialogCampoAberto}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setCampoEditando(null)}
                          data-testid="button-adicionar-campo"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar Campo
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            {campoEditando ? "Editar Campo" : "Adicionar Novo Campo"}
                          </DialogTitle>
                          <DialogDescription>
                            Configure o campo personalizado para o formulário de avaliação
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSalvarCampo} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="nomeCampo">Nome do Campo *</Label>
                            <Input
                              id="nomeCampo"
                              name="nomeCampo"
                              placeholder="Ex: Pontos Fortes, Desempenho Geral, etc."
                              defaultValue={campoEditando?.nomeCampo || ""}
                              required
                              data-testid="input-nome-campo"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="tipoCampo">Tipo de Campo *</Label>
                            <Select
                              name="tipoCampo"
                              defaultValue={campoEditando?.tipoCampo || "texto"}
                              required
                            >
                              <SelectTrigger data-testid="select-tipo-campo">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="texto">Texto Longo</SelectItem>
                                <SelectItem value="numero">Número</SelectItem>
                                <SelectItem value="escala">Escala (1-10)</SelectItem>
                                <SelectItem value="multipla_escolha">Múltipla Escolha</SelectItem>
                                <SelectItem value="sim_nao">Sim/Não</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="opcoes">
                              Opções (para Múltipla Escolha)
                            </Label>
                            <Input
                              id="opcoes"
                              name="opcoes"
                              placeholder="Separe por vírgula: Excelente, Bom, Regular, Ruim"
                              defaultValue={campoEditando?.opcoes?.join(", ") || ""}
                              data-testid="input-opcoes"
                            />
                            <p className="text-xs text-muted-foreground">
                              Separe as opções por vírgula. Deixe em branco para outros tipos de campo.
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="obrigatorio">Campo Obrigatório</Label>
                            <Select
                              name="obrigatorio"
                              defaultValue={campoEditando?.obrigatorio === 1 ? "true" : "false"}
                            >
                              <SelectTrigger data-testid="select-obrigatorio">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">Sim</SelectItem>
                                <SelectItem value="false">Não</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex gap-2 justify-end">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setDialogCampoAberto(false);
                                setCampoEditando(null);
                              }}
                              data-testid="button-cancelar"
                            >
                              Cancelar
                            </Button>
                            <Button
                              type="submit"
                              disabled={criarCampoMutation.isPending}
                              data-testid="button-salvar-campo"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              {campoEditando ? "Atualizar" : "Adicionar"}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {campos.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p data-testid="text-sem-campos">
                        Nenhum campo configurado. Clique em "Adicionar Campo" para começar.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {campos.map((campo, index) => (
                        <div
                          key={campo.id}
                          className="flex items-center gap-3 p-3 border rounded-lg hover-elevate"
                          data-testid={`campo-${campo.id}`}
                        >
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium" data-testid={`text-campo-nome-${campo.id}`}>
                                {campo.nomeCampo}
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-muted rounded-full">
                                {getTipoCampoLabel(campo.tipoCampo)}
                              </span>
                              {campo.obrigatorio === 1 && (
                                <span className="text-xs px-2 py-0.5 bg-destructive/10 text-destructive rounded-full">
                                  Obrigatório
                                </span>
                              )}
                            </div>
                            {campo.opcoes && campo.opcoes.length > 0 && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Opções: {campo.opcoes.join(", ")}
                              </p>
                            )}
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setCampoEditando(campo);
                              setDialogCampoAberto(true);
                            }}
                            data-testid={`button-editar-${campo.id}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deletarCampoMutation.mutate(campo.id)}
                            data-testid={`button-deletar-${campo.id}`}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
