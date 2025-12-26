/**
 * Email Dispatcher Service
 * 
 * Sends emails using Resend email service.
 * Handles user notifications like password resets, magic links, account confirmations, etc.
 */

import { getConfig } from "../lib/config"

// ============================================================================
// TYPES
// ============================================================================

export interface EmailPayload {
  to: string
  subject: string
  html: string
  text?: string
  from?: string
  replyTo?: string
}

export interface PasswordResetPayload {
  email: string
  resetToken: string
  resetUrl: string
}

export interface MagicLinkPayload {
  email: string
  magicToken: string
  magicUrl: string
}

export interface VerificationEmailPayload {
  email: string
  verificationToken: string
  verificationUrl: string
}

// ============================================================================
// EMAIL SERVICE
// ============================================================================

/**
 * Send a raw email using Resend
 */
export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; error?: string }> {
  try {
    const resendApiKey = await getConfig("resend_api_key")
    const siteUrl = await getConfig("site_url")
    const siteName = await getConfig("site_name") || "NodeByte"

    if (!resendApiKey) {
      console.warn("[Email] Resend API key not configured. Email not sent.")
      return { success: false, error: "resend_api_key_not_configured" }
    }

    const fromEmail = payload.from || `noreply@${new URL(siteUrl || "http://localhost").hostname}`

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        replyTo: payload.replyTo,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("[Email] Resend API error:", error)
      return { success: false, error: "resend_api_error" }
    }

    const data = await response.json()
    console.log(`[Email] Message sent successfully to ${payload.to}`, data)
    return { success: true }
  } catch (error) {
    console.error("[Email] Failed to send email:", error)
    return { success: false, error: "email_send_failed" }
  }
}

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(payload: PasswordResetPayload): Promise<{ success: boolean; error?: string }> {
  const siteName = await getConfig("site_name") || "NodeByte"
  const siteUrl = await getConfig("site_url") || "https://nodebyte.host"

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            padding: 20px;
            min-height: 100vh;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
            padding: 32px 24px;
            text-align: center;
            color: white;
          }
          .header h1 { font-size: 24px; font-weight: 600; margin-bottom: 8px; }
          .header p { opacity: 0.9; font-size: 14px; }
          .body {
            padding: 32px 24px;
            color: #333;
          }
          .body p { margin-bottom: 16px; line-height: 1.6; color: #555; }
          .reset-button-container {
            text-align: center;
            margin: 32px 0;
          }
          .reset-button {
            display: inline-block;
            padding: 12px 32px;
            background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            transition: opacity 0.3s ease;
          }
          .reset-button:hover { opacity: 0.9; }
          .code-block {
            background: #f8fafc;
            border-left: 4px solid #3b82f6;
            padding: 16px;
            margin: 24px 0;
            border-radius: 4px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 13px;
            color: #333;
            word-break: break-all;
          }
          .warning {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 16px;
            margin: 24px 0;
            border-radius: 4px;
            font-size: 14px;
            color: #92400e;
          }
          .footer {
            background: #f8fafc;
            padding: 24px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #e2e8f0;
          }
          .footer a { color: #3b82f6; text-decoration: none; }
          .footer-divider { display: inline-block; width: 4px; height: 4px; background: #999; border-radius: 50%; margin: 0 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Reset Your Password</h1>
            <p>${siteName}</p>
          </div>
          <div class="body">
            <p>Hi ${payload.email},</p>
            <p>We received a request to reset your password. Click the button below to set a new password:</p>
            <div class="reset-button-container">
              <a href="${payload.resetUrl}" class="reset-button">Reset Password</a>
            </div>
            <p>Or copy and paste this link in your browser:</p>
            <div class="code-block">${payload.resetUrl}</div>
            <div class="warning">
              <strong>⏰ This link expires in 24 hours.</strong> If you didn't request a password reset, you can safely ignore this email. Your account remains secure.
            </div>
            <p>If you have any issues, please contact our support team.</p>
            <p>Best regards,<br><strong>${siteName} Team</strong></p>
          </div>
          <div class="footer">
            <p>
              <a href="${siteUrl}">Visit ${siteName}</a>
              <span class="footer-divider"></span>
              <a href="${siteUrl}/contact">Contact Support</a>
              <span class="footer-divider"></span>
              © ${new Date().getFullYear()} ${siteName}. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: payload.email,
    subject: `Reset Your Password - ${siteName}`,
    html,
  })
}

/**
 * Send magic link email for passwordless login
 */
export async function sendMagicLinkEmail(payload: MagicLinkPayload): Promise<{ success: boolean; error?: string }> {
  const siteName = await getConfig("site_name") || "NodeByte"
  const siteUrl = await getConfig("site_url") || "https://nodebyte.host"

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sign in to ${siteName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            padding: 20px;
            min-height: 100vh;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            padding: 32px 24px;
            text-align: center;
            color: white;
          }
          .header h1 { font-size: 28px; font-weight: 600; margin-bottom: 8px; }
          .header p { opacity: 0.9; font-size: 14px; }
          .body {
            padding: 32px 24px;
            color: #333;
          }
          .body p { margin-bottom: 16px; line-height: 1.6; color: #555; }
          .cta-button-container {
            text-align: center;
            margin: 32px 0;
          }
          .cta-button {
            display: inline-block;
            padding: 14px 36px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            transition: opacity 0.3s ease;
            font-size: 16px;
          }
          .cta-button:hover { opacity: 0.9; }
          .code-block {
            background: #f0fdf4;
            border-left: 4px solid #10b981;
            padding: 16px;
            margin: 24px 0;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            word-break: break-all;
            color: #166534;
            line-height: 1.8;
          }
          .security-note {
            background: #dbeafe;
            border: 1px solid #93c5fd;
            border-radius: 4px;
            padding: 16px;
            margin: 24px 0;
            font-size: 13px;
            color: #075985;
          }
          .security-note strong { color: #1e40af; }
          .expiry-warning {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 4px;
            padding: 16px;
            margin: 24px 0;
            font-size: 13px;
            color: #92400e;
          }
          .expiry-warning strong { color: #b45309; }
          .footer {
            background: #f8fafc;
            padding: 24px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #e2e8f0;
          }
          .footer a { color: #10b981; text-decoration: none; }
          .footer-divider { display: inline-block; width: 4px; height: 4px; background: #999; border-radius: 50%; margin: 0 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔗 Sign In to ${siteName}</h1>
            <p>Click the link below to access your account</p>
          </div>
          <div class="body">
            <p>Hi ${payload.email},</p>
            <p>You requested a magic sign-in link for your ${siteName} account. Click the button below to sign in:</p>
            
            <div class="cta-button-container">
              <a href="${payload.magicUrl}" class="cta-button">Sign In Now →</a>
            </div>

            <p style="text-align: center; color: #999; font-size: 13px; margin: 24px 0;">Or copy and paste this link in your browser:</p>
            <div class="code-block">${payload.magicUrl}</div>

            <div class="security-note">
              <strong>🔒 Security tip:</strong> If you didn't request this link, you can safely ignore this email. Never share this link with anyone.
            </div>

            <div class="expiry-warning">
              <strong>⏱️ Link expires in 30 minutes</strong> - After that, you'll need to request a new sign-in link.
            </div>

            <p>If you're having trouble signing in, contact our support team for assistance.</p>
          </div>
          <div class="footer">
            <p>
              <a href="${siteUrl}">Visit ${siteName}</a>
              <span class="footer-divider"></span>
              <a href="${siteUrl}/contact">Contact Support</a>
              <span class="footer-divider"></span>
              © ${new Date().getFullYear()} ${siteName}. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: payload.email,
    subject: `Sign in to ${siteName}`,
    html,
  })
}

/**
 * Send email verification/confirmation email
 */
export async function sendVerificationEmail(payload: VerificationEmailPayload): Promise<{ success: boolean; error?: string }> {
  const siteName = await getConfig("site_name") || "NodeByte"
  const siteUrl = await getConfig("site_url") || "https://nodebyte.host"

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            padding: 20px;
            min-height: 100vh;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
            padding: 32px 24px;
            text-align: center;
            color: white;
          }
          .header h1 { font-size: 24px; font-weight: 600; margin-bottom: 8px; }
          .header p { opacity: 0.9; font-size: 14px; }
          .body {
            padding: 32px 24px;
            color: #333;
          }
          .body p { margin-bottom: 16px; line-height: 1.6; color: #555; }
          .verify-button-container {
            text-align: center;
            margin: 32px 0;
          }
          .verify-button {
            display: inline-block;
            padding: 12px 32px;
            background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            transition: opacity 0.3s ease;
          }
          .verify-button:hover { opacity: 0.9; }
          .code-block {
            background: #f8fafc;
            border-left: 4px solid #06b6d4;
            padding: 16px;
            margin: 24px 0;
            border-radius: 4px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 13px;
            color: #333;
            word-break: break-all;
          }
          .security-note {
            background: #dbeafe;
            border-left: 4px solid #06b6d4;
            padding: 16px;
            margin: 24px 0;
            border-radius: 4px;
            font-size: 14px;
            color: #075985;
          }
          .footer {
            background: #f8fafc;
            padding: 24px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #e2e8f0;
          }
          .footer a { color: #06b6d4; text-decoration: none; }
          .footer-divider { display: inline-block; width: 4px; height: 4px; background: #999; border-radius: 50%; margin: 0 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✉️ Verify Your Email</h1>
            <p>${siteName}</p>
          </div>
          <div class="body">
            <p>Hi ${payload.email},</p>
            <p>Thank you for creating an account on ${siteName}! Please verify your email address to get started:</p>
            <div class="verify-button-container">
              <a href="${payload.verificationUrl}" class="verify-button">Verify Email</a>
            </div>
            <p>Or copy and paste this link in your browser:</p>
            <div class="code-block">${payload.verificationUrl}</div>
            <div class="security-note">
              <strong>🔒 Your account is secure.</strong> This verification link expires in 24 hours. Only use verification links sent from official ${siteName} emails.
            </div>
            <p>If you didn't create this account, you can safely ignore this email.</p>
            <p>Best regards,<br><strong>${siteName} Team</strong></p>
          </div>
          <div class="footer">
            <p>
              <a href="${siteUrl}">Visit ${siteName}</a>
              <span class="footer-divider"></span>
              <a href="${siteUrl}/contact">Contact Support</a>
              <span class="footer-divider"></span>
              © ${new Date().getFullYear()} ${siteName}. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: payload.email,
    subject: `Verify Your Email - ${siteName}`,
    html,
  })
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(email: string): Promise<{ success: boolean; error?: string }> {
  const siteName = await getConfig("site_name") || "NodeByte"
  const siteUrl = await getConfig("site_url") || "https://nodebyte.host"

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ${siteName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            padding: 20px;
            min-height: 100vh;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            padding: 32px 24px;
            text-align: center;
            color: white;
          }
          .header h1 { font-size: 28px; font-weight: 600; margin-bottom: 8px; }
          .header p { opacity: 0.9; font-size: 14px; }
          .body {
            padding: 32px 24px;
            color: #333;
          }
          .body p { margin-bottom: 16px; line-height: 1.6; color: #555; }
          .feature-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin: 24px 0;
          }
          .feature {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 16px;
            text-align: center;
          }
          .feature-icon { font-size: 24px; margin-bottom: 8px; }
          .feature-title { font-weight: 600; color: #333; margin-bottom: 4px; font-size: 14px; }
          .feature-description { font-size: 12px; color: #666; }
          .cta-button-container {
            text-align: center;
            margin: 32px 0;
          }
          .cta-button {
            display: inline-block;
            padding: 14px 36px;
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            transition: opacity 0.3s ease;
            font-size: 16px;
          }
          .cta-button:hover { opacity: 0.9; }
          .next-steps {
            background: #faf5ff;
            border-left: 4px solid #8b5cf6;
            padding: 16px;
            margin: 24px 0;
            border-radius: 4px;
          }
          .next-steps h3 { color: #6b21a8; margin-bottom: 12px; }
          .next-steps ol { margin-left: 20px; color: #666; }
          .next-steps li { margin-bottom: 8px; }
          .footer {
            background: #f8fafc;
            padding: 24px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #e2e8f0;
          }
          .footer a { color: #8b5cf6; text-decoration: none; }
          .footer-divider { display: inline-block; width: 4px; height: 4px; background: #999; border-radius: 50%; margin: 0 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to ${siteName}!</h1>
            <p>Your account has been created</p>
          </div>
          <div class="body">
            <p>Hi ${email},</p>
            <p>Welcome to the ${siteName} community! We're excited to have you on board. Your account is now fully set up and ready to use.</p>
            
            <div class="feature-grid">
              <div class="feature">
                <div class="feature-icon">🖥️</div>
                <div class="feature-title">Game Servers</div>
                <div class="feature-description">Deploy & manage game servers</div>
              </div>
              <div class="feature">
                <div class="feature-icon">⚙️</div>
                <div class="feature-title">Full Control</div>
                <div class="feature-description">Advanced configuration options</div>
              </div>
              <div class="feature">
                <div class="feature-icon">📊</div>
                <div class="feature-title">Analytics</div>
                <div class="feature-description">Performance monitoring</div>
              </div>
              <div class="feature">
                <div class="feature-icon">🛡️</div>
                <div class="feature-title">Secure</div>
                <div class="feature-description">Enterprise-grade security</div>
              </div>
            </div>

            <div class="cta-button-container">
              <a href="${siteUrl}" class="cta-button">Get Started →</a>
            </div>

            <div class="next-steps">
              <h3>What's next?</h3>
              <ol>
                <li><strong>Complete your profile</strong> - Add a profile picture and personal information</li>
                <li><strong>Configure your first server</strong> - Follow our guided setup wizard</li>
                <li><strong>Join our community</strong> - Connect with other users on Discord</li>
                <li><strong>Explore documentation</strong> - Learn all about our features</li>
              </ol>
            </div>

            <p>If you have any questions or need assistance, our support team is here to help. Don't hesitate to reach out!</p>
            <p>Best regards,<br><strong>${siteName} Team</strong></p>
          </div>
          <div class="footer">
            <p>
              <a href="${siteUrl}">Visit ${siteName}</a>
              <span class="footer-divider"></span>
              <a href="${siteUrl}/contact">Contact Support</a>
              <span class="footer-divider"></span>
              © ${new Date().getFullYear()} ${siteName}. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `Welcome to ${siteName}!`,
    html,
  })
}
