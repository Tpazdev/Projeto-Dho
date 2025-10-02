import { DesligamentosTable } from "../DesligamentosTable";

export default function DesligamentosTableExample() {
  const mockData = [
    {
      id: 1,
      funcionarioNome: "Carlos Silva",
      cargo: "Desenvolvedor Senior",
      gestorNome: "Ana Santos",
      empresaNome: "Tech Solutions",
      dataDesligamento: "2024-01-15",
    },
    {
      id: 2,
      funcionarioNome: "Maria Oliveira",
      cargo: "Gerente de Projetos",
      gestorNome: "João Costa",
      empresaNome: "Inovação Corp",
      dataDesligamento: "2024-02-20",
    },
    {
      id: 3,
      funcionarioNome: "Pedro Santos",
      cargo: "Analista de Sistemas",
      gestorNome: "Ana Santos",
      empresaNome: "Tech Solutions",
      dataDesligamento: "2024-03-10",
    },
  ];

  return (
    <div className="p-6">
      <DesligamentosTable desligamentos={mockData} />
    </div>
  );
}
