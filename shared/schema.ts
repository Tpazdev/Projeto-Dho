import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const empresas = pgTable("empresas", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nome: text("nome").notNull().unique(),
});

export const gestores = pgTable("gestores", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nome: text("nome").notNull(),
  empresaId: integer("empresa_id").notNull().references(() => empresas.id),
});

export const funcionarios = pgTable("funcionarios", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nome: text("nome").notNull(),
  cpf: text("cpf"),
  cargo: text("cargo"),
  gestorId: integer("gestor_id").notNull().references(() => gestores.id),
  dataAdmissao: date("data_admissao"),
});

export const desligamentos = pgTable("desligamentos", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  dataDesligamento: date("data_desligamento").notNull(),
  motivo: text("motivo"),
  tipoDesligamento: text("tipo_desligamento").notNull().default("gestor"), // "funcionario" ou "gestor"
  funcionarioId: integer("funcionario_id").notNull().references(() => funcionarios.id),
  empresaId: integer("empresa_id").notNull().references(() => empresas.id),
  gestorId: integer("gestor_id").notNull().references(() => gestores.id),
  emailColaborador: text("email_colaborador"),
  tokenQuestionario: text("token_questionario"),
  tokenExpiraEm: timestamp("token_expira_em"),
  questionarioEnviado: integer("questionario_enviado").notNull().default(0),
  questionarioRespondido: integer("questionario_respondido").notNull().default(0),
});

export const documentosFuncionario = pgTable("documentos_funcionario", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  funcionarioId: integer("funcionario_id").notNull().references(() => funcionarios.id),
  tipoDocumento: text("tipo_documento").notNull(),
  numeroDocumento: text("numero_documento").notNull(),
  observacoes: text("observacoes"),
});

export const documentosGestor = pgTable("documentos_gestor", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  gestorId: integer("gestor_id").notNull().references(() => gestores.id),
  tipoDocumento: text("tipo_documento").notNull(),
  numeroDocumento: text("numero_documento").notNull(),
  observacoes: text("observacoes"),
});

export const templatesAvaliacaoExperiencia = pgTable("templates_avaliacao_experiencia", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nome: text("nome").notNull(),
  descricao: text("descricao"),
  periodo: text("periodo").notNull(), // "1" ou "2"
  ativo: integer("ativo").notNull().default(1),
  dataCriacao: timestamp("data_criacao").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const camposAvaliacaoExperiencia = pgTable("campos_avaliacao_experiencia", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  templateId: integer("template_id").notNull().references(() => templatesAvaliacaoExperiencia.id),
  nomeCampo: text("nome_campo").notNull(),
  tipoCampo: text("tipo_campo").notNull(), // "texto", "numero", "escala", "multipla_escolha", "sim_nao"
  opcoes: text("opcoes").array(), // Para múltipla escolha
  obrigatorio: integer("obrigatorio").notNull().default(1),
  ordem: integer("ordem").notNull(),
});

export const formulariosExperiencia = pgTable("formularios_experiencia", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  funcionarioId: integer("funcionario_id").notNull().references(() => funcionarios.id),
  gestorId: integer("gestor_id").notNull().references(() => gestores.id),
  templateId: integer("template_id").references(() => templatesAvaliacaoExperiencia.id),
  periodo: text("periodo").notNull().default("1"),
  dataLimite: date("data_limite").notNull(),
  status: text("status").notNull().default("pendente"),
  dataPreenchimento: date("data_preenchimento"),
  desempenho: integer("desempenho"),
  pontosFortes: text("pontos_fortes"),
  pontosMelhoria: text("pontos_melhoria"),
  recomendacao: text("recomendacao"),
  observacoes: text("observacoes"),
});

export const respostasAvaliacaoExperiencia = pgTable("respostas_avaliacao_experiencia", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  formularioId: integer("formulario_id").notNull().references(() => formulariosExperiencia.id),
  campoId: integer("campo_id").notNull().references(() => camposAvaliacaoExperiencia.id),
  valorTexto: text("valor_texto"),
  valorNumero: integer("valor_numero"),
  dataResposta: timestamp("data_resposta").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const pesquisasClima = pgTable("pesquisas_clima", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  dataInicio: date("data_inicio").notNull(),
  dataFim: date("data_fim").notNull(),
  status: text("status").notNull().default("ativa"),
  anonima: integer("anonima").notNull().default(1),
  empresaId: integer("empresa_id").references(() => empresas.id),
});

export const perguntasClima = pgTable("perguntas_clima", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  pesquisaId: integer("pesquisa_id").notNull().references(() => pesquisasClima.id),
  texto: text("texto").notNull(),
  tipo: text("tipo").notNull(),
  opcoes: text("opcoes").array(),
  ordem: integer("ordem").notNull(),
  obrigatoria: integer("obrigatoria").notNull().default(1),
});

export const respostasClima = pgTable("respostas_clima", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  pesquisaId: integer("pesquisa_id").notNull().references(() => pesquisasClima.id),
  perguntaId: integer("pergunta_id").notNull().references(() => perguntasClima.id),
  funcionarioId: integer("funcionario_id").references(() => funcionarios.id),
  valorEscala: integer("valor_escala"),
  textoResposta: text("texto_resposta"),
  dataResposta: date("data_resposta").notNull(),
});

export const treinamentos = pgTable("treinamentos", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  titulo: text("titulo").notNull(),
  tipo: text("tipo").notNull(),
  descricao: text("descricao"),
  gestorId: integer("gestor_id").notNull().references(() => gestores.id),
  dataInicio: date("data_inicio").notNull(),
  dataFim: date("data_fim").notNull(),
  cargaHoraria: integer("carga_horaria"),
  status: text("status").notNull().default("planejado"),
});

export const treinamentoParticipantes = pgTable("treinamento_participantes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  treinamentoId: integer("treinamento_id").notNull().references(() => treinamentos.id),
  funcionarioId: integer("funcionario_id").notNull().references(() => funcionarios.id),
  status: text("status").notNull().default("inscrito"),
  dataInscricao: date("data_inscricao").notNull(),
  dataConclusao: date("data_conclusao"),
  avaliacaoNota: integer("avaliacao_nota"),
  observacoes: text("observacoes"),
});

export const pdis = pgTable("pdis", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  funcionarioId: integer("funcionario_id").notNull().references(() => funcionarios.id),
  gestorId: integer("gestor_id").notNull().references(() => gestores.id),
  dataInicio: date("data_inicio").notNull(),
  dataFim: date("data_fim").notNull(),
  status: text("status").notNull().default("em_elaboracao"),
  observacoes: text("observacoes"),
});

export const pdiMetas = pgTable("pdi_metas", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  pdiId: integer("pdi_id").notNull().references(() => pdis.id),
  descricao: text("descricao").notNull(),
  prazo: date("prazo").notNull(),
  status: text("status").notNull().default("pendente"),
  resultado: text("resultado"),
});

export const pdiCompetencias = pgTable("pdi_competencias", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  pdiId: integer("pdi_id").notNull().references(() => pdis.id),
  competencia: text("competencia").notNull(),
  nivelAtual: integer("nivel_atual").notNull(),
  nivelDesejado: integer("nivel_desejado").notNull(),
  observacoes: text("observacoes"),
});

export const pdiAcoes = pgTable("pdi_acoes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  pdiId: integer("pdi_id").notNull().references(() => pdis.id),
  acao: text("acao").notNull(),
  tipo: text("tipo").notNull(),
  prazo: date("prazo").notNull(),
  status: text("status").notNull().default("pendente"),
  resultado: text("resultado"),
});

export const questionariosDesligamento = pgTable("questionarios_desligamento", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  tipoDesligamento: text("tipo_desligamento").notNull(), // "funcionario" ou "gestor"
  ativo: integer("ativo").notNull().default(1), // 1 = ativo, 0 = inativo
  dataCriacao: date("data_criacao").notNull().default(sql`CURRENT_DATE`),
});

export const perguntasDesligamento = pgTable("perguntas_desligamento", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  questionarioId: integer("questionario_id").notNull().references(() => questionariosDesligamento.id),
  pergunta: text("pergunta").notNull(),
  tipo: text("tipo").notNull(), // "texto", "multipla_escolha", "escala", "data"
  opcoes: text("opcoes").array(), // Para perguntas de múltipla escolha
  obrigatoria: integer("obrigatoria").notNull().default(1), // 1 = sim, 0 = não
  ordem: integer("ordem").notNull(),
});

export const respostasDesligamento = pgTable("respostas_desligamento", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  desligamentoId: integer("desligamento_id").notNull().references(() => desligamentos.id),
  questionarioId: integer("questionario_id").notNull().references(() => questionariosDesligamento.id),
  perguntaId: integer("pergunta_id").notNull().references(() => perguntasDesligamento.id),
  valorEscala: integer("valor_escala"),
  textoResposta: text("texto_resposta"),
  valorData: date("valor_data"), // Para perguntas do tipo "data"
  dataResposta: date("data_resposta").notNull().default(sql`CURRENT_DATE`),
});

export const usuarios = pgTable("usuarios", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  senhaHash: text("senha_hash").notNull(),
  role: text("role").notNull().default("funcionario"), // "admin", "gestor", "funcionario"
  ativo: integer("ativo").notNull().default(1), // 1 = ativo, 0 = inativo
  criadoEm: timestamp("criado_em").notNull().default(sql`CURRENT_TIMESTAMP`),
  atualizadoEm: timestamp("atualizado_em").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const sessoesTokens = pgTable("sessoes_tokens", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  usuarioId: integer("usuario_id").notNull().references(() => usuarios.id),
  tokenHash: text("token_hash").notNull().unique(),
  expiraEm: timestamp("expira_em").notNull(),
  criadoEm: timestamp("criado_em").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertEmpresaSchema = createInsertSchema(empresas).omit({ id: true });

export const insertGestorSchema = createInsertSchema(gestores).omit({ id: true });

export const insertFuncionarioSchema = createInsertSchema(funcionarios).omit({ id: true });

export const insertDesligamentoSchema = createInsertSchema(desligamentos).omit({ id: true });

export const insertDocumentoFuncionarioSchema = createInsertSchema(documentosFuncionario).omit({ id: true });

export const insertDocumentoGestorSchema = createInsertSchema(documentosGestor).omit({ id: true });

export const insertTemplateAvaliacaoExperienciaSchema = createInsertSchema(templatesAvaliacaoExperiencia).omit({ id: true, dataCriacao: true });

export const insertCampoAvaliacaoExperienciaSchema = createInsertSchema(camposAvaliacaoExperiencia).omit({ id: true });

export const insertFormularioExperienciaSchema = createInsertSchema(formulariosExperiencia).omit({ id: true });

export const insertRespostaAvaliacaoExperienciaSchema = createInsertSchema(respostasAvaliacaoExperiencia).omit({ id: true, dataResposta: true });

export const insertPesquisaClimaSchema = createInsertSchema(pesquisasClima).omit({ id: true });

export const insertPerguntaClimaSchema = createInsertSchema(perguntasClima).omit({ id: true });

export const insertRespostaClimaSchema = createInsertSchema(respostasClima).omit({ id: true });

export const insertTreinamentoSchema = createInsertSchema(treinamentos).omit({ id: true });

export const insertTreinamentoParticipanteSchema = createInsertSchema(treinamentoParticipantes).omit({ id: true });

export const insertPdiSchema = createInsertSchema(pdis).omit({ id: true });

export const insertPdiMetaSchema = createInsertSchema(pdiMetas).omit({ id: true });

export const insertPdiCompetenciaSchema = createInsertSchema(pdiCompetencias).omit({ id: true });

export const insertPdiAcaoSchema = createInsertSchema(pdiAcoes).omit({ id: true });

export const insertQuestionarioDesligamentoSchema = createInsertSchema(questionariosDesligamento).omit({ id: true, dataCriacao: true });

export const insertPerguntaDesligamentoSchema = createInsertSchema(perguntasDesligamento).omit({ id: true });

export const insertRespostaDesligamentoSchema = createInsertSchema(respostasDesligamento).omit({ id: true, dataResposta: true });

export type InsertEmpresa = z.infer<typeof insertEmpresaSchema>;
export type Empresa = typeof empresas.$inferSelect;

export type InsertGestor = z.infer<typeof insertGestorSchema>;
export type Gestor = typeof gestores.$inferSelect;

export type InsertFuncionario = z.infer<typeof insertFuncionarioSchema>;
export type Funcionario = typeof funcionarios.$inferSelect;

export type InsertDesligamento = z.infer<typeof insertDesligamentoSchema>;
export type Desligamento = typeof desligamentos.$inferSelect;

export type InsertDocumentoFuncionario = z.infer<typeof insertDocumentoFuncionarioSchema>;
export type DocumentoFuncionario = typeof documentosFuncionario.$inferSelect;

export type InsertDocumentoGestor = z.infer<typeof insertDocumentoGestorSchema>;
export type DocumentoGestor = typeof documentosGestor.$inferSelect;

export type InsertTemplateAvaliacaoExperiencia = z.infer<typeof insertTemplateAvaliacaoExperienciaSchema>;
export type TemplateAvaliacaoExperiencia = typeof templatesAvaliacaoExperiencia.$inferSelect;

export type InsertCampoAvaliacaoExperiencia = z.infer<typeof insertCampoAvaliacaoExperienciaSchema>;
export type CampoAvaliacaoExperiencia = typeof camposAvaliacaoExperiencia.$inferSelect;

export type InsertFormularioExperiencia = z.infer<typeof insertFormularioExperienciaSchema>;
export type FormularioExperiencia = typeof formulariosExperiencia.$inferSelect;

export type InsertRespostaAvaliacaoExperiencia = z.infer<typeof insertRespostaAvaliacaoExperienciaSchema>;
export type RespostaAvaliacaoExperiencia = typeof respostasAvaliacaoExperiencia.$inferSelect;

export type InsertPesquisaClima = z.infer<typeof insertPesquisaClimaSchema>;
export type PesquisaClima = typeof pesquisasClima.$inferSelect;

export type InsertPerguntaClima = z.infer<typeof insertPerguntaClimaSchema>;
export type PerguntaClima = typeof perguntasClima.$inferSelect;

export type InsertRespostaClima = z.infer<typeof insertRespostaClimaSchema>;
export type RespostaClima = typeof respostasClima.$inferSelect;

export type InsertTreinamento = z.infer<typeof insertTreinamentoSchema>;
export type Treinamento = typeof treinamentos.$inferSelect;

export type InsertTreinamentoParticipante = z.infer<typeof insertTreinamentoParticipanteSchema>;
export type TreinamentoParticipante = typeof treinamentoParticipantes.$inferSelect;

export type InsertPdi = z.infer<typeof insertPdiSchema>;
export type Pdi = typeof pdis.$inferSelect;

export type InsertPdiMeta = z.infer<typeof insertPdiMetaSchema>;
export type PdiMeta = typeof pdiMetas.$inferSelect;

export type InsertPdiCompetencia = z.infer<typeof insertPdiCompetenciaSchema>;
export type PdiCompetencia = typeof pdiCompetencias.$inferSelect;

export type InsertPdiAcao = z.infer<typeof insertPdiAcaoSchema>;
export type PdiAcao = typeof pdiAcoes.$inferSelect;

export type InsertQuestionarioDesligamento = z.infer<typeof insertQuestionarioDesligamentoSchema>;
export type QuestionarioDesligamento = typeof questionariosDesligamento.$inferSelect;

export type InsertPerguntaDesligamento = z.infer<typeof insertPerguntaDesligamentoSchema>;
export type PerguntaDesligamento = typeof perguntasDesligamento.$inferSelect;

export type InsertRespostaDesligamento = z.infer<typeof insertRespostaDesligamentoSchema>;
export type RespostaDesligamento = typeof respostasDesligamento.$inferSelect;

export const insertUsuarioSchema = createInsertSchema(usuarios)
  .omit({ id: true, criadoEm: true, atualizadoEm: true })
  .extend({
    role: z.enum(["admin", "gestor", "funcionario"]),
  });

export const insertSessaoTokenSchema = createInsertSchema(sessoesTokens).omit({ id: true, criadoEm: true });

export type InsertUsuario = z.infer<typeof insertUsuarioSchema>;
export type Usuario = typeof usuarios.$inferSelect;

export type InsertSessaoToken = z.infer<typeof insertSessaoTokenSchema>;
export type SessaoToken = typeof sessoesTokens.$inferSelect;
