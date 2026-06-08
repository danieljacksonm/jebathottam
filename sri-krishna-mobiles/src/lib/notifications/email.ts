import nodemailer from "nodemailer";

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export type EmailTemplate =
  | "order_confirmation"
  | "order_shipped"
  | "order_delivered"
  | "payment_received"
  | "refund_processed"
  | "welcome"
  | "password_reset"
  | "low_stock_alert";

interface EmailData {
  to: string;
  subject: string;
  template: EmailTemplate;
  data: Record<string, any>;
}

const getEmailTemplate = (template: EmailTemplate, data: Record<string, any>) => {
  const templates: Record<EmailTemplate, { subject: string; html: string }> = {
    order_confirmation: {
      subject: `Order Confirmed - #${data.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Thank you for your order!</h2>
          <p>Hi ${data.customerName},</p>
          <p>Your order <strong>#${data.orderId}</strong> has been confirmed.</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Summary</h3>
            <p><strong>Total:</strong> ₹${data.total}</p>
            <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
            <p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>
          </div>
          <p>You can track your order status at: <a href="${data.trackingUrl}">Track Order</a></p>
          <p style="color: #6b7280; font-size: 12px;">Sri Krishna Mobiles - Your trusted mobile accessories partner</p>
        </div>
      `,
    },
    order_shipped: {
      subject: `Your Order #${data.orderId} has been shipped`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Order Shipped!</h2>
          <p>Hi ${data.customerName},</p>
          <p>Great news! Your order <strong>#${data.orderId}</strong> has been shipped.</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Tracking Details</h3>
            <p><strong>Courier:</strong> ${data.courier}</p>
            <p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
            <p><a href="${data.trackingUrl}" style="background: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Track Package</a></p>
          </div>
          <p style="color: #6b7280; font-size: 12px;">Sri Krishna Mobiles</p>
        </div>
      `,
    },
    order_delivered: {
      subject: `Order Delivered - #${data.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22c55e;">Order Delivered!</h2>
          <p>Hi ${data.customerName},</p>
          <p>Your order <strong>#${data.orderId}</strong> has been delivered.</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p>We hope you enjoy your purchase!</p>
            <p><a href="${data.reviewUrl}" style="background: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Leave a Review</a></p>
          </div>
          <p style="color: #6b7280; font-size: 12px;">Sri Krishna Mobiles</p>
        </div>
      `,
    },
    payment_received: {
      subject: `Payment Received - Order #${data.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22c55e;">Payment Confirmed</h2>
          <p>Hi ${data.customerName},</p>
          <p>We have received your payment of <strong>₹${data.amount}</strong> for order <strong>#${data.orderId}</strong>.</p>
          <p>Payment Method: ${data.paymentMethod}</p>
          <p>Transaction ID: ${data.transactionId}</p>
          <p style="color: #6b7280; font-size: 12px;">Sri Krishna Mobiles</p>
        </div>
      `,
    },
    refund_processed: {
      subject: `Refund Processed - Order #${data.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Refund Processed</h2>
          <p>Hi ${data.customerName},</p>
          <p>Your refund of <strong>₹${data.amount}</strong> for order <strong>#${data.orderId}</strong> has been processed.</p>
          <p>Refund Method: ${data.refundMethod}</p>
          <p>Expected credit: ${data.expectedCredit} business days</p>
          <p style="color: #6b7280; font-size: 12px;">Sri Krishna Mobiles</p>
        </div>
      `,
    },
    welcome: {
      subject: "Welcome to Sri Krishna Mobiles!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Welcome to Sri Krishna Mobiles!</h2>
          <p>Hi ${data.name},</p>
          <p>Thank you for joining us! We're excited to have you as a customer.</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Your account details:</strong></p>
            <p>Email: ${data.email}</p>
          </div>
          <p><a href="${data.shopUrl}" style="background: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Start Shopping</a></p>
          <p style="color: #6b7280; font-size: 12px;">Sri Krishna Mobiles</p>
        </div>
      `,
    },
    password_reset: {
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Reset Your Password</h2>
          <p>Hi ${data.name},</p>
          <p>We received a request to reset your password. Click the button below to set a new password:</p>
          <p><a href="${data.resetUrl}" style="background: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
          <p style="color: #6b7280; font-size: 12px;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
        </div>
      `,
    },
    low_stock_alert: {
      subject: `Low Stock Alert - ${data.productName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">Low Stock Alert</h2>
          <p>The following product is running low on stock:</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Product:</strong> ${data.productName}</p>
            <p><strong>SKU:</strong> ${data.sku}</p>
            <p><strong>Current Stock:</strong> ${data.currentStock}</p>
            <p><strong>Reorder Point:</strong> ${data.reorderPoint}</p>
          </div>
          <p><a href="${data.inventoryUrl}" style="background: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Inventory</a></p>
        </div>
      `,
    },
  };

  return templates[template];
};

export async function sendEmail({ to, template, data }: Omit<EmailData, "subject">) {
  const emailTemplate = getEmailTemplate(template, data);

  try {
    await transporter.sendMail({
      from: `"Sri Krishna Mobiles" <${process.env.EMAIL_USER}>`,
      to,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });
    return { success: true };
  } catch (error) {
    console.error("Email send failed:", error);
    return { success: false, error };
  }
}

export async function sendBulkEmails(recipients: string[], template: EmailData) {
  const results = await Promise.all(
    recipients.map((to) => sendEmail({ ...template, to }))
  );
  return results;
}
