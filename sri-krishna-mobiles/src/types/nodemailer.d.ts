declare module "nodemailer" {
  export interface Transporter {
    sendMail(mailOptions: {
      from?: string;
      to: string;
      subject: string;
      html?: string;
      text?: string;
      attachments?: Array<{
        filename?: string;
        content?: string | Buffer;
        path?: string;
      }>;
    }): Promise<{ messageId: string }>;
  }

  export interface TransportOptions {
    host?: string;
    port?: number;
    secure?: boolean;
    auth?: {
      user?: string;
      pass?: string;
    };
  }

  export function createTransporter(options: TransportOptions): Transporter;
}
