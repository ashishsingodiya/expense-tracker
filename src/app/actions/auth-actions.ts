"use server";

import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createSession, setSessionCookie, clearSessionCookie } from "@/lib/session";
import { redirect } from "next/navigation";

export type AuthFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    general?: string[];
  };
  message?: string;
};

export async function register(prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const errors: AuthFormState["errors"] = {};

  if (!name || name.trim().length === 0) {
    errors.name = ["Name is required"];
  }

  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.email = ["Valid email is required"];
  }

  if (!password || password.length < 6) {
    errors.password = ["Password must be at least 6 characters"];
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return {
        errors: { email: ["Email already registered"] },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    const token = await createSession({
      userId: user.id,
      email: user.email,
    });

    await setSessionCookie(token);
  } catch (error) {
    console.error("Registration error:", error);
    return {
      message: "Database Error: Failed to create account.",
    };
  }

  redirect("/dashboard");
}

export async function login(prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const errors: AuthFormState["errors"] = {};

  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.email = ["Valid email is required"];
  }

  if (!password || password.length === 0) {
    errors.password = ["Password is required"];
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return {
        errors: { general: ["Invalid email or password"] },
      };
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return {
        errors: { general: ["Invalid email or password"] },
      };
    }

    const token = await createSession({
      userId: user.id,
      email: user.email,
    });

    await setSessionCookie(token);
  } catch (error) {
    console.error("Login error:", error);
    return {
      message: "Database Error: Failed to log in.",
    };
  }

  redirect("/dashboard");
}

export async function logout() {
  await clearSessionCookie();
  redirect("/");
}
