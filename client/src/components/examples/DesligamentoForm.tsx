import { DesligamentoForm } from "../DesligamentoForm";

export default function DesligamentoFormExample() {
  const mockEmpresas = [
    { id: 1, nome: "Tech Solutions" },
    { id: 2, nome: "Inovação Corp" },
    { id: 3, nome: "Digital Ventures" },
  ];

  const mockGestores = [
    { id: 1, nome: "Ana Santos", empresaId: 1 },
    { id: 2, nome: "João Costa", empresaId: 2 },
    { id: 3, nome: "Patricia Lima", empresaId: 3 },
  ];

  const mockFuncionarios = [
    { id: 1, nome: "Carlos Silva", cargo: "Desenvolvedor Senior", gestorId: 1 },
    { id: 2, nome: "Maria Oliveira", cargo: "Gerente de Projetos", gestorId: 2 },
    { id: 3, nome: "Pedro Santos", cargo: "Analista de Sistemas", gestorId: 1 },
  ];

  const handleSubmit = (data: any) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <DesligamentoForm
        empresas={mockEmpresas}
        gestores={mockGestores}
        funcionarios={mockFuncionarios}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
