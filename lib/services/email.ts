import { Resend } from 'resend';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export class EmailService {
    private resend: Resend;

    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
    }

    async sendEmail(options: EmailOptions): Promise<void> {
        try {
            const { data, error } = await this.resend.emails.send({
                from: 'Trend Digital Trade <onboarding@resend.dev>', // Temporal, cambiaremos a tu dominio
                to: options.to,
                subject: options.subject,
                html: options.html,
            });

            if (error) {
                console.error('Error sending email:', error);
                throw error;
            }

            console.log('Message sent:', data?.id);
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    async sendOrderConfirmation(to: string, orderDetails: any): Promise<void> {
        const subject = '¡Tu pedido está en camino! 🚀 - Trend Digital Trade';
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #ff5722;">¡Gracias por tu compra!</h1>
                <p>Hola,</p>
                <p>Tu pedido ha sido recibido y ya está siendo procesado por nuestro sistema.</p>
                <p><strong>Detalles del pedido:</strong></p>
                <ul>
                    <li>Servicio: ${orderDetails.serviceName}</li>
                    <li>Cantidad: ${orderDetails.amount}</li>
                    <li>Precio: ${orderDetails.price}</li>
                </ul>
                <p>Comenzarás a ver resultados en breve. Si tienes alguna pregunta, no dudes en responder a este correo.</p>
                <p>Atentamente,<br>El equipo de Trend Digital Trade</p>
            </div>
        `;

        await this.sendEmail({ to, subject, html });
    }

    async sendFollowUpEmail(to: string, serviceName: string): Promise<void> {
        const subject = '¿Cómo va tu crecimiento? 📈 - Trend Digital Trade';
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #ff5722;">¡Esperamos que estés disfrutando tus resultados!</h1>
                <p>Hola,</p>
                <p>Hace poco adquiriste nuestro servicio de <strong>${serviceName}</strong> y queríamos asegurarnos de que todo esté funcionando a la perfección.</p>
                <p>¿Sabías que combinar servicios acelera el crecimiento hasta un 300%? Muchos de nuestros usuarios que compran seguidores también potencian sus posts con likes y vistas.</p>
                <p><a href="https://trenddigitaltrade.com/servicios" style="background-color: #ff5722; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ver ofertas exclusivas</a></p>
                <p>Si tienes alguna duda o necesitas una estrategia personalizada, estamos aquí para ayudarte.</p>
                <p>Saludos,<br>El equipo de Trend Digital Trade</p>
            </div>
        `;

        await this.sendEmail({ to, subject, html });
    }

    async sendAbandonedCartEmail(to: string, cartDetails: any): Promise<void> {
        const subject = '¿Olvidaste algo? 🤔 - Tu crecimiento te espera';
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #ff5722;">¡No dejes pasar esta oportunidad!</h1>
                <p>Hola,</p>
                <p>Notamos que dejaste algo en tu carrito. Tu camino hacia la viralidad está a un solo clic de distancia.</p>
                <p><strong>En tu carrito:</strong> ${cartDetails.serviceName} (${cartDetails.amount})</p>
                <p>Completa tu compra ahora y recibe un <strong>10% de descuento extra</strong> con el código: <strong>VIRAL10</strong>.</p>
                <p><a href="https://trenddigitaltrade.com/servicios" style="background-color: #ff5722; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Completar mi pedido</a></p>
                <p>¡Te esperamos!</p>
                <p>Atentamente,<br>El equipo de Trend Digital Trade</p>
            </div>
        `;

        await this.sendEmail({ to, subject, html });
    }
}

// Factory function instead of singleton to ensure env vars are loaded
export function getEmailService(): EmailService {
    return new EmailService();
}

// For backwards compatibility
export const emailService = {
    sendEmail: async (options: EmailOptions) => getEmailService().sendEmail(options),
    sendOrderConfirmation: async (to: string, orderDetails: any) =>
        getEmailService().sendOrderConfirmation(to, orderDetails),
    sendFollowUpEmail: async (to: string, serviceName: string) =>
        getEmailService().sendFollowUpEmail(to, serviceName),
    sendAbandonedCartEmail: async (to: string, cartDetails: any) =>
        getEmailService().sendAbandonedCartEmail(to, cartDetails)
};
