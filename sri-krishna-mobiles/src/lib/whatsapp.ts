interface WhatsAppShareData {
  phone?: string;
  message: string;
}

export function shareOnWhatsApp(data: WhatsAppShareData): void {
  const encodedMessage = encodeURIComponent(data.message);

  if (data.phone) {
    // Direct message to a phone number
    const cleanPhone = data.phone.replace(/\D/g, "");
    const url = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    window.open(url, "_blank");
  } else {
    // Share without specific contact
    const url = `https://wa.me/?text=${encodedMessage}`;
    window.open(url, "_blank");
  }
}

export function shareBillOnWhatsApp(bill: {
  id: string;
  customer: { name: string; phone?: string };
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  date: string;
}): void {
  const itemsList = bill.items
    .map((item) => `• ${item.name} x${item.quantity} = ₹${item.price * item.quantity}`)
    .join("\n");

  const message = `
*SRI KRISHNA MOBILES*
Bill: ${bill.id}
Date: ${bill.date}

*Customer:* ${bill.customer.name}

*Items:*
${itemsList}

*Total: ₹${bill.total}*

Thank you for shopping with us!
  `.trim();

  shareOnWhatsApp({
    phone: bill.customer.phone,
    message,
  });
}

export function shareReceiptOnWhatsApp(receipt: {
  id: string;
  customer: { name: string; phone?: string };
  total: number;
  date: string;
  items: Array<{ name: string; quantity: number; price: number }>;
}): void {
  const itemsList = receipt.items
    .map((item) => `• ${item.name} x${item.quantity}`)
    .join("\n");

  const message = `
🧾 *RECEIPT - Sri Krishna Mobiles*

Receipt #: ${receipt.id}
Date: ${receipt.date}
Customer: ${receipt.customer.name}

📦 Items:
${itemsList}

💰 *Total Paid: ₹${receipt.total}*

Thank you for your purchase! 🙏
  `.trim();

  shareOnWhatsApp({
    phone: receipt.customer.phone,
    message,
  });
}

export function sharePromotionOnWhatsApp(phone: string, message: string): void {
  const formattedMessage = `
*SRI KRISHNA MOBILES*

${message}

🛒 Shop now: srikrishnamobiles.com
📞 Call: +91-XXXXXXXXXX
📍 Visit our store today!
  `.trim();

  shareOnWhatsApp({
    phone,
    message: formattedMessage,
  });
}

// Generate WhatsApp Business API compatible message template
export function generateWhatsAppTemplate(
  templateName: string,
  language: string,
  components: Array<{
    type: "header" | "body" | "footer";
    parameters: Array<{ type: "text"; text: string }>;
  }>
): object {
  return {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    type: "template",
    template: {
      name: templateName,
      language: { code: language },
      components,
    },
  };
}
