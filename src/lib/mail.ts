import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendOtpEmail(email: string, otp: string) {
    const mailOptions = {
        from: process.env.SMTP_FROM || '"Property Booking App" <noreply@example.com>',
        to: email,
        subject: 'Your Verification Code',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h1 style="color: #0f172a;">Verify Your Account</h1>
                <p>Thank you for signing up. Please use the following code to verify your email address:</p>
                <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #334155;">${otp}</span>
                </div>
                <p>This code will expire in 10 minutes.</p>
                <p style="color: #64748b; font-size: 14px; margin-top: 30px;">If you didn't request this, please ignore this email.</p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        return { success: true };
    } catch (error) {
        // Throw error so the caller (auth.ts) can catch it and show the fallback OTP
        throw error;
    }
}

export async function sendBookingNotificationEmail(
    bookingDetails: {
        id: string;
        startDate: Date;
        endDate: Date;
        totalPrice: number;
        guests: number;
    },
    guest: {
        name: string;
        email: string;
        phone: string;
    },
    property: {
        title: string;
        location: string;
    }
) {
    const adminEmail = process.env.ADMIN_EMAIL || "govindprashar9@gmail.com";

    // Format currency
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(bookingDetails.totalPrice);

    const adminMailOptions = {
        from: process.env.SMTP_FROM || '"Canderra" <noreply@canderra.us>',
        to: adminEmail,
        subject: `New Booking Request Alert: ${property.title}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #0f172a; border-bottom: 2px solid #F59E0B; padding-bottom: 10px;">New Booking Request Received!</h2>
                
                <div style="margin-top: 20px;">
                    <h3 style="color: #475569;">Property Details</h3>
                    <p style="margin: 5px 0;"><strong>Title:</strong> ${property.title}</p>
                    <p style="margin: 5px 0;"><strong>Location:</strong> ${property.location}</p>
                </div>

                <div style="margin-top: 20px; background-color: #f8fafc; padding: 15px; border-radius: 6px;">
                    <h3 style="color: #475569; margin-top: 0;">Reservation Info</h3>
                    <p style="margin: 5px 0;"><strong>Dates:</strong> ${bookingDetails.startDate.toLocaleDateString()} - ${bookingDetails.endDate.toLocaleDateString()}</p>
                    <p style="margin: 5px 0;"><strong>Guests:</strong> ${bookingDetails.guests}</p>
                    <p style="margin: 5px 0;"><strong>Total Price:</strong> <span style="color: #059669; font-weight: bold;">${formattedPrice}</span></p>
                </div>

                <div style="margin-top: 20px;">
                    <h3 style="color: #475569;">Guest Details</h3>
                    <p style="margin: 5px 0;"><strong>Name:</strong> ${guest.name}</p>
                    <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${guest.email}">${guest.email}</a></p>
                    <p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:${guest.phone}">${guest.phone}</a></p>
                </div>

                <div style="margin-top: 30px; font-size: 12px; color: #94a3b8; text-align: center;">
                    <p>This is an automated notification from Canderra.</p>
                </div>
            </div>
        `,
    };

    const guestMailOptions = {
        from: process.env.SMTP_FROM || '"Canderra" <noreply@canderra.us>',
        to: guest.email,
        subject: `Booking Request Received: ${property.title}`,
        html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #4a4a4a; max-width: 600px; margin: 0 auto; background-color: #faf9f6; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="font-family: 'Times New Roman', Times, serif; color: #1a1a1a; margin: 0; font-size: 32px; letter-spacing: 2px;">CANDERRA</h1>
                    <p style="color: #C99A4A; font-size: 14px; text-transform: uppercase; letter-spacing: 3px; margin-top: 5px;">Luxury Stays</p>
                </div>
                
                <h2 style="font-family: 'Times New Roman', Times, serif; color: #2c2c2c; font-size: 24px; margin-bottom: 20px; font-weight: normal; text-align: center;">Your Booking Request is Received</h2>
                
                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px; text-align: center;">
                    Dear ${guest.name},<br><br>
                    Thank you for choosing Canderra. We have received your booking request for an upcoming stay at <strong>${property.title}</strong>. Our support team is currently reviewing it and will get back to you as soon as possible.
                </p>

                <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; border: 1px solid #f0eee9; margin-bottom: 30px;">
                    <h3 style="font-family: 'Times New Roman', Times, serif; color: #2c2c2c; margin-top: 0; margin-bottom: 15px; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #f0eee9; padding-bottom: 10px;">Reservation Details</h3>
                    
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #7a7a7a; font-size: 14px; width: 40%;">Check-in</td>
                            <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: bold; text-align: right;">${bookingDetails.startDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #7a7a7a; font-size: 14px;">Check-out</td>
                            <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: bold; text-align: right;">${bookingDetails.endDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #7a7a7a; font-size: 14px;">Guests</td>
                            <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; font-weight: bold; text-align: right;">${bookingDetails.guests}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #7a7a7a; font-size: 14px; border-top: 1px solid #f0eee9; padding-top: 15px; margin-top: 5px;">Total Amount</td>
                            <td style="padding: 8px 0; color: #C99A4A; font-size: 16px; font-weight: bold; text-align: right; border-top: 1px solid #f0eee9; padding-top: 15px; margin-top: 5px;">${formattedPrice}</td>
                        </tr>
                    </table>
                </div>

                <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e5e5;">
                    <p style="font-size: 13px; color: #888; line-height: 1.5;">
                        Your booking information has been sent to the property owner. Our support team will contact you shortly with further instructions.
                    </p>
                    <p style="font-size: 12px; color: #aaa; margin-top: 20px;">
                        © ${new Date().getFullYear()} Canderra. All rights reserved.
                    </p>
                </div>
            </div>
        `,
    };

    try {
        await Promise.all([
            transporter.sendMail(adminMailOptions),
            transporter.sendMail(guestMailOptions)
        ]);
        console.log("Booking notifications sent successfully");
        return { success: true };
    } catch (error) {
        console.error("Failed to send booking notifications:", error);
        // We don't throw here to avoid failing the booking if email fails
        return { success: false, error };
    }
}

export async function sendContactInquiryEmail(data: {
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
}) {
    const adminEmail = process.env.ADMIN_EMAIL || "support@candera.us";

    const adminMailOptions = {
        from: process.env.SMTP_FROM || '"Canderra" <noreply@canderra.us>',
        to: adminEmail,
        subject: `New Contact Inquiry: ${data.subject}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #0f172a; border-bottom: 2px solid #C99A4A; padding-bottom: 10px;">New Inquiry Received</h2>
                
                <div style="margin-top: 20px;">
                    <p style="margin: 5px 0;"><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
                    <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
                    <p style="margin: 5px 0;"><strong>Subject:</strong> ${data.subject}</p>
                </div>

                <div style="margin-top: 20px; background-color: #f8fafc; padding: 15px; border-radius: 6px;">
                    <h3 style="color: #475569; margin-top: 0;">Message</h3>
                    <p style="margin: 5px 0; white-space: pre-wrap;">${data.message}</p>
                </div>

                <div style="margin-top: 30px; font-size: 12px; color: #94a3b8; text-align: center;">
                    <p>This is an automated notification from Canderra Contact Form.</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(adminMailOptions);
        console.log("Contact inquiry email sent successfully");
        return { success: true };
    } catch (error) {
        console.error("Failed to send contact inquiry:", error);
        return { success: false, error };
    }
}
