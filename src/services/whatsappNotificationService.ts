/**
 * WhatsApp Notification Service (Future-ready)
 * 
 * IMPORTANT: This service is currently disabled.
 * Automatic message sending requires integration with the OFFICIAL WhatsApp Business Cloud API.
 * 
 * To implement this in the future:
 * 1. Obtain a Meta Developer account and WhatsApp Business Platform credentials.
 * 2. Configure a permanent access token and phone number ID.
 * 3. Implement the POST request to the Meta graph API.
 * 
 * NEVER use unofficial automation bot libraries or browser automation tools 
 * as they violate WhatsApp terms of service and can lead to account bans.
 */

// import axios from 'axios'; // You would need axios or fetch

export const whatsappNotificationService = {
  isEnabled: false, // Keep it disabled by default

  async sendOrderConfirmation(orderData: any) {
    if (!this.isEnabled) {
      console.log('WhatsApp Automatic Notification is currently disabled. Order saved to database.');
      return;
    }

    // Example of how the implementation would look with Cloud API:
    /*
    const WHATSAPP_TOKEN = process.env.WHATSAPP_CLOUD_API_TOKEN;
    const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
    
    try {
      await fetch(`https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: orderData.customerPhone,
          type: "template",
          template: {
            name: "order_confirmation",
            language: { code: "pt_BR" },
            components: [
              // Components with order details
            ]
          }
        })
      });
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
    }
    */
  }
};
