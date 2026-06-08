export type SMSTemplate =
  | "order_confirmation"
  | "order_shipped"
  | "order_delivered"
  | "otp"
  | "payment_received"
  | "refund_processed"
  | "promotional";

interface SMSData {
  to: string;
  template: SMSTemplate;
  data: Record<string, any>;
}

const getSMSTemplate = (template: SMSTemplate, data: Record<string, any>): string => {
  const templates: Record<SMSTemplate, string> = {
    order_confirmation: `Hi ${data.customerName}, your order #${data.orderId} for Rs.${data.total} has been confirmed. Track at: ${data.trackingUrl}. Thanks, Sri Krishna Mobiles`,

    order_shipped: `Hi ${data.customerName}, your order #${data.orderId} has been shipped via ${data.courier}. Track: ${data.trackingNumber}. Sri Krishna Mobiles`,

    order_delivered: `Hi ${data.customerName}, your order #${data.orderId} has been delivered. Thank you for shopping with Sri Krishna Mobiles!`,

    otp: `Your OTP for Sri Krishna Mobiles is ${data.otp}. Valid for 10 minutes. Do not share this with anyone.`,

    payment_received: `Payment of Rs.${data.amount} received for order #${data.orderId}. Thank you! Sri Krishna Mobiles`,

    refund_processed: `Refund of Rs.${data.amount} for order #${data.orderId} has been processed. Credit in ${data.expectedCredit} days. Sri Krishna Mobiles`,

    promotional: `${data.message}. Shop now at srikrishnamobiles.com. Unsubscribe: reply STOP. Sri Krishna Mobiles`,
  };

  return templates[template];
};

// Twilio SMS Provider
async function sendTwilioSMS(phone: string, message: string): Promise<{ success: boolean; error?: any }> {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error("Twilio credentials not configured");
    }

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`${accountSid}:${authToken}`),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: phone,
        From: fromNumber,
        Body: message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Twilio API error: ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Twilio SMS failed:", error);
    return { success: false, error };
  }
}

// Fast2SMS Provider (India-specific, cheaper alternative)
async function sendFast2SMS(phone: string, message: string): Promise<{ success: boolean; error?: any }> {
  try {
    const apiKey = process.env.FAST2SMS_API_KEY;

    if (!apiKey) {
      throw new Error("Fast2SMS API key not configured");
    }

    // Remove +91 or 0 prefix if present
    const cleanPhone = phone.replace(/^\+91|^0/, "");

    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "q",
        message: message,
        language: "english",
        numbers: cleanPhone,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.return) {
      throw new Error(data.message || "Fast2SMS API error");
    }

    return { success: true };
  } catch (error) {
    console.error("Fast2SMS failed:", error);
    return { success: false, error };
  }
}

// MSG91 Provider (another Indian SMS provider)
async function sendMSG91(phone: string, message: string, templateId?: string): Promise<{ success: boolean; error?: any }> {
  try {
    const authKey = process.env.MSG91_AUTH_KEY;
    const senderId = process.env.MSG91_SENDER_ID || "SKMOBS";

    if (!authKey) {
      throw new Error("MSG91 auth key not configured");
    }

    // Remove +91 prefix if present, add 91 if not present
    let cleanPhone = phone.replace(/^\+/, "");
    if (!cleanPhone.startsWith("91")) {
      cleanPhone = "91" + cleanPhone;
    }

    const url = new URL("https://api.msg91.com/api/v5/flow/");
    url.searchParams.append("authkey", authKey);

    const body: any = {
      sender: senderId,
      route: "4", // Transactional route
      to: [{ mobiles: cleanPhone }],
    };

    if (templateId) {
      body.template_id = templateId;
    } else {
      body.message = message;
    }

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`MSG91 API error: ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error("MSG91 SMS failed:", error);
    return { success: false, error };
  }
}

export async function sendSMS({ to, template, data }: SMSData): Promise<{ success: boolean; error?: any }> {
  const message = getSMSTemplate(template, data);
  const provider = process.env.SMS_PROVIDER || "twilio";

  switch (provider) {
    case "twilio":
      return sendTwilioSMS(to, message);
    case "fast2sms":
      return sendFast2SMS(to, message);
    case "msg91":
      return sendMSG91(to, message, data.templateId);
    default:
      // Fallback to console log for development
      console.log(`[SMS to ${to}]: ${message}`);
      return { success: true };
  }
}

export async function sendBulkSMS(recipients: string[], template: SMSData): Promise<{ success: boolean; error?: any }[]> {
  const results = await Promise.all(
    recipients.map((to) => sendSMS({ ...template, to }))
  );
  return results;
}

// OTP Generation and Verification
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

export function generateOTP(phone: string): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(phone, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  });
  return otp;
}

export function verifyOTP(phone: string, otp: string): boolean {
  const record = otpStore.get(phone);
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    otpStore.delete(phone);
    return false;
  }
  if (record.otp === otp) {
    otpStore.delete(phone);
    return true;
  }
  return false;
}

export async function sendOTP(phone: string): Promise<{ success: boolean; otp?: string; error?: any }> {
  const otp = generateOTP(phone);

  const result = await sendSMS({
    to: phone,
    template: "otp",
    data: { otp },
  });

  if (result.success) {
    // In production, don't return the OTP
    return { success: true, otp: process.env.NODE_ENV === "development" ? otp : undefined };
  }

  return { success: false, error: result.error };
}
