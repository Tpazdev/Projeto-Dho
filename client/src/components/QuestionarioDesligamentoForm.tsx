import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Pergunta = {
  id: number;
  questionarioId: number;
  pergunta: string;
  tipo: string;
  opcoes: string[] | null;
  obrigatoria: number;
  ordem: number;
};

type Questionario = {
  id: number;
  titulo: string;
  descricao: string | null;
  tipoDesligamento: string;
  ativo: number;
  dataCriacao: string;
};

type QuestionarioData = {
  questionario: Questionario;
  perguntas: Pergunta[];
};

interface QuestionarioDesligamentoFormProps {
  desligamentoId: number;
  tipoDesligamento: string;
  onSuccess?: () => void;
}

export function QuestionarioDesligamentoForm({
  desligamentoId,
  tipoDesligamento,
  onSuccess,
}: QuestionarioDesligamentoFormProps) {
  const { toast } = useToast();
  const [respostas, setRespostas] = useState<Record<number, { valorEscala?: number; textoResposta?: string; valorData?: string }>>({});

  const { data, isLoading } = useQuery<QuestionarioData>({
    queryKey: [`/api/questionarios-desligamento/tipo/${tipoDesligamento}`],
  });

  const salvarMutation = useMutation({
    mutationFn: async () => {
      if (!data) return;

      const respostasArray = data.perguntas.map((pergunta) => ({
        perguntaId: pergunta.id,
        valorEscala: respostas[pergunta.id]?.valorEscala || null,
        textoResposta: respostas[pergunta.id]?.textoResposta || null,
        valorData: respostas[pergunta.id]?.valorData || null,
      }));

      const response = await apiRequest("POST", "/api/respostas-desligamento", {
        desligamentoId,
        questionarioId: data.questionario.id,
        respostas: respostasArray,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Questionário enviado",
        description: "Suas respostas foram registradas com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/desligamentos"] });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível salvar suas respostas. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleResposta = (perguntaId: number, valor: { valorEscala?: number; textoResposta?: string; valorData?: string }) => {
    setRespostas((prev) => ({
      ...prev,
      [perguntaId]: valor,
    }));
  };

  const handleSubmit = () => {
    if (!data) return;

    const obrigatoriasFaltando = data.perguntas
      .filter((p) => p.obrigatoria === 1)
      .some((p) => !respostas[p.id]?.textoResposta && !respostas[p.id]?.valorEscala && !respostas[p.id]?.valorData);

    if (obrigatoriasFaltando) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, responda todas as perguntas obrigatórias.",
        variant: "destructive",
      });
      return;
    }

    salvarMutation.mutate();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-lg text-muted-foreground">
            Nenhum questionário ativo encontrado para este tipo de desligamento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle data-testid="text-questionario-titulo">{data.questionario.titulo}</CardTitle>
          {data.questionario.descricao && (
            <CardDescription>{data.questionario.descricao}</CardDescription>
          )}
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {data.perguntas.map((pergunta) => (
          <Card key={pergunta.id} data-testid={`card-pergunta-${pergunta.id}`}>
            <CardHeader>
              <CardTitle className="text-base">
                {pergunta.pergunta}
                {pergunta.obrigatoria === 1 && <span className="text-red-500 ml-1">*</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pergunta.tipo === "texto" && (
                <Textarea
                  placeholder="Digite sua resposta..."
                  value={respostas[pergunta.id]?.textoResposta || ""}
                  onChange={(e) =>
                    handleResposta(pergunta.id, { textoResposta: e.target.value })
                  }
                  className="min-h-24"
                  data-testid={`textarea-resposta-${pergunta.id}`}
                />
              )}

              {pergunta.tipo === "multipla_escolha" && pergunta.opcoes && (
                <RadioGroup
                  value={respostas[pergunta.id]?.textoResposta || ""}
                  onValueChange={(value) =>
                    handleResposta(pergunta.id, { textoResposta: value })
                  }
                  data-testid={`radiogroup-resposta-${pergunta.id}`}
                >
                  {pergunta.opcoes.map((opcao, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={opcao}
                        id={`${pergunta.id}-${index}`}
                        data-testid={`radio-opcao-${pergunta.id}-${index}`}
                      />
                      <Label htmlFor={`${pergunta.id}-${index}`} className="cursor-pointer">
                        {opcao}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {pergunta.tipo === "escala" && (
                <RadioGroup
                  value={respostas[pergunta.id]?.valorEscala?.toString() || ""}
                  onValueChange={(value) =>
                    handleResposta(pergunta.id, { valorEscala: parseInt(value) })
                  }
                  className="flex gap-2"
                  data-testid={`radiogroup-escala-${pergunta.id}`}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((valor) => (
                    <div key={valor} className="flex flex-col items-center">
                      <RadioGroupItem
                        value={valor.toString()}
                        id={`${pergunta.id}-${valor}`}
                        data-testid={`radio-escala-${pergunta.id}-${valor}`}
                      />
                      <Label
                        htmlFor={`${pergunta.id}-${valor}`}
                        className="text-xs mt-1 cursor-pointer"
                      >
                        {valor}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {pergunta.tipo === "data" && (
                <Input
                  type="date"
                  value={respostas[pergunta.id]?.valorData || ""}
                  onChange={(e) =>
                    handleResposta(pergunta.id, { valorData: e.target.value })
                  }
                  data-testid={`input-data-${pergunta.id}`}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={salvarMutation.isPending}
          size="lg"
          data-testid="button-enviar-questionario"
        >
          {salvarMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Enviar Questionário
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
