"use server";

import { CATEGORIES, type Category } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ExpenseFormState = {
  errors?: {
    title?: string[];
    amount?: string[];
    category?: string[];
    description?: string[];
  };
  message?: string;
};

const isCategory = (value: string): value is Category => CATEGORIES.includes(value as Category);

export async function createExpense(userId: string, prevState: ExpenseFormState, formData: FormData): Promise<ExpenseFormState> {
  const title = formData.get("title") as string;
  const amount = formData.get("amount") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;

  const errors: ExpenseFormState["errors"] = {};

  if (!title || title.trim().length === 0) {
    errors.title = ["Title is required"];
  }

  if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
    errors.amount = ["Amount must be a positive number"];
  }

  if (!category || !isCategory(category)) {
    errors.category = ["Please select a valid category"];
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    await prisma.expense.create({
      data: {
        title: title.trim(),
        amount: parseFloat(amount),
        category,
        description: description?.trim() || null,
        userId,
      },
    });
  } catch {
    return {
      message: "Database Error: Failed to create expense.",
    };
  }

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  redirect("/expenses");
}

export async function updateExpense(id: string, userId: string, prevState: ExpenseFormState, formData: FormData): Promise<ExpenseFormState> {
  const title = formData.get("title") as string;
  const amount = formData.get("amount") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;

  const errors: ExpenseFormState["errors"] = {};

  if (!title || title.trim().length === 0) {
    errors.title = ["Title is required"];
  }

  if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
    errors.amount = ["Amount must be a positive number"];
  }

  if (!category || !isCategory(category)) {
    errors.category = ["Please select a valid category"];
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    await prisma.expense.update({
      where: { id, userId },
      data: {
        title: title.trim(),
        amount: parseFloat(amount),
        category,
        description: description?.trim() || null,
      },
    });
  } catch {
    return {
      message: "Database Error: Failed to update expense.",
    };
  }

  revalidatePath("/expenses");
  revalidatePath(`/expenses/${id}`);
  revalidatePath("/dashboard");
  redirect(`/expenses/${id}`);
}

export async function deleteExpense(id: string, userId: string) {
  try {
    await prisma.expense.delete({
      where: { id, userId },
    });
  } catch {
    return {
      message: "Database Error: Failed to delete expense.",
    };
  }

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  redirect("/expenses");
}

export async function getExpenses(userId: string) {
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return expenses;
  } catch {
    throw new Error("Failed to fetch expenses");
  }
}

export async function getExpenseById(id: string, userId: string) {
  try {
    const expense = await prisma.expense.findUnique({
      where: { id, userId },
    });
    return expense;
  } catch {
    throw new Error("Failed to fetch expense");
  }
}
