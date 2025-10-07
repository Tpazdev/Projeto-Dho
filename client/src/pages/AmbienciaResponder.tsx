import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";

type PesquisaClima = {
  id: number;
  titulo: string;
  descricao: string | null;
  dataInicio: string;
  dataFim: string;
  status: string;
  anonima: number;
};

type PerguntaClima = {
  id: number;
  texto: string;
  tipo: string;
  opcoes: string[] | null;
  obrigatoria: number;
};

export default function AmbienciaResponder() {
  const { toast } = useToast();
  const [respostas, setRespostas] = useState<{ [key: number]: { valorEscala?: number; textoResposta?: string } }>({});

  const { data: pesquisas = [] } = useQuery<PesquisaClima[]>({
    queryKey: ["/api/pesquisas-clima"],
  });

  const pesquisasAtivas = pesquisas.filter(p => p.status === "ativa");

  const handleResposta = (perguntaId: number, valor: number | string, tipo: "escala" | "texto") => {
    setRespostas(prev => ({
      ...prev,
      [perguntaId]: tipo === "escala" ? { valorEscala: valor as number } : { textoResposta: valor as string },
    }));
  };

  const submitMutation = useMutation({
    mutationFn: async ({ pesquisaId, perguntas }: { pesquisaId: number; perguntas: PerguntaClima[] }) => {
      const promises = perguntas.map(pergunta => {
        const resposta = respostas[pergunta.id];
        if (!resposta) return null;

        return apiRequest("POST", `/api/pesquisas-clima/${pesquisaId}/respostas`, {
          perguntaId: pergunta.id,
          funcionarioId: null,
          ...resposta,
        });
      });

      return await Promise.all(promises.filter(p => p !== null));
    },
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Respostas enviadas com sucesso",
      });
      setRespostas({});
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível enviar as respostas",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          Responder Pesquisas de Clima
        </h1>
        <p className="text-muted-foreground mt-1">
          Participe das pesquisas de clima organizacional
        </p>
      </div>

      <div className="space-y-6">
        {pesquisasAtivas.map(pesquisa => (
          <PesquisaCard
            key={pesquisa.id}
            pesquisa={pesquisa}
            respostas={respostas}
            onResposta={handleResposta}
            onSubmit={submitMutation.mutate}
            isSubmitting={submitMutation.isPending}
          />
        ))}
      </div>

      {pesquisasAtivas.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground" data-testid="text-empty-state">
              Não há pesquisas ativas no momento
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PesquisaCard({
  pesquisa,
  respostas,
  onResposta,
  onSubmit,
  isSubmitting,
}: {
  pesquisa: PesquisaClima;
  respostas: { [key: number]: { valorEscala?: number; textoResposta?: string } };
  onResposta: (perguntaId: number, valor: number | string, tipo: "escala" | "texto") => void;
  onSubmit: (data: { pesquisaId: number; perguntas: PerguntaClima[] }) => void;
  isSubmitting: boolean;
}) {
  const { data: perguntas = [] } = useQuery<PerguntaClima[]>({
    queryKey: ["/api/pesquisas-clima", pesquisa.id, "perguntas"],
    queryFn: () => fetch(`/api/pesquisas-clima/${pesquisa.id}/perguntas`).then(res => res.json()),
  });

  const handleSubmit = () => {
    const obrigatorias = perguntas.filter(p => p.obrigatoria === 1);
    const respondidas = obrigatorias.filter(p => respostas[p.id]);

    if (respondidas.length < obrigatorias.length) {
      alert("Por favor, responda todas as perguntas obrigatórias");
      return;
    }

    onSubmit({ pesquisaId: pesquisa.id, perguntas });
  };

  return (
    <Card data-testid={`card-pesquisa-${pesquisa.id}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl">{pesquisa.titulo}</CardTitle>
            {pesquisa.descricao && (
              <CardDescription className="mt-2 text-base">{pesquisa.descricao}</CardDescription>
            )}
          </div>
          {pesquisa.anonima === 1 && (
            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
              Anônima
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <Calendar className="h-4 w-4" />
          <span>
            Até {format(new Date(pesquisa.dataFim), "dd/MM/yyyy", { locale: ptBR })}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {perguntas.map((pergunta, index) => (
          <div key={pergunta.id} className="space-y-3" data-testid={`pergunta-${pergunta.id}`}>
            <Label className="text-base">
              {index + 1}. {pergunta.texto}
              {pergunta.obrigatoria === 1 && <span className="text-red-500 ml-1">*</span>}
            </Label>

            {pergunta.tipo === "escala" && (
              <div className="space-y-2">
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[respostas[pergunta.id]?.valorEscala || 5]}
                  onValueChange={(value) => onResposta(pergunta.id, value[0], "escala")}
                  className="w-full"
                  data-testid={`slider-${pergunta.id}`}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>1 - Muito Insatisfeito</span>
                  <span className="font-semibold text-foreground">
                    {respostas[pergunta.id]?.valorEscala || 5}
                  </span>
                  <span>10 - Muito Satisfeito</span>
                </div>
              </div>
            )}

            {pergunta.tipo === "multipla_escolha" && pergunta.opcoes && (
              <RadioGroup
                onValueChange={(value) => onResposta(pergunta.id, value, "texto")}
                value={respostas[pergunta.id]?.textoResposta || ""}
                data-testid={`radio-group-${pergunta.id}`}
              >
                {pergunta.opcoes.map((opcao, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <RadioGroupItem value={opcao} id={`${pergunta.id}-${idx}`} data-testid={`radio-${pergunta.id}-${idx}`} />
                    <Label htmlFor={`${pergunta.id}-${idx}`} className="font-normal">{opcao}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {pergunta.tipo === "texto_livre" && (
              <Textarea
                placeholder="Escreva sua resposta aqui..."
                value={respostas[pergunta.id]?.textoResposta || ""}
                onChange={(e) => onResposta(pergunta.id, e.target.value, "texto")}
                className="min-h-[100px]"
                data-testid={`textarea-${pergunta.id}`}
              />
            )}
          </div>
        ))}

        {perguntas.length > 0 && (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full"
            data-testid={`button-enviar-${pesquisa.id}`}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Enviar Respostas
          </Button>
        )}

        {perguntas.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            Esta pesquisa ainda não possui perguntas
          </p>
        )}
      </CardContent>
    </Card>
  );
}
