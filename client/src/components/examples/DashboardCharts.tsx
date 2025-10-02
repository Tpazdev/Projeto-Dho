import { DashboardCharts } from "../DashboardCharts";

export default function DashboardChartsExample() {
  const mockGestoresData = [
    { name: "Ana Santos", value: 8 },
    { name: "João Costa", value: 5 },
    { name: "Patricia Lima", value: 3 },
    { name: "Roberto Alves", value: 7 },
  ];

  const mockEmpresasData = [
    { name: "Tech Solutions", value: 15 },
    { name: "Inovação Corp", value: 10 },
    { name: "Digital Ventures", value: 8 },
  ];

  return (
    <div className="p-6">
      <DashboardCharts gestoresData={mockGestoresData} empresasData={mockEmpresasData} />
    </div>
  );
}
