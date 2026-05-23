'use server'

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendOtpEmail } from "@/lib/mail";

export async function registerUser(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password || !name) {
        return { error: "Missing fields" };
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser && existingUser.emailVerified) {
            return { error: "User already exists" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Send OTP via email
        try {
            await sendOtpEmail(email, otp);
        } catch (emailError) {
            // Log a simple warning instead of full error trace to avoid confusing the user
            console.log("⚠️  Email sending failed (likely missing SMTP config). Using fallback.");
            console.log(`=============================================`);
            console.log(`[FALLBACK] OTP for ${email}: ${otp}`);
            console.log(`=============================================`);
        }

        if (existingUser) {
            // Update existing unverified user
            await prisma.user.update({
                where: { email },
                data: {
                    name,
                    password: hashedPassword,
                    otp,
                    otpExpires,
                },
            });
        } else {
            await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    image: `https://i.pravatar.cc/150?u=${email}`, // Default avatar
                    otp,
                    otpExpires,
                    role: "USER", // Explicitly set role to USER
                },
            });
        }

        return { success: true };
    } catch (error: any) {
        console.error("Registration Error:", error);
        return { error: error.message || "Something went wrong" };
    }
}

export async function verifyOtp(email: string, otp: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return { error: "User not found" };
        }

        if (!user.otp || !user.otpExpires) {
            return { error: "Invalid request" };
        }

        if (user.otp !== otp) {
            return { error: "Invalid OTP" };
        }

        if (new Date() > user.otpExpires) {
            return { error: "OTP expired" };
        }

        // OTP valid
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date(),
                otp: null,
                otpExpires: null,
            },
        });

        return { success: true };
    } catch (error) {
        console.error("OTP Verification Error:", error);
        return { error: "Verification failed" };
    }
}
