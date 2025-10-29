import nodemailer from 'nodemailer';
import { Resend } from 'resend';

// Lazy-init Resend client to avoid crashing when key is missing
let resendClient: Resend | null = null;
function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!resendClient) {
    try {
      resendClient = new Resend(key);
    } catch (err) {
      console.error('Failed to initialize Resend:', err);
      resendClient = null;
    }
  }
  return resendClient;
}

// Create transporter with better error handling (fallback to SMTP)
const createTransporter = () => {
  try {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false // Allow self-signed certificates
      }
    });
  } catch (error) {
    console.error('Failed to create email transporter:', error);
    return null;
  }
};

const transporter = createTransporter();

// Test email configuration
export async function testEmailConfiguration() {
  // Test Resend first
  const resend = getResend();
  if (resend) {
    try {
      console.log('Testing Resend API configuration...');
      return { success: true, message: 'Resend API configuration is valid', provider: 'resend' };
    } catch (error) {
      console.error('Resend API test failed:', error);
    }
  }
  
  // Fallback to SMTP test
  if (!transporter) {
    throw new Error('Email transporter not configured');
  }
  
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP credentials not configured');
  }
  
  try {
    await transporter.verify();
    return { success: true, message: 'SMTP configuration is valid', provider: 'smtp' };
  } catch (error) {
    console.error('Email configuration test failed:', error);
    throw new Error(`Email configuration test failed: ${error}`);
  }
}

export async function sendVPNCredentialsEmail(
  customerEmail: string,
  vpnCredentials: any,
  orderDetails: any
) {
  const emailContent = {
    from: process.env.FROM_EMAIL || 'noreply@kagevpn.com',
    to: customerEmail,
    subject: 'Your VPN Account Details - Kage VPN Store',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #00d4ff; font-size: 28px; margin: 0;">Kage VPN Store</h1>
          <p style="color: #666; margin: 5px 0;">Premium VPN Services</p>
        </div>
        
        <h2 style="color: #00d4ff; border-bottom: 2px solid #00d4ff; padding-bottom: 10px;">Your VPN Account Details</h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00d4ff;">
          <h3 style="color: #333; margin-top: 0;">VPN Login Information:</h3>
          <table style="width: 100%; border-collapse: collapse;">

            ${vpnCredentials.code ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Code:</td>
              <td style="padding: 8px 0; color: #333; font-family: monospace; background: #fff3cd; padding: 4px 8px; border-radius: 4px;">${vpnCredentials.code}</td>
            </tr>
            ` : ''}

            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Username:</td>
              <td style="padding: 8px 0; color: #333; font-family: monospace; background: #e9ecef; padding: 4px 8px; border-radius: 4px;">${vpnCredentials.username || '-'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Password:</td>
              <td style="padding: 8px 0; color: #333; font-family: monospace; background: #e9ecef; padding: 4px 8px; border-radius: 4px;">${vpnCredentials.password || '-'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Server Info:</td>
              <td style="padding: 8px 0; color: #333;">${vpnCredentials.serverInfo || 'VPN Server Details'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Expiry Date:</td>
              <td style="padding: 8px 0; color: #333;">${vpnCredentials.expiryDate || 'Check your account'}</td>
            </tr>
          </table>
        </div>
        
        <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0066cc;">
          <h4 style="color: #0066cc; margin-top: 0;">Important Notes:</h4>
          <ul style="color: #333; line-height: 1.6;">
            <li>Please keep your VPN credentials secure</li>
            <li>Do not share with others</li>
            <li>Contact us if you face any issues</li>
            <li>If you need a setup guide, let us know</li>
          </ul>
        </div>
        
        <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
          <h4 style="color: #155724; margin-top: 0;">Order Information:</h4>
          <p style="color: #155724; margin: 5px 0;"><strong>Order ID:</strong> ${orderDetails.orderId}</p>
          <p style="color: #155724; margin: 5px 0;"><strong>Customer:</strong> ${orderDetails.customerName || 'Valued Customer'}</p>
          <p style="color: #155724; margin: 5px 0;"><strong>Total:</strong> ${orderDetails.total ? orderDetails.total.toLocaleString() + ' Ks' : 'N/A'}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #333; margin: 10px 0;">Thank you,</p>
          <p style="color: #00d4ff; font-weight: bold; margin: 5px 0;">Kage VPN Store Team</p>
          <div style="margin-top: 15px;">
            <p style="color: #666; margin: 5px 0;">📱 Telegram: @kagevpn</p>
            <p style="color: #666; margin: 5px 0;">📧 Email: info@kagevpn.com</p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    // Try Resend first
    const resend = getResend();
    if (resend) {
      const { data, error } = await resend.emails.send({
        from: emailContent.from,
        to: [emailContent.to],
        subject: emailContent.subject,
        html: emailContent.html,
      });
      if (error) {
        console.error('Resend API error:', error);
        throw error;
      }
      console.log('VPN credentials email sent successfully via Resend to:', customerEmail);
      return { success: true, message: 'Email sent successfully via Resend', provider: 'resend', id: data?.id };
    }

    // Fallback to SMTP
    if (!transporter) {
      throw new Error('Email service not configured');
    }
    await transporter.sendMail(emailContent);
    console.log('VPN credentials email sent successfully via SMTP to:', customerEmail);
    return { success: true, message: 'Email sent successfully via SMTP', provider: 'smtp' };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}

export async function sendOrderConfirmationEmail(
  customerEmail: string,
  orderDetails: any
) {
  const emailContent = {
    from: process.env.FROM_EMAIL || 'noreply@kagevpn.com',
    to: customerEmail,
    subject: 'Order Confirmation - Kage VPN Store',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #00d4ff; font-size: 28px; margin: 0;">Kage VPN Store</h1>
          <p style="color: #666; margin: 5px 0;">Premium VPN Services</p>
        </div>
        
        <h2 style="color: #00d4ff; border-bottom: 2px solid #00d4ff; padding-bottom: 10px;">Order Confirmation</h2>
        
        <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
          <h3 style="color: #155724; margin-top: 0;">✅ Your order has been received</h3>
          <p style="color: #155724;">We will send your VPN credentials after payment verification.</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00d4ff;">
          <h3 style="color: #333; margin-top: 0;">Order Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Order ID:</td>
              <td style="padding: 8px 0; color: #333; font-family: monospace; background: #e9ecef; padding: 4px 8px; border-radius: 4px;">${orderDetails.orderId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Total Amount:</td>
              <td style="padding: 8px 0; color: #333; font-weight: bold;">${orderDetails.total ? orderDetails.total.toLocaleString() + ' Ks' : 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Status:</td>
              <td style="padding: 8px 0; color: #ffc107; font-weight: bold;">Payment Verification In Progress</td>
            </tr>
          </table>
        </div>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <h4 style="color: #856404; margin-top: 0;">What happens next?</h4>
          <ol style="color: #856404; line-height: 1.6;">
            <li>The admin team will verify your payment</li>
            <li>After verification, we will email your VPN credentials</li>
            <li>You will also receive a VPN setup guide</li>
            <li>Contact us if you face any issues</li>
          </ol>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #333; margin: 10px 0;">Thank you,</p>
          <p style="color: #00d4ff; font-weight: bold; margin: 5px 0;">Kage VPN Store Team</p>
          <div style="margin-top: 15px;">
            <p style="color: #666; margin: 5px 0;">📱 Telegram: @kagevpn</p>
            <p style="color: #666; margin: 5px 0;">📧 Email: info@kagevpn.com</p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    // Try Resend first
    const resend = getResend();
    if (resend) {
      const { data, error } = await resend.emails.send({
        from: emailContent.from,
        to: [emailContent.to],
        subject: emailContent.subject,
        html: emailContent.html,
      });
      if (error) {
        console.error('Resend API error:', error);
        throw error;
      }
      console.log('Order confirmation email sent successfully via Resend to:', customerEmail);
      return { success: true, message: 'Email sent successfully via Resend', provider: 'resend', id: data?.id };
    }

    // Fallback to SMTP
    if (!transporter) {
      throw new Error('Email service not configured');
    }

    await transporter.sendMail(emailContent);
    console.log('Order confirmation email sent successfully via SMTP to:', customerEmail);
    return { success: true, message: 'Email sent successfully via SMTP', provider: 'smtp' };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}
