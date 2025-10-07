import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, BarChart as BarChartIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type AnalisePesquisa = {
  totalRespondentes: number;
  analise: {
    pergunta: string;
    tipo: string;
    totalRespostas: number;
    media?: number;
    valores?: number[];
    opcoes?: { [key: string]: number };
    respostas?: { texto: string; funcionario: string | null }[];
  }[];
};

export default function AmbienciaAnalise() {
  const [, params] = useRoute("/ambiencia/:id/analise");
  const pesquisaId = params?.id ? parseInt(params.id) : 0;

  const { data: pesquisa } = useQuery({
    queryKey: ["/api/pesquisas-clima", pesquisaId],
    queryFn: () => fetch(`/api/pesquisas-clima/${pesquisaId}`).then(res => res.json()),
    enabled: !!pesquisaId,
  });

  const { data: analise, isLoading } = useQuery<AnalisePesquisa>({
    queryKey: ["/api/pesquisas-clima", pesquisaId, "analise"],
    queryFn: () => fetch(`/api/pesquisas-clima/${pesquisaId}/analise`).then(res => res.json()),
    enabled: !!pesquisaId,
  });

  if (isLoading) {
    return <div className="text-center py-8">Carregando análise...</div>;
  }

  if (!analise) {
    return <div className="text-center py-8">Nenhuma resposta encontrada</div>;
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
            Análise: {pesquisa?.titulo || "Pesquisa"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Resultados e análises da pesquisa de clima
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Resumo da Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold" data-testid="text-total-respondentes">{analise.totalRespondentes}</div>
              <div className="text-sm text-muted-foreground">Respondentes</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold">{analise.analise.length}</div>
              <div className="text-sm text-muted-foreground">Perguntas</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold">
                {Math.round(analise.analise.reduce((acc, a) => acc + (a.media || 0), 0) / analise.analise.filter(a => a.media).length * 10) / 10 || 0}
              </div>
              <div className="text-sm text-muted-foreground">Média Geral</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {analise.analise.map((item, index) => (
          <Card key={index} data-testid={`card-analise-${index}`}>
            <CardHeader>
              <CardTitle className="text-lg">
                {index + 1}. {item.pergunta}
              </CardTitle>
              <CardDescription>
                {item.totalRespostas} resposta(s) · Tipo: {getTipoLabel(item.tipo)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {item.tipo === "escala" && item.media !== undefined && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center p-4 bg-primary/10 rounded-lg flex-shrink-0">
                      <div className="text-4xl font-bold text-primary" data-testid={`media-${index}`}>
                        {item.media}
                      </div>
                      <div className="text-sm text-muted-foreground">Média</div>
                    </div>
                    <div className="flex-1">
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={getDistribuicaoData(item.valores || [])}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="nota" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="quantidade" fill="hsl(var(--primary))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {item.tipo === "multipla_escolha" && item.opcoes && (
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={Object.entries(item.opcoes).map(([opcao, count]) => ({ opcao, votos: count }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="opcao" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="votos" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {item.tipo === "texto_livre" && item.respostas && (
                <div className="space-y-2">
                  {item.respostas.map((resposta, idx) => (
                    <div key={idx} className="p-3 bg-muted rounded-lg" data-testid={`resposta-${index}-${idx}`}>
                      <p className="text-sm">{resposta.texto}</p>
                      {resposta.funcionario && (
                        <p className="text-xs text-muted-foreground mt-1">- {resposta.funcionario}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {analise.analise.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChartIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground" data-testid="text-empty-state">
              Ainda não há respostas para esta pesquisa
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function getTipoLabel(tipo: string): string {
  const labels: { [key: string]: string } = {
    escala: "Escala 1-10",
    multipla_escolha: "Múltipla Escolha",
    texto_livre: "Texto Livre",
  };
  return labels[tipo] || tipo;
}

function getDistribuicaoData(valores: number[]): { nota: number; quantidade: number }[] {
  const distribuicao: { [key: number]: number } = {};
  
  for (let i = 1; i <= 10; i++) {
    distribuicao[i] = 0;
  }
  
  valores.forEach(valor => {
    if (valor >= 1 && valor <= 10) {
      distribuicao[valor]++;
    }
  });

  return Object.entries(distribuicao).map(([nota, quantidade]) => ({
    nota: parseInt(nota),
    quantidade,
  }));
}
