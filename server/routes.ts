import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEmpresaSchema, insertGestorSchema, insertFuncionarioSchema, insertDesligamentoSchema, insertDocumentoFuncionarioSchema, insertDocumentoGestorSchema, insertFormularioExperienciaSchema, insertPesquisaClimaSchema, insertPerguntaClimaSchema, insertRespostaClimaSchema, insertTreinamentoSchema, insertTreinamentoParticipanteSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/empresas", async (req, res) => {
    try {
      const empresas = await storage.getEmpresas();
      res.json(empresas);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar empresas" });
    }
  });

  app.post("/api/empresas", async (req, res) => {
    try {
      const validated = insertEmpresaSchema.parse(req.body);
      const empresa = await storage.createEmpresa(validated);
      res.json(empresa);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.get("/api/gestores", async (req, res) => {
    try {
      const gestores = await storage.getGestores();
      res.json(gestores);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar gestores" });
    }
  });

  app.post("/api/gestores", async (req, res) => {
    try {
      const validated = insertGestorSchema.parse(req.body);
      const gestor = await storage.createGestor(validated);
      res.json(gestor);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.get("/api/funcionarios", async (req, res) => {
    try {
      const funcionarios = await storage.getFuncionarios();
      res.json(funcionarios);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar funcionários" });
    }
  });

  app.post("/api/funcionarios", async (req, res) => {
    try {
      const validated = insertFuncionarioSchema.parse(req.body);
      const funcionario = await storage.createFuncionario(validated);
      res.json(funcionario);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.get("/api/desligamentos", async (req, res) => {
    try {
      const desligamentos = await storage.getDesligamentosComDetalhes();
      res.json(desligamentos);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar desligamentos" });
    }
  });

  app.post("/api/desligamentos", async (req, res) => {
    try {
      const validated = insertDesligamentoSchema.parse(req.body);
      const desligamento = await storage.createDesligamento(validated);
      res.json(desligamento);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.get("/api/dados/desligamentos_por_gestor", async (req, res) => {
    try {
      const data = await storage.getDesligamentosPorGestor();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar dados" });
    }
  });

  app.get("/api/dados/desligamentos_por_empresa", async (req, res) => {
    try {
      const data = await storage.getDesligamentosPorEmpresa();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar dados" });
    }
  });

  app.get("/api/funcionarios/:id/documentos", async (req, res) => {
    try {
      const funcionarioId = parseInt(req.params.id);
      const documentos = await storage.getDocumentosByFuncionario(funcionarioId);
      res.json(documentos);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar documentos" });
    }
  });

  app.post("/api/funcionarios/:id/documentos", async (req, res) => {
    try {
      const funcionarioId = parseInt(req.params.id);
      const validated = insertDocumentoFuncionarioSchema.parse({
        ...req.body,
        funcionarioId,
      });
      const documento = await storage.createDocumentoFuncionario(validated);
      res.json(documento);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.delete("/api/documentos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteDocumentoFuncionario(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar documento" });
    }
  });

  app.get("/api/gestores/:id/documentos", async (req, res) => {
    try {
      const gestorId = parseInt(req.params.id);
      const documentos = await storage.getDocumentosByGestor(gestorId);
      res.json(documentos);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar documentos" });
    }
  });

  app.post("/api/gestores/:id/documentos", async (req, res) => {
    try {
      const gestorId = parseInt(req.params.id);
      const validated = insertDocumentoGestorSchema.parse({
        ...req.body,
        gestorId,
      });
      const documento = await storage.createDocumentoGestor(validated);
      res.json(documento);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.delete("/api/documentos-gestor/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteDocumentoGestor(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar documento" });
    }
  });

  app.get("/api/formularios-experiencia", async (req, res) => {
    try {
      const formularios = await storage.getFormulariosExperiencia();
      res.json(formularios);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar formulários" });
    }
  });

  app.get("/api/formularios-experiencia/pendentes", async (req, res) => {
    try {
      const formularios = await storage.getFormulariosExperienciaPendentes();
      res.json(formularios);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar formulários pendentes" });
    }
  });

  app.get("/api/formularios-experiencia/gestor/:gestorId", async (req, res) => {
    try {
      const gestorId = parseInt(req.params.gestorId);
      const formularios = await storage.getFormulariosExperienciaByGestor(gestorId);
      res.json(formularios);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar formulários do gestor" });
    }
  });

  app.get("/api/formularios-experiencia/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const formulario = await storage.getFormularioExperiencia(id);
      if (!formulario) {
        return res.status(404).json({ error: "Formulário não encontrado" });
      }
      res.json(formulario);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar formulário" });
    }
  });

  app.post("/api/formularios-experiencia", async (req, res) => {
    try {
      const validated = insertFormularioExperienciaSchema.parse(req.body);
      const formulario = await storage.createFormularioExperiencia(validated);
      res.json(formulario);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.patch("/api/formularios-experiencia/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;

      if (data.desempenho !== undefined) {
        const desempenho = Number(data.desempenho);
        if (isNaN(desempenho) || desempenho < 0 || desempenho > 10) {
          return res.status(400).json({ error: "Desempenho deve ser um número entre 0 e 10" });
        }
        data.desempenho = desempenho;
      }

      if (data.recomendacao !== undefined) {
        if (!["aprovado", "reprovado"].includes(data.recomendacao)) {
          return res.status(400).json({ error: "Recomendação deve ser 'aprovado' ou 'reprovado'" });
        }
      }

      if (data.desempenho !== undefined || data.pontosFortes !== undefined || data.pontosMelhoria !== undefined) {
        data.status = "preenchido";
        data.dataPreenchimento = new Date().toISOString().split("T")[0];
      }

      const formulario = await storage.updateFormularioExperiencia(id, data);
      res.json(formulario);
    } catch (error) {
      res.status(400).json({ error: "Erro ao atualizar formulário" });
    }
  });

  app.get("/api/pesquisas-clima", async (req, res) => {
    try {
      const pesquisas = await storage.getPesquisasClima();
      res.json(pesquisas);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar pesquisas" });
    }
  });

  app.get("/api/pesquisas-clima/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pesquisa = await storage.getPesquisaClima(id);
      if (!pesquisa) {
        return res.status(404).json({ error: "Pesquisa não encontrada" });
      }
      res.json(pesquisa);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar pesquisa" });
    }
  });

  app.post("/api/pesquisas-clima", async (req, res) => {
    try {
      const validated = insertPesquisaClimaSchema.parse(req.body);
      const pesquisa = await storage.createPesquisaClima(validated);
      res.json(pesquisa);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.patch("/api/pesquisas-clima/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pesquisa = await storage.updatePesquisaClima(id, req.body);
      res.json(pesquisa);
    } catch (error) {
      res.status(400).json({ error: "Erro ao atualizar pesquisa" });
    }
  });

  app.delete("/api/pesquisas-clima/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePesquisaClima(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar pesquisa" });
    }
  });

  app.get("/api/pesquisas-clima/:id/perguntas", async (req, res) => {
    try {
      const pesquisaId = parseInt(req.params.id);
      const perguntas = await storage.getPerguntasByPesquisa(pesquisaId);
      res.json(perguntas);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar perguntas" });
    }
  });

  app.post("/api/pesquisas-clima/:id/perguntas", async (req, res) => {
    try {
      const pesquisaId = parseInt(req.params.id);
      const validated = insertPerguntaClimaSchema.parse({
        ...req.body,
        pesquisaId,
      });
      const pergunta = await storage.createPerguntaClima(validated);
      res.json(pergunta);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.patch("/api/perguntas-clima/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pergunta = await storage.updatePerguntaClima(id, req.body);
      res.json(pergunta);
    } catch (error) {
      res.status(400).json({ error: "Erro ao atualizar pergunta" });
    }
  });

  app.delete("/api/perguntas-clima/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePerguntaClima(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar pergunta" });
    }
  });

  app.get("/api/pesquisas-clima/:id/respostas", async (req, res) => {
    try {
      const pesquisaId = parseInt(req.params.id);
      const respostas = await storage.getRespostasByPesquisa(pesquisaId);
      res.json(respostas);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar respostas" });
    }
  });

  app.post("/api/pesquisas-clima/:id/respostas", async (req, res) => {
    try {
      const pesquisaId = parseInt(req.params.id);
      const validated = insertRespostaClimaSchema.parse({
        ...req.body,
        pesquisaId,
        dataResposta: new Date().toISOString().split("T")[0],
      });
      const resposta = await storage.createRespostaClima(validated);
      res.json(resposta);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.get("/api/pesquisas-clima/:id/analise", async (req, res) => {
    try {
      const pesquisaId = parseInt(req.params.id);
      const analise = await storage.getAnalisePesquisa(pesquisaId);
      res.json(analise);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar análise" });
    }
  });

  app.get("/api/treinamentos", async (req, res) => {
    try {
      const treinamentos = await storage.getTreinamentos();
      res.json(treinamentos);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar treinamentos" });
    }
  });

  app.get("/api/treinamentos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const treinamento = await storage.getTreinamento(id);
      if (!treinamento) {
        return res.status(404).json({ error: "Treinamento não encontrado" });
      }
      res.json(treinamento);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar treinamento" });
    }
  });

  app.post("/api/treinamentos", async (req, res) => {
    try {
      const validated = insertTreinamentoSchema.parse(req.body);
      const treinamento = await storage.createTreinamento(validated);
      res.json(treinamento);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.patch("/api/treinamentos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const treinamento = await storage.updateTreinamento(id, req.body);
      res.json(treinamento);
    } catch (error) {
      res.status(400).json({ error: "Erro ao atualizar treinamento" });
    }
  });

  app.delete("/api/treinamentos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTreinamento(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar treinamento" });
    }
  });

  app.get("/api/treinamentos/:id/participantes", async (req, res) => {
    try {
      const treinamentoId = parseInt(req.params.id);
      const participantes = await storage.getParticipantesByTreinamento(treinamentoId);
      res.json(participantes);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar participantes" });
    }
  });

  app.post("/api/treinamentos/:id/participantes", async (req, res) => {
    try {
      const treinamentoId = parseInt(req.params.id);
      const validated = insertTreinamentoParticipanteSchema.parse({
        ...req.body,
        treinamentoId,
        dataInscricao: new Date().toISOString().split("T")[0],
      });
      const participante = await storage.addParticipante(validated);
      res.json(participante);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  });

  app.patch("/api/participantes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const participante = await storage.updateParticipante(id, req.body);
      res.json(participante);
    } catch (error) {
      res.status(400).json({ error: "Erro ao atualizar participante" });
    }
  });

  app.delete("/api/participantes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.removeParticipante(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar participante" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
