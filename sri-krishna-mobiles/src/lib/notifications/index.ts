export { sendEmail, sendBulkEmails, type EmailTemplate } from "./email";
export { sendSMS, sendBulkSMS, sendOTP, verifyOTP, type SMSTemplate } from "./sms";

// Combined notification service
interface NotificationData {
  email?: string;
  phone?: string;
  template: {
    email?: import("./email").EmailTemplate;
    sms?: import("./sms").SMSTemplate;
  };
  data: Record<string, any>;
}

export async function sendNotification({ email, phone, template, data }: NotificationData) {
  const results: { email?: any; sms?: any } = {};

  if (email && template.email) {
    const { sendEmail } = await import("./email");
    results.email = await sendEmail({
      to: email,
      template: template.email,
      data,
    });
  }

  if (phone && template.sms) {
    const { sendSMS } = await import("./sms");
    results.sms = await sendSMS({
      to: phone,
      template: template.sms,
      data,
    });
  }

  return results;
}

// Order notifications helper
export async function sendOrderNotification(
  order: {
    id: string;
    customer: { email?: string; phone?: string; name: string };
    total: number;
    status: string;
  },
  type: "confirmation" | "shipped" | "delivered" | "payment_received" | "refund"
) {
  const templates: Record<string, { email: import("./email").EmailTemplate; sms: import("./sms").SMSTemplate }> = {
    confirmation: { email: "order_confirmation", sms: "order_confirmation" },
    shipped: { email: "order_shipped", sms: "order_shipped" },
    delivered: { email: "order_delivered", sms: "order_delivered" },
    payment_received: { email: "payment_received", sms: "payment_received" },
    refund: { email: "refund_processed", sms: "refund_processed" },
  };

  const template = templates[type];
  if (!template) return;

  return sendNotification({
    email: order.customer.email,
    phone: order.customer.phone,
    template,
    data: {
      orderId: order.id,
      customerName: order.customer.name,
      total: order.total,
      status: order.status,
    },
  });
}
