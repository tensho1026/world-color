import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, "名前を入力してください"),
    email: z
      .string()
      .email({ message: "正しいメールアドレスを入力してください" }),
    password: z.string().min(5, "パスワードは5文字以上必要です"),
    passwordconfirm: z.string().min(5, "確認用パスワードを入力してください"),
  })
  .refine((data) => data.password === data.passwordconfirm, {
    message: "パスワードが一致しません",
    path: ["passwordConfirm"],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "正しいメールアドレスを入力してください" }),
  password: z.string().min(5, "パスワードは5文字以上必要です"),
});

export type registerForm = z.infer<typeof registerSchema>;
export type loginForm = z.infer<typeof loginSchema>;
