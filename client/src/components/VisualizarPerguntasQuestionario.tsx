import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { QuestionarioDesligamento, PerguntaDesligamento } from "@shared/schema";

interface VisualizarPerguntasQuestionarioProps {
  tipoDesligamento: "funcionario" | "gestor";
}

export function VisualizarPerguntasQuestionario({ tipoDesligamento }: VisualizarPerguntasQuestionarioProps) {
  const [expandido, setExpandido] = useState(false);

  const { data: questionarios = [] } = useQuery<QuestionarioDesligamento[]>({
    queryKey: ["/api/questionarios-desligamento"],
  });

  // Filtra questionários ativos do tipo especificado
  const questionarioAtivo = questionarios.find(
    (q) => q.ativo === 1 && q.tipoDesligamento === tipoDesligamento
  );

  const { data: perguntas = [] } = useQuery<PerguntaDesligamento[]>({
    queryKey: ["/api/questionarios-desligamento", questionarioAtivo?.id, "perguntas"],
    enabled: !!questionarioAtivo,
  });

  if (!questionarioAtivo) {
    return (
      <Card className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-900 dark:bg-yellow-950/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <div>
              <CardTitle className="text-lg">Questionário Não Configurado</CardTitle>
              <CardDescription className="mt-1">
                Não há questionário ativo para este tipo de desligamento. 
                Configure um questionário na seção de gerenciamento.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

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

  return (
    <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <CardTitle className="text-lg">Perguntas do Questionário</CardTitle>
              <CardDescription className="mt-1">
                {questionarioAtivo.titulo} - Visualização apenas para Admin
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpandido(!expandido)}
            data-testid="button-toggle-perguntas"
          >
            {expandido ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Recolher
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Ver Perguntas ({perguntas.length})
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      {expandido && (
        <CardContent>
          {perguntas.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">
              Nenhuma pergunta cadastrada neste questionário
            </p>
          ) : (
            <div className="space-y-3">
              {[...perguntas]
                .sort((a, b) => a.ordem - b.ordem)
                .map((pergunta, index) => (
                  <div
                    key={pergunta.id}
                    className="p-4 bg-white dark:bg-gray-900 rounded-lg border"
                    data-testid={`pergunta-${index + 1}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
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
                        <p className="text-sm font-medium">{pergunta.pergunta}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
