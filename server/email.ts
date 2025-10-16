// Email service module
// Nota: A integração Resend foi rejeitada pelo usuário
// TODO: Configurar credenciais SMTP ou serviço de email quando fornecidas

import crypto from 'crypto';

export function generateQuestionarioToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function getTokenExpiry(): Date {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7); // Token válido por 7 dias
  return expiry;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  // TODO: Implementar envio de email real quando credenciais forem fornecidas
  console.log('📧 Email simulado (configurar SMTP):', {
    to: options.to,
    subject: options.subject,
    preview: options.html.substring(0, 100) + '...'
  });
  
  return true; // Simular sucesso por enquanto
}

export function criarEmailQuestionario(
  nomeColaborador: string,
  empresaNome: string,
  tipoDesligamento: string,
  linkQuestionario: string
): string {
  const tipoTexto = tipoDesligamento === 'funcionario' 
    ? 'por iniciativa do colaborador' 
    : 'por iniciativa da empresa';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9fafb; padding: 30px; }
        .button { 
          display: inline-block;
          background-color: #4F46E5;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Questionário de Desligamento</h1>
        </div>
        <div class="content">
          <p>Olá <strong>${nomeColaborador}</strong>,</p>
          
          <p>A empresa <strong>${empresaNome}</strong> solicita o preenchimento do questionário de desligamento ${tipoTexto}.</p>
          
          <p>Sua opinião é muito importante para nós e nos ajudará a melhorar continuamente nossos processos.</p>
          
          <p>Para responder ao questionário, clique no botão abaixo:</p>
          
          <div style="text-align: center;">
            <a href="${linkQuestionario}" class="button">Responder Questionário</a>
          </div>
          
          <p style="margin-top: 20px; font-size: 14px; color: #666;">
            <strong>Observações importantes:</strong><br>
            - Este link é válido por 7 dias<br>
            - O link é de uso único e pessoal<br>
            - Suas respostas serão tratadas com confidencialidade
          </p>
        </div>
        <div class="footer">
          <p>Sistema de Gestão de RH - ${empresaNome}</p>
          <p>Este é um email automático, por favor não responda.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
