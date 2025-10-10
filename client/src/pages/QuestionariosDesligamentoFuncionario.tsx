import { EnviarQuestionario } from "@/components/EnviarQuestionario";

export default function QuestionariosDesligamentoFuncionario() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Questionários de Desligamento</h1>
        <p className="text-muted-foreground mt-2">
          Iniciativa do Funcionário - Preencha questionários para funcionários que solicitaram desligamento
        </p>
      </div>
      <EnviarQuestionario tipoDesligamento="funcionario" />
    </div>
  );
}
