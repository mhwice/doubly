import { env } from "@/data-access/env";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${env.APP_URL}/auth/new-verification?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
  });

  if (error) {
    return { error: "Email could not send" };
  }

  return { success: "Confirmation email sent" };
}

export const sendBetterVerificationEmail = async (email: string, callbackURL: string) => {
  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${callbackURL}">here</a> to confirm email.</p>`
  });

  if (error) return { error: "Failed to send verification email" };
  return { success: "Verification email sent" };
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${env.APP_URL}/auth/new-password?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
  });

  if (error) {
    return { error: "Email could not send" };
  }

  return { success: "Password reset email sent" };
}

export const sendBetterPasswordResetEmail = async (email: string, callbackURL: string) => {
  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${callbackURL}">here</a> to reset your password.</p>`
  });

  if (error) return { error: "Failed to send password reset email" };
  return { success: "Password reset email sent" };
}

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Your 2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`
  });

  // if (error) {
  //   return { error: "Email could not send" };
  // }

  // return { success: "Password reset email sent" };
}
