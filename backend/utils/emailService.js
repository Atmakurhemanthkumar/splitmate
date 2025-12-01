// This is a placeholder for email service
// In production, you can integrate with SendGrid, Mailgun, etc.

const sendEmail = async (to, subject, html) => {
  try {
    console.log('📧 Email would be sent to:', to);
    console.log('📧 Subject:', subject);
    console.log('📧 HTML:', html);
    
    // In production, implement actual email sending
    // For now, just log the email details
    
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, message: 'Failed to send email' };
  }
};

// Send welcome email
export const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to SplitMate!';
  const html = `
    <h1>Welcome to SplitMate, ${user.name}! 🎉</h1>
    <p>We're excited to have you on board for seamless expense splitting with your roommates.</p>
    <p>Get started by creating or joining a group to start tracking shared expenses.</p>
    <br>
    <p>Happy Splitting! 🏠</p>
    <p><strong>The SplitMate Team</strong></p>
  `;

  return await sendEmail(user.email, subject, html);
};

// Send payment reminder
export const sendPaymentReminder = async (user, expense) => {
  const subject = `Payment Reminder: ${expense.title}`;
  const html = `
    <h1>Payment Reminder 💰</h1>
    <p>Hi ${user.name},</p>
    <p>This is a friendly reminder about your pending payment for:</p>
    <h3>${expense.title} - ₹${expense.members.find(m => m.userId.toString() === user._id.toString()).amount}</h3>
    <p>Please mark this as paid once you've completed the payment.</p>
    <br>
    <p>Thank you! 🙏</p>
  `;

  return await sendEmail(user.email, subject, html);
};

export default sendEmail;