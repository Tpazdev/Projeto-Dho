import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, date } from "drizzle-orm/pg-core";
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
  cargo: text("cargo"),
  gestorId: integer("gestor_id").notNull().references(() => gestores.id),
  dataAdmissao: date("data_admissao"),
});

export const desligamentos = pgTable("desligamentos", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  dataDesligamento: date("data_desligamento").notNull(),
  motivo: text("motivo"),
  funcionarioId: integer("funcionario_id").notNull().references(() => funcionarios.id),
  empresaId: integer("empresa_id").notNull().references(() => empresas.id),
  gestorId: integer("gestor_id").notNull().references(() => gestores.id),
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

export const formulariosExperiencia = pgTable("formularios_experiencia", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  funcionarioId: integer("funcionario_id").notNull().references(() => funcionarios.id),
  gestorId: integer("gestor_id").notNull().references(() => gestores.id),
  dataLimite: date("data_limite").notNull(),
  status: text("status").notNull().default("pendente"),
  dataPreenchimento: date("data_preenchimento"),
  desempenho: integer("desempenho"),
  pontosFortes: text("pontos_fortes"),
  pontosMelhoria: text("pontos_melhoria"),
  recomendacao: text("recomendacao"),
  observacoes: text("observacoes"),
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

export const insertEmpresaSchema = createInsertSchema(empresas).omit({
  id: true,
});

export const insertGestorSchema = createInsertSchema(gestores).omit({
  id: true,
});

export const insertFuncionarioSchema = createInsertSchema(funcionarios).omit({
  id: true,
});

export const insertDesligamentoSchema = createInsertSchema(desligamentos).omit({
  id: true,
});

export const insertDocumentoFuncionarioSchema = createInsertSchema(documentosFuncionario).omit({
  id: true,
});

export const insertDocumentoGestorSchema = createInsertSchema(documentosGestor).omit({
  id: true,
});

export const insertFormularioExperienciaSchema = createInsertSchema(formulariosExperiencia).omit({
  id: true,
});

export const insertPesquisaClimaSchema = createInsertSchema(pesquisasClima).omit({
  id: true,
});

export const insertPerguntaClimaSchema = createInsertSchema(perguntasClima).omit({
  id: true,
});

export const insertRespostaClimaSchema = createInsertSchema(respostasClima).omit({
  id: true,
});

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

export type InsertFormularioExperiencia = z.infer<typeof insertFormularioExperienciaSchema>;
export type FormularioExperiencia = typeof formulariosExperiencia.$inferSelect;

export type InsertPesquisaClima = z.infer<typeof insertPesquisaClimaSchema>;
export type PesquisaClima = typeof pesquisasClima.$inferSelect;

export type InsertPerguntaClima = z.infer<typeof insertPerguntaClimaSchema>;
export type PerguntaClima = typeof perguntasClima.$inferSelect;

export type InsertRespostaClima = z.infer<typeof insertRespostaClimaSchema>;
export type RespostaClima = typeof respostasClima.$inferSelect;
