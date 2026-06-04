export const CATEGORIES = ["Food", "Travel", "Shopping", "Bills", "Entertainment", "Education", "Health"] as const;

export type Category = (typeof CATEGORIES)[number];
