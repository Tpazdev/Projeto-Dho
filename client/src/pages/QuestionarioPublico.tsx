import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle2, XCircle, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";

type Pergunta = {
  id: number;
  pergunta: string;
  tipo: string;
  opcoes: string[] | null;
  obrigatoria: number;
  ordem: number;
};

type QuestionarioData = {
  desligamento: {
    id: number;
    funcionarioNome: string;
    empresaNome: string;
    dataDesligamento: string;
  };
  questionario: {
    id: number;
    titulo: string;
    descricao: string;
  };
  perguntas: Pergunta[];
  jaRespondido: boolean;
};

export default function QuestionarioPublico() {
  const [, params] = useRoute("/questionario/:token");
  const { toast } = useToast();
  const [respostas, setRespostas] = useState<Record<number, string | number>>({});

  const { data, isLoading, error } = useQuery<QuestionarioData>({
    queryKey: ["/api/public/questionario", params?.token],
    enabled: !!params?.token,
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/public/questionario/responder", {
        method: "POST",
        body: JSON.stringify({
          token: params?.token,
          respostas: Object.entries(respostas).map(([perguntaId, valor]) => {
            const pergunta = data?.perguntas.find(p => p.id === Number(perguntaId));
            if (pergunta?.tipo === "escala") {
              return {
                perguntaId: Number(perguntaId),
                valorEscala: Number(valor),
              };
            } else if (pergunta?.tipo === "data") {
              return {
                perguntaId: Number(perguntaId),
                valorData: valor,
              };
            } else {
              return {
                perguntaId: Number(perguntaId),
                textoResposta: String(valor),
              };
            }
          }),
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Questionário enviado com sucesso!",
        description: "Obrigado por sua participação.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao enviar respostas",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!data) return;

    const perguntasObrigatorias = data.perguntas.filter(p => p.obrigatoria === 1);
    const faltamRespostas = perguntasObrigatorias.some(p => !respostas[p.id]);

    if (faltamRespostas) {
      toast({
        title: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    submitMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Carregando questionário...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <XCircle className="h-6 w-6 text-destructive" />
              <CardTitle>Link Inválido</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              O link do questionário é inválido ou já expirou. Entre em contato com o RH se precisar de ajuda.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (data.jaRespondido) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <CardTitle>Questionário já respondido</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Você já respondeu este questionário anteriormente. Obrigado pela sua participação!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{data.questionario.titulo}</CardTitle>
            {data.questionario.descricao && (
              <CardDescription className="text-base mt-2">
                {data.questionario.descricao}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p className="text-sm">
                <strong>Colaborador:</strong> {data.desligamento.funcionarioNome}
              </p>
              <p className="text-sm">
                <strong>Empresa:</strong> {data.desligamento.empresaNome}
              </p>
              <p className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <strong>Data do desligamento:</strong>{" "}
                {new Date(data.desligamento.dataDesligamento).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </CardContent>
        </Card>

        {data.perguntas.map((pergunta) => (
          <Card key={pergunta.id} data-testid={`card-pergunta-${pergunta.id}`}>
            <CardHeader>
              <CardTitle className="text-lg">
                {pergunta.pergunta}
                {pergunta.obrigatoria === 1 && <span className="text-destructive ml-1">*</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pergunta.tipo === "texto" && (
                <Textarea
                  data-testid={`input-resposta-${pergunta.id}`}
                  placeholder="Sua resposta..."
                  value={respostas[pergunta.id] || ""}
                  onChange={(e) => setRespostas({ ...respostas, [pergunta.id]: e.target.value })}
                  className="min-h-[100px]"
                />
              )}

              {pergunta.tipo === "multipla_escolha" && pergunta.opcoes && (
                <RadioGroup
                  value={String(respostas[pergunta.id] || "")}
                  onValueChange={(value) => setRespostas({ ...respostas, [pergunta.id]: value })}
                >
                  {pergunta.opcoes.map((opcao, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={opcao}
                        id={`pergunta-${pergunta.id}-opcao-${idx}`}
                        data-testid={`radio-opcao-${pergunta.id}-${idx}`}
                      />
                      <Label htmlFor={`pergunta-${pergunta.id}-opcao-${idx}`}>{opcao}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {pergunta.tipo === "escala" && (
                <div className="space-y-4">
                  <RadioGroup
                    value={String(respostas[pergunta.id] || "")}
                    onValueChange={(value) => setRespostas({ ...respostas, [pergunta.id]: Number(value) })}
                  >
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <div key={num} className="flex flex-col items-center">
                          <RadioGroupItem
                            value={String(num)}
                            id={`pergunta-${pergunta.id}-escala-${num}`}
                            data-testid={`radio-escala-${pergunta.id}-${num}`}
                            className="mb-1"
                          />
                          <Label htmlFor={`pergunta-${pergunta.id}-escala-${num}`} className="text-xs">
                            {num}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Muito insatisfeito</span>
                    <span>Muito satisfeito</span>
                  </div>
                </div>
              )}

              {pergunta.tipo === "data" && (
                <Input
                  type="date"
                  data-testid={`input-data-${pergunta.id}`}
                  value={respostas[pergunta.id] || ""}
                  onChange={(e) => setRespostas({ ...respostas, [pergunta.id]: e.target.value })}
                />
              )}
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end gap-3">
          <Button
            data-testid="button-enviar-respostas"
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
            size="lg"
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar Respostas"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
