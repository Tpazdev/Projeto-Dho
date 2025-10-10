import {
  empresas,
  gestores,
  funcionarios,
  desligamentos,
  documentosFuncionario,
  documentosGestor,
  formulariosExperiencia,
  pesquisasClima,
  perguntasClima,
  respostasClima,
  treinamentos,
  treinamentoParticipantes,
  pdis,
  pdiMetas,
  pdiCompetencias,
  pdiAcoes,
  questionariosDesligamento,
  perguntasDesligamento,
  respostasDesligamento,
  usuarios,
  sessoesTokens,
  type Empresa,
  type InsertEmpresa,
  type Gestor,
  type InsertGestor,
  type Funcionario,
  type InsertFuncionario,
  type Desligamento,
  type InsertDesligamento,
  type DocumentoFuncionario,
  type InsertDocumentoFuncionario,
  type DocumentoGestor,
  type InsertDocumentoGestor,
  type FormularioExperiencia,
  type InsertFormularioExperiencia,
  type PesquisaClima,
  type InsertPesquisaClima,
  type PerguntaClima,
  type InsertPerguntaClima,
  type RespostaClima,
  type InsertRespostaClima,
  type Treinamento,
  type InsertTreinamento,
  type TreinamentoParticipante,
  type InsertTreinamentoParticipante,
  type Pdi,
  type InsertPdi,
  type PdiMeta,
  type InsertPdiMeta,
  type PdiCompetencia,
  type InsertPdiCompetencia,
  type PdiAcao,
  type InsertPdiAcao,
  type QuestionarioDesligamento,
  type InsertQuestionarioDesligamento,
  type PerguntaDesligamento,
  type InsertPerguntaDesligamento,
  type RespostaDesligamento,
  type InsertRespostaDesligamento,
  type Usuario,
  type InsertUsuario,
  type SessaoToken,
  type InsertSessaoToken,
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, and } from "drizzle-orm";

export interface IStorage {
  createEmpresa(empresa: InsertEmpresa): Promise<Empresa>;
  getEmpresas(): Promise<Empresa[]>;
  getEmpresa(id: number): Promise<Empresa | undefined>;

  createGestor(gestor: InsertGestor): Promise<Gestor>;
  getGestores(): Promise<Gestor[]>;
  getGestor(id: number): Promise<Gestor | undefined>;

  createFuncionario(funcionario: InsertFuncionario): Promise<Funcionario>;
  getFuncionarios(): Promise<Funcionario[]>;
  getFuncionario(id: number): Promise<Funcionario | undefined>;

  createDesligamento(desligamento: InsertDesligamento): Promise<Desligamento>;
  getDesligamentos(): Promise<Desligamento[]>;
  getDesligamento(id: number): Promise<Desligamento | undefined>;

  getDesligamentosComDetalhes(): Promise<any[]>;
  getDesligamentosPorGestor(): Promise<{ labels: string[]; data: number[] }>;
  getDesligamentosPorEmpresa(): Promise<{ labels: string[]; data: number[] }>;

  createDocumentoFuncionario(documento: InsertDocumentoFuncionario): Promise<DocumentoFuncionario>;
  getDocumentosByFuncionario(funcionarioId: number): Promise<DocumentoFuncionario[]>;
  deleteDocumentoFuncionario(id: number): Promise<void>;

  createDocumentoGestor(documento: InsertDocumentoGestor): Promise<DocumentoGestor>;
  getDocumentosByGestor(gestorId: number): Promise<DocumentoGestor[]>;
  deleteDocumentoGestor(id: number): Promise<void>;

  createFormularioExperiencia(formulario: InsertFormularioExperiencia): Promise<FormularioExperiencia>;
  getFormulariosExperiencia(): Promise<any[]>;
  getFormularioExperiencia(id: number): Promise<FormularioExperiencia | undefined>;
  getFormulariosExperienciaPendentes(): Promise<any[]>;
  getFormulariosExperienciaByGestor(gestorId: number): Promise<any[]>;
  updateFormularioExperiencia(id: number, data: Partial<InsertFormularioExperiencia>): Promise<FormularioExperiencia>;

  createPesquisaClima(pesquisa: InsertPesquisaClima): Promise<PesquisaClima>;
  getPesquisasClima(): Promise<PesquisaClima[]>;
  getPesquisaClima(id: number): Promise<PesquisaClima | undefined>;
  updatePesquisaClima(id: number, data: Partial<InsertPesquisaClima>): Promise<PesquisaClima>;
  deletePesquisaClima(id: number): Promise<void>;

  createPerguntaClima(pergunta: InsertPerguntaClima): Promise<PerguntaClima>;
  getPerguntasByPesquisa(pesquisaId: number): Promise<PerguntaClima[]>;
  updatePerguntaClima(id: number, data: Partial<InsertPerguntaClima>): Promise<PerguntaClima>;
  deletePerguntaClima(id: number): Promise<void>;

  createRespostaClima(resposta: InsertRespostaClima): Promise<RespostaClima>;
  getRespostasByPesquisa(pesquisaId: number): Promise<any[]>;
  getRespostasByFuncionario(funcionarioId: number, pesquisaId: number): Promise<RespostaClima[]>;
  getAnalisePesquisa(pesquisaId: number): Promise<any>;

  createTreinamento(treinamento: InsertTreinamento): Promise<Treinamento>;
  getTreinamentos(): Promise<any[]>;
  getTreinamento(id: number): Promise<any | undefined>;
  updateTreinamento(id: number, data: Partial<InsertTreinamento>): Promise<Treinamento>;
  deleteTreinamento(id: number): Promise<void>;

  addParticipante(participante: InsertTreinamentoParticipante): Promise<TreinamentoParticipante>;
  getParticipantesByTreinamento(treinamentoId: number): Promise<any[]>;
  updateParticipante(id: number, data: Partial<InsertTreinamentoParticipante>): Promise<TreinamentoParticipante>;
  removeParticipante(id: number): Promise<void>;

  createPdi(pdi: InsertPdi): Promise<Pdi>;
  getPdis(): Promise<any[]>;
  getPdi(id: number): Promise<any | undefined>;
  updatePdi(id: number, data: Partial<InsertPdi>): Promise<Pdi>;
  deletePdi(id: number): Promise<void>;

  createPdiMeta(meta: InsertPdiMeta): Promise<PdiMeta>;
  getMetasByPdi(pdiId: number): Promise<PdiMeta[]>;
  updatePdiMeta(id: number, data: Partial<InsertPdiMeta>): Promise<PdiMeta>;
  deletePdiMeta(id: number): Promise<void>;

  createPdiCompetencia(competencia: InsertPdiCompetencia): Promise<PdiCompetencia>;
  getCompetenciasByPdi(pdiId: number): Promise<PdiCompetencia[]>;
  updatePdiCompetencia(id: number, data: Partial<InsertPdiCompetencia>): Promise<PdiCompetencia>;
  deletePdiCompetencia(id: number): Promise<void>;

  createPdiAcao(acao: InsertPdiAcao): Promise<PdiAcao>;
  getAcoesByPdi(pdiId: number): Promise<PdiAcao[]>;
  updatePdiAcao(id: number, data: Partial<InsertPdiAcao>): Promise<PdiAcao>;
  deletePdiAcao(id: number): Promise<void>;

  createQuestionarioDesligamento(questionario: InsertQuestionarioDesligamento): Promise<QuestionarioDesligamento>;
  getQuestionariosDesligamento(): Promise<QuestionarioDesligamento[]>;
  getQuestionarioDesligamento(id: number): Promise<QuestionarioDesligamento | undefined>;
  updateQuestionarioDesligamento(id: number, data: Partial<InsertQuestionarioDesligamento>): Promise<QuestionarioDesligamento>;
  deleteQuestionarioDesligamento(id: number): Promise<void>;

  createPerguntaDesligamento(pergunta: InsertPerguntaDesligamento): Promise<PerguntaDesligamento>;
  getPerguntasByQuestionario(questionarioId: number): Promise<PerguntaDesligamento[]>;
  updatePerguntaDesligamento(id: number, data: Partial<InsertPerguntaDesligamento>): Promise<PerguntaDesligamento>;
  deletePerguntaDesligamento(id: number): Promise<void>;

  createRespostaDesligamento(resposta: InsertRespostaDesligamento): Promise<RespostaDesligamento>;
  getRespostasByDesligamento(desligamentoId: number): Promise<RespostaDesligamento[]>;
  getQuestionarioAtivoByTipo(tipoDesligamento: string): Promise<QuestionarioDesligamento | undefined>;

  createUsuario(usuario: InsertUsuario): Promise<Usuario>;
  getUsuarios(): Promise<Usuario[]>;
  getUsuario(id: number): Promise<Usuario | undefined>;
  getUsuarioByEmail(email: string): Promise<Usuario | undefined>;
  updateUsuario(id: number, data: Partial<InsertUsuario>): Promise<Usuario>;
  deleteUsuario(id: number): Promise<void>;

  createSessaoToken(sessao: InsertSessaoToken): Promise<SessaoToken>;
  getSessaoToken(tokenHash: string): Promise<SessaoToken | undefined>;
  deleteSessaoToken(tokenHash: string): Promise<void>;
  deleteExpiredTokens(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createEmpresa(data: InsertEmpresa): Promise<Empresa> {
    const [empresa] = await db
      .insert(empresas)
      .values(data)
      .returning();
    return empresa;
  }

  async getEmpresas(): Promise<Empresa[]> {
    return await db.select().from(empresas);
  }

  async getEmpresa(id: number): Promise<Empresa | undefined> {
    const [empresa] = await db.select().from(empresas).where(eq(empresas.id, id));
    return empresa || undefined;
  }

  async createGestor(data: InsertGestor): Promise<Gestor> {
    const [gestor] = await db
      .insert(gestores)
      .values(data)
      .returning();
    return gestor;
  }

  async getGestores(): Promise<Gestor[]> {
    return await db.select().from(gestores);
  }

  async getGestor(id: number): Promise<Gestor | undefined> {
    const [gestor] = await db.select().from(gestores).where(eq(gestores.id, id));
    return gestor || undefined;
  }

  async createFuncionario(data: InsertFuncionario): Promise<Funcionario> {
    const [funcionario] = await db
      .insert(funcionarios)
      .values(data)
      .returning();
    return funcionario;
  }

  async getFuncionarios(): Promise<Funcionario[]> {
    return await db.select().from(funcionarios);
  }

  async getFuncionario(id: number): Promise<Funcionario | undefined> {
    const [funcionario] = await db.select().from(funcionarios).where(eq(funcionarios.id, id));
    return funcionario || undefined;
  }

  async createDesligamento(data: InsertDesligamento): Promise<Desligamento> {
    const [desligamento] = await db
      .insert(desligamentos)
      .values(data)
      .returning();
    return desligamento;
  }

  async getDesligamentos(): Promise<Desligamento[]> {
    return await db.select().from(desligamentos);
  }

  async getDesligamento(id: number): Promise<Desligamento | undefined> {
    const [desligamento] = await db.select().from(desligamentos).where(eq(desligamentos.id, id));
    return desligamento || undefined;
  }

  async getDesligamentosComDetalhes(): Promise<any[]> {
    const result = await db
      .select({
        id: desligamentos.id,
        dataDesligamento: desligamentos.dataDesligamento,
        motivo: desligamentos.motivo,
        tipoDesligamento: desligamentos.tipoDesligamento,
        funcionarioId: desligamentos.funcionarioId,
        funcionarioNome: funcionarios.nome,
        cargo: funcionarios.cargo,
        gestorId: desligamentos.gestorId,
        gestorNome: gestores.nome,
        empresaId: desligamentos.empresaId,
        empresaNome: empresas.nome,
      })
      .from(desligamentos)
      .innerJoin(funcionarios, eq(desligamentos.funcionarioId, funcionarios.id))
      .innerJoin(gestores, eq(desligamentos.gestorId, gestores.id))
      .innerJoin(empresas, eq(desligamentos.empresaId, empresas.id))
      .orderBy(desligamentos.dataDesligamento);

    return result;
  }

  async getDesligamentosPorGestor(): Promise<{ labels: string[]; data: number[] }> {
    const result = await db
      .select({
        gestorNome: gestores.nome,
        count: sql<number>`count(*)::int`,
      })
      .from(desligamentos)
      .innerJoin(gestores, eq(desligamentos.gestorId, gestores.id))
      .groupBy(gestores.id, gestores.nome)
      .orderBy(gestores.nome);

    return {
      labels: result.map((r) => r.gestorNome),
      data: result.map((r) => r.count),
    };
  }

  async getDesligamentosPorEmpresa(): Promise<{ labels: string[]; data: number[] }> {
    const result = await db
      .select({
        empresaNome: empresas.nome,
        count: sql<number>`count(*)::int`,
      })
      .from(desligamentos)
      .innerJoin(empresas, eq(desligamentos.empresaId, empresas.id))
      .groupBy(empresas.id, empresas.nome)
      .orderBy(empresas.nome);

    return {
      labels: result.map((r) => r.empresaNome),
      data: result.map((r) => r.count),
    };
  }

  async createDocumentoFuncionario(data: InsertDocumentoFuncionario): Promise<DocumentoFuncionario> {
    const [documento] = await db
      .insert(documentosFuncionario)
      .values(data)
      .returning();
    return documento;
  }

  async getDocumentosByFuncionario(funcionarioId: number): Promise<DocumentoFuncionario[]> {
    return await db
      .select()
      .from(documentosFuncionario)
      .where(eq(documentosFuncionario.funcionarioId, funcionarioId));
  }

  async deleteDocumentoFuncionario(id: number): Promise<void> {
    await db.delete(documentosFuncionario).where(eq(documentosFuncionario.id, id));
  }

  async createDocumentoGestor(data: InsertDocumentoGestor): Promise<DocumentoGestor> {
    const [documento] = await db
      .insert(documentosGestor)
      .values(data)
      .returning();
    return documento;
  }

  async getDocumentosByGestor(gestorId: number): Promise<DocumentoGestor[]> {
    return await db
      .select()
      .from(documentosGestor)
      .where(eq(documentosGestor.gestorId, gestorId));
  }

  async deleteDocumentoGestor(id: number): Promise<void> {
    await db.delete(documentosGestor).where(eq(documentosGestor.id, id));
  }

  async createFormularioExperiencia(data: InsertFormularioExperiencia): Promise<FormularioExperiencia> {
    const [formulario] = await db
      .insert(formulariosExperiencia)
      .values(data)
      .returning();
    return formulario;
  }

  async getFormulariosExperiencia(): Promise<any[]> {
    const result = await db
      .select({
        id: formulariosExperiencia.id,
        funcionarioId: formulariosExperiencia.funcionarioId,
        funcionarioNome: funcionarios.nome,
        gestorId: formulariosExperiencia.gestorId,
        gestorNome: gestores.nome,
        periodo: formulariosExperiencia.periodo,
        dataLimite: formulariosExperiencia.dataLimite,
        status: formulariosExperiencia.status,
        dataPreenchimento: formulariosExperiencia.dataPreenchimento,
        desempenho: formulariosExperiencia.desempenho,
        pontosFortes: formulariosExperiencia.pontosFortes,
        pontosMelhoria: formulariosExperiencia.pontosMelhoria,
        recomendacao: formulariosExperiencia.recomendacao,
        observacoes: formulariosExperiencia.observacoes,
      })
      .from(formulariosExperiencia)
      .innerJoin(funcionarios, eq(formulariosExperiencia.funcionarioId, funcionarios.id))
      .innerJoin(gestores, eq(formulariosExperiencia.gestorId, gestores.id))
      .orderBy(formulariosExperiencia.dataLimite);

    return result;
  }

  async getFormularioExperiencia(id: number): Promise<FormularioExperiencia | undefined> {
    const [formulario] = await db
      .select()
      .from(formulariosExperiencia)
      .where(eq(formulariosExperiencia.id, id));
    return formulario || undefined;
  }

  async getFormulariosExperienciaPendentes(): Promise<any[]> {
    const result = await db
      .select({
        id: formulariosExperiencia.id,
        funcionarioId: formulariosExperiencia.funcionarioId,
        funcionarioNome: funcionarios.nome,
        gestorId: formulariosExperiencia.gestorId,
        gestorNome: gestores.nome,
        periodo: formulariosExperiencia.periodo,
        dataLimite: formulariosExperiencia.dataLimite,
        status: formulariosExperiencia.status,
      })
      .from(formulariosExperiencia)
      .innerJoin(funcionarios, eq(formulariosExperiencia.funcionarioId, funcionarios.id))
      .innerJoin(gestores, eq(formulariosExperiencia.gestorId, gestores.id))
      .where(eq(formulariosExperiencia.status, "pendente"))
      .orderBy(formulariosExperiencia.dataLimite);

    return result;
  }

  async getFormulariosExperienciaByGestor(gestorId: number): Promise<any[]> {
    const result = await db
      .select({
        id: formulariosExperiencia.id,
        funcionarioId: formulariosExperiencia.funcionarioId,
        funcionarioNome: funcionarios.nome,
        gestorId: formulariosExperiencia.gestorId,
        gestorNome: gestores.nome,
        periodo: formulariosExperiencia.periodo,
        dataLimite: formulariosExperiencia.dataLimite,
        status: formulariosExperiencia.status,
        dataPreenchimento: formulariosExperiencia.dataPreenchimento,
        desempenho: formulariosExperiencia.desempenho,
        pontosFortes: formulariosExperiencia.pontosFortes,
        pontosMelhoria: formulariosExperiencia.pontosMelhoria,
        recomendacao: formulariosExperiencia.recomendacao,
        observacoes: formulariosExperiencia.observacoes,
      })
      .from(formulariosExperiencia)
      .innerJoin(funcionarios, eq(formulariosExperiencia.funcionarioId, funcionarios.id))
      .innerJoin(gestores, eq(formulariosExperiencia.gestorId, gestores.id))
      .where(eq(formulariosExperiencia.gestorId, gestorId))
      .orderBy(formulariosExperiencia.dataLimite);

    return result;
  }

  async updateFormularioExperiencia(id: number, data: Partial<InsertFormularioExperiencia>): Promise<FormularioExperiencia> {
    const [formulario] = await db
      .update(formulariosExperiencia)
      .set(data)
      .where(eq(formulariosExperiencia.id, id))
      .returning();
    return formulario;
  }

  async createPesquisaClima(data: InsertPesquisaClima): Promise<PesquisaClima> {
    const [pesquisa] = await db
      .insert(pesquisasClima)
      .values(data)
      .returning();
    return pesquisa;
  }

  async getPesquisasClima(): Promise<PesquisaClima[]> {
    return await db.select().from(pesquisasClima).orderBy(pesquisasClima.dataInicio);
  }

  async getPesquisaClima(id: number): Promise<PesquisaClima | undefined> {
    const [pesquisa] = await db.select().from(pesquisasClima).where(eq(pesquisasClima.id, id));
    return pesquisa || undefined;
  }

  async updatePesquisaClima(id: number, data: Partial<InsertPesquisaClima>): Promise<PesquisaClima> {
    const [pesquisa] = await db
      .update(pesquisasClima)
      .set(data)
      .where(eq(pesquisasClima.id, id))
      .returning();
    return pesquisa;
  }

  async deletePesquisaClima(id: number): Promise<void> {
    await db.delete(respostasClima).where(eq(respostasClima.pesquisaId, id));
    await db.delete(perguntasClima).where(eq(perguntasClima.pesquisaId, id));
    await db.delete(pesquisasClima).where(eq(pesquisasClima.id, id));
  }

  async createPerguntaClima(data: InsertPerguntaClima): Promise<PerguntaClima> {
    const [pergunta] = await db
      .insert(perguntasClima)
      .values(data)
      .returning();
    return pergunta;
  }

  async getPerguntasByPesquisa(pesquisaId: number): Promise<PerguntaClima[]> {
    return await db
      .select()
      .from(perguntasClima)
      .where(eq(perguntasClima.pesquisaId, pesquisaId))
      .orderBy(perguntasClima.ordem);
  }

  async updatePerguntaClima(id: number, data: Partial<InsertPerguntaClima>): Promise<PerguntaClima> {
    const [pergunta] = await db
      .update(perguntasClima)
      .set(data)
      .where(eq(perguntasClima.id, id))
      .returning();
    return pergunta;
  }

  async deletePerguntaClima(id: number): Promise<void> {
    await db.delete(respostasClima).where(eq(respostasClima.perguntaId, id));
    await db.delete(perguntasClima).where(eq(perguntasClima.id, id));
  }

  async createRespostaClima(data: InsertRespostaClima): Promise<RespostaClima> {
    const [resposta] = await db
      .insert(respostasClima)
      .values(data)
      .returning();
    return resposta;
  }

  async getRespostasByPesquisa(pesquisaId: number): Promise<any[]> {
    const result = await db
      .select({
        id: respostasClima.id,
        pesquisaId: respostasClima.pesquisaId,
        perguntaId: respostasClima.perguntaId,
        funcionarioId: respostasClima.funcionarioId,
        funcionarioNome: funcionarios.nome,
        valorEscala: respostasClima.valorEscala,
        textoResposta: respostasClima.textoResposta,
        dataResposta: respostasClima.dataResposta,
        perguntaTexto: perguntasClima.texto,
        perguntaTipo: perguntasClima.tipo,
      })
      .from(respostasClima)
      .leftJoin(funcionarios, eq(respostasClima.funcionarioId, funcionarios.id))
      .innerJoin(perguntasClima, eq(respostasClima.perguntaId, perguntasClima.id))
      .where(eq(respostasClima.pesquisaId, pesquisaId))
      .orderBy(respostasClima.dataResposta);

    return result;
  }

  async getRespostasByFuncionario(funcionarioId: number, pesquisaId: number): Promise<RespostaClima[]> {
    return await db
      .select()
      .from(respostasClima)
      .where(and(
        eq(respostasClima.funcionarioId, funcionarioId),
        eq(respostasClima.pesquisaId, pesquisaId)
      ));
  }

  async getAnalisePesquisa(pesquisaId: number): Promise<any> {
    const perguntas = await this.getPerguntasByPesquisa(pesquisaId);
    const respostas = await this.getRespostasByPesquisa(pesquisaId);

    const totalRespondentes = new Set(respostas.map(r => r.funcionarioId).filter(id => id !== null)).size;

    const analise = perguntas.map(pergunta => {
      const respostasPergunta = respostas.filter(r => r.perguntaId === pergunta.id);
      
      if (pergunta.tipo === 'escala') {
        const valores = respostasPergunta.map(r => r.valorEscala).filter(v => v !== null) as number[];
        const media = valores.length > 0 ? valores.reduce((a, b) => a + b, 0) / valores.length : 0;
        
        return {
          pergunta: pergunta.texto,
          tipo: pergunta.tipo,
          totalRespostas: valores.length,
          media: Math.round(media * 10) / 10,
          valores,
        };
      } else if (pergunta.tipo === 'multipla_escolha') {
        const opcoes: { [key: string]: number } = {};
        respostasPergunta.forEach(r => {
          if (r.textoResposta) {
            opcoes[r.textoResposta] = (opcoes[r.textoResposta] || 0) + 1;
          }
        });
        
        return {
          pergunta: pergunta.texto,
          tipo: pergunta.tipo,
          totalRespostas: respostasPergunta.length,
          opcoes,
        };
      } else {
        return {
          pergunta: pergunta.texto,
          tipo: pergunta.tipo,
          totalRespostas: respostasPergunta.length,
          respostas: respostasPergunta.map(r => ({
            texto: r.textoResposta,
            funcionario: r.funcionarioNome,
          })),
        };
      }
    });

    return {
      totalRespondentes,
      analise,
    };
  }

  async createTreinamento(data: InsertTreinamento): Promise<Treinamento> {
    const [treinamento] = await db
      .insert(treinamentos)
      .values(data)
      .returning();
    return treinamento;
  }

  async getTreinamentos(): Promise<any[]> {
    const result = await db
      .select({
        id: treinamentos.id,
        titulo: treinamentos.titulo,
        tipo: treinamentos.tipo,
        descricao: treinamentos.descricao,
        gestorId: treinamentos.gestorId,
        gestorNome: gestores.nome,
        dataInicio: treinamentos.dataInicio,
        dataFim: treinamentos.dataFim,
        cargaHoraria: treinamentos.cargaHoraria,
        status: treinamentos.status,
      })
      .from(treinamentos)
      .leftJoin(gestores, eq(treinamentos.gestorId, gestores.id))
      .orderBy(treinamentos.dataInicio);
    
    return result;
  }

  async getTreinamento(id: number): Promise<any | undefined> {
    const [result] = await db
      .select({
        id: treinamentos.id,
        titulo: treinamentos.titulo,
        tipo: treinamentos.tipo,
        descricao: treinamentos.descricao,
        gestorId: treinamentos.gestorId,
        gestorNome: gestores.nome,
        dataInicio: treinamentos.dataInicio,
        dataFim: treinamentos.dataFim,
        cargaHoraria: treinamentos.cargaHoraria,
        status: treinamentos.status,
      })
      .from(treinamentos)
      .leftJoin(gestores, eq(treinamentos.gestorId, gestores.id))
      .where(eq(treinamentos.id, id));
    
    return result || undefined;
  }

  async updateTreinamento(id: number, data: Partial<InsertTreinamento>): Promise<Treinamento> {
    const [updated] = await db
      .update(treinamentos)
      .set(data)
      .where(eq(treinamentos.id, id))
      .returning();
    return updated;
  }

  async deleteTreinamento(id: number): Promise<void> {
    await db.delete(treinamentos).where(eq(treinamentos.id, id));
  }

  async addParticipante(data: InsertTreinamentoParticipante): Promise<TreinamentoParticipante> {
    const [participante] = await db
      .insert(treinamentoParticipantes)
      .values(data)
      .returning();
    return participante;
  }

  async getParticipantesByTreinamento(treinamentoId: number): Promise<any[]> {
    const result = await db
      .select({
        id: treinamentoParticipantes.id,
        treinamentoId: treinamentoParticipantes.treinamentoId,
        funcionarioId: treinamentoParticipantes.funcionarioId,
        funcionarioNome: funcionarios.nome,
        funcionarioCargo: funcionarios.cargo,
        status: treinamentoParticipantes.status,
        dataInscricao: treinamentoParticipantes.dataInscricao,
        dataConclusao: treinamentoParticipantes.dataConclusao,
        avaliacaoNota: treinamentoParticipantes.avaliacaoNota,
        observacoes: treinamentoParticipantes.observacoes,
      })
      .from(treinamentoParticipantes)
      .leftJoin(funcionarios, eq(treinamentoParticipantes.funcionarioId, funcionarios.id))
      .where(eq(treinamentoParticipantes.treinamentoId, treinamentoId));
    
    return result;
  }

  async updateParticipante(id: number, data: Partial<InsertTreinamentoParticipante>): Promise<TreinamentoParticipante> {
    const [updated] = await db
      .update(treinamentoParticipantes)
      .set(data)
      .where(eq(treinamentoParticipantes.id, id))
      .returning();
    return updated;
  }

  async removeParticipante(id: number): Promise<void> {
    await db.delete(treinamentoParticipantes).where(eq(treinamentoParticipantes.id, id));
  }

  async createPdi(data: InsertPdi): Promise<Pdi> {
    const [pdi] = await db
      .insert(pdis)
      .values(data)
      .returning();
    return pdi;
  }

  async getPdis(): Promise<any[]> {
    const result = await db
      .select({
        id: pdis.id,
        funcionarioId: pdis.funcionarioId,
        funcionarioNome: funcionarios.nome,
        funcionarioCargo: funcionarios.cargo,
        gestorId: pdis.gestorId,
        gestorNome: gestores.nome,
        dataInicio: pdis.dataInicio,
        dataFim: pdis.dataFim,
        status: pdis.status,
        observacoes: pdis.observacoes,
      })
      .from(pdis)
      .leftJoin(funcionarios, eq(pdis.funcionarioId, funcionarios.id))
      .leftJoin(gestores, eq(pdis.gestorId, gestores.id))
      .orderBy(pdis.dataInicio);
    
    return result;
  }

  async getPdi(id: number): Promise<any | undefined> {
    const [result] = await db
      .select({
        id: pdis.id,
        funcionarioId: pdis.funcionarioId,
        funcionarioNome: funcionarios.nome,
        funcionarioCargo: funcionarios.cargo,
        gestorId: pdis.gestorId,
        gestorNome: gestores.nome,
        dataInicio: pdis.dataInicio,
        dataFim: pdis.dataFim,
        status: pdis.status,
        observacoes: pdis.observacoes,
      })
      .from(pdis)
      .leftJoin(funcionarios, eq(pdis.funcionarioId, funcionarios.id))
      .leftJoin(gestores, eq(pdis.gestorId, gestores.id))
      .where(eq(pdis.id, id));
    
    return result || undefined;
  }

  async updatePdi(id: number, data: Partial<InsertPdi>): Promise<Pdi> {
    const [updated] = await db
      .update(pdis)
      .set(data)
      .where(eq(pdis.id, id))
      .returning();
    return updated;
  }

  async deletePdi(id: number): Promise<void> {
    await db.delete(pdis).where(eq(pdis.id, id));
  }

  async createPdiMeta(data: InsertPdiMeta): Promise<PdiMeta> {
    const [meta] = await db
      .insert(pdiMetas)
      .values(data)
      .returning();
    return meta;
  }

  async getMetasByPdi(pdiId: number): Promise<PdiMeta[]> {
    return await db
      .select()
      .from(pdiMetas)
      .where(eq(pdiMetas.pdiId, pdiId))
      .orderBy(pdiMetas.prazo);
  }

  async updatePdiMeta(id: number, data: Partial<InsertPdiMeta>): Promise<PdiMeta> {
    const [updated] = await db
      .update(pdiMetas)
      .set(data)
      .where(eq(pdiMetas.id, id))
      .returning();
    return updated;
  }

  async deletePdiMeta(id: number): Promise<void> {
    await db.delete(pdiMetas).where(eq(pdiMetas.id, id));
  }

  async createPdiCompetencia(data: InsertPdiCompetencia): Promise<PdiCompetencia> {
    const [competencia] = await db
      .insert(pdiCompetencias)
      .values(data)
      .returning();
    return competencia;
  }

  async getCompetenciasByPdi(pdiId: number): Promise<PdiCompetencia[]> {
    return await db
      .select()
      .from(pdiCompetencias)
      .where(eq(pdiCompetencias.pdiId, pdiId));
  }

  async updatePdiCompetencia(id: number, data: Partial<InsertPdiCompetencia>): Promise<PdiCompetencia> {
    const [updated] = await db
      .update(pdiCompetencias)
      .set(data)
      .where(eq(pdiCompetencias.id, id))
      .returning();
    return updated;
  }

  async deletePdiCompetencia(id: number): Promise<void> {
    await db.delete(pdiCompetencias).where(eq(pdiCompetencias.id, id));
  }

  async createPdiAcao(data: InsertPdiAcao): Promise<PdiAcao> {
    const [acao] = await db
      .insert(pdiAcoes)
      .values(data)
      .returning();
    return acao;
  }

  async getAcoesByPdi(pdiId: number): Promise<PdiAcao[]> {
    return await db
      .select()
      .from(pdiAcoes)
      .where(eq(pdiAcoes.pdiId, pdiId))
      .orderBy(pdiAcoes.prazo);
  }

  async updatePdiAcao(id: number, data: Partial<InsertPdiAcao>): Promise<PdiAcao> {
    const [updated] = await db
      .update(pdiAcoes)
      .set(data)
      .where(eq(pdiAcoes.id, id))
      .returning();
    return updated;
  }

  async deletePdiAcao(id: number): Promise<void> {
    await db.delete(pdiAcoes).where(eq(pdiAcoes.id, id));
  }

  async createQuestionarioDesligamento(data: InsertQuestionarioDesligamento): Promise<QuestionarioDesligamento> {
    const [questionario] = await db
      .insert(questionariosDesligamento)
      .values(data)
      .returning();
    return questionario;
  }

  async getQuestionariosDesligamento(): Promise<QuestionarioDesligamento[]> {
    return await db.select().from(questionariosDesligamento).orderBy(questionariosDesligamento.dataCriacao);
  }

  async getQuestionarioDesligamento(id: number): Promise<QuestionarioDesligamento | undefined> {
    const [questionario] = await db
      .select()
      .from(questionariosDesligamento)
      .where(eq(questionariosDesligamento.id, id));
    return questionario || undefined;
  }

  async updateQuestionarioDesligamento(id: number, data: Partial<InsertQuestionarioDesligamento>): Promise<QuestionarioDesligamento> {
    const [updated] = await db
      .update(questionariosDesligamento)
      .set(data)
      .where(eq(questionariosDesligamento.id, id))
      .returning();
    return updated;
  }

  async deleteQuestionarioDesligamento(id: number): Promise<void> {
    await db.delete(perguntasDesligamento).where(eq(perguntasDesligamento.questionarioId, id));
    await db.delete(questionariosDesligamento).where(eq(questionariosDesligamento.id, id));
  }

  async createPerguntaDesligamento(data: InsertPerguntaDesligamento): Promise<PerguntaDesligamento> {
    const [pergunta] = await db
      .insert(perguntasDesligamento)
      .values(data)
      .returning();
    return pergunta;
  }

  async getPerguntasByQuestionario(questionarioId: number): Promise<PerguntaDesligamento[]> {
    return await db
      .select()
      .from(perguntasDesligamento)
      .where(eq(perguntasDesligamento.questionarioId, questionarioId))
      .orderBy(perguntasDesligamento.ordem);
  }

  async updatePerguntaDesligamento(id: number, data: Partial<InsertPerguntaDesligamento>): Promise<PerguntaDesligamento> {
    const [updated] = await db
      .update(perguntasDesligamento)
      .set(data)
      .where(eq(perguntasDesligamento.id, id))
      .returning();
    return updated;
  }

  async deletePerguntaDesligamento(id: number): Promise<void> {
    await db.delete(perguntasDesligamento).where(eq(perguntasDesligamento.id, id));
  }

  async createRespostaDesligamento(data: InsertRespostaDesligamento): Promise<RespostaDesligamento> {
    const [resposta] = await db
      .insert(respostasDesligamento)
      .values(data)
      .returning();
    return resposta;
  }

  async getRespostasByDesligamento(desligamentoId: number): Promise<RespostaDesligamento[]> {
    return await db
      .select()
      .from(respostasDesligamento)
      .where(eq(respostasDesligamento.desligamentoId, desligamentoId));
  }

  async getQuestionarioAtivoByTipo(tipoDesligamento: string): Promise<QuestionarioDesligamento | undefined> {
    const [questionario] = await db
      .select()
      .from(questionariosDesligamento)
      .where(
        and(
          eq(questionariosDesligamento.tipoDesligamento, tipoDesligamento),
          eq(questionariosDesligamento.ativo, 1)
        )
      )
      .orderBy(questionariosDesligamento.dataCriacao)
      .limit(1);
    return questionario || undefined;
  }

  async createUsuario(data: InsertUsuario): Promise<Usuario> {
    const [usuario] = await db
      .insert(usuarios)
      .values(data)
      .returning();
    return usuario;
  }

  async getUsuarios(): Promise<Usuario[]> {
    return await db.select().from(usuarios);
  }

  async getUsuario(id: number): Promise<Usuario | undefined> {
    const [usuario] = await db.select().from(usuarios).where(eq(usuarios.id, id));
    return usuario || undefined;
  }

  async getUsuarioByEmail(email: string): Promise<Usuario | undefined> {
    const [usuario] = await db.select().from(usuarios).where(eq(usuarios.email, email));
    return usuario || undefined;
  }

  async updateUsuario(id: number, data: Partial<InsertUsuario>): Promise<Usuario> {
    const [updated] = await db
      .update(usuarios)
      .set({
        ...data,
        atualizadoEm: sql`CURRENT_TIMESTAMP`,
      })
      .where(eq(usuarios.id, id))
      .returning();
    return updated;
  }

  async deleteUsuario(id: number): Promise<void> {
    await db.delete(sessoesTokens).where(eq(sessoesTokens.usuarioId, id));
    await db.delete(usuarios).where(eq(usuarios.id, id));
  }

  async createSessaoToken(data: InsertSessaoToken): Promise<SessaoToken> {
    const [sessao] = await db
      .insert(sessoesTokens)
      .values(data)
      .returning();
    return sessao;
  }

  async getSessaoToken(tokenHash: string): Promise<SessaoToken | undefined> {
    const [sessao] = await db
      .select()
      .from(sessoesTokens)
      .where(
        and(
          eq(sessoesTokens.tokenHash, tokenHash),
          sql`${sessoesTokens.expiraEm} > CURRENT_TIMESTAMP`
        )
      );
    return sessao || undefined;
  }

  async deleteSessaoToken(tokenHash: string): Promise<void> {
    await db.delete(sessoesTokens).where(eq(sessoesTokens.tokenHash, tokenHash));
  }

  async deleteExpiredTokens(): Promise<void> {
    await db.delete(sessoesTokens).where(sql`${sessoesTokens.expiraEm} < CURRENT_TIMESTAMP`);
  }
}

export const storage = new DatabaseStorage();
