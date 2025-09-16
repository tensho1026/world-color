import { z } from "zod";

export const registerSchemaRaw = z
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
    path: ["passwordconfirm"],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "正しいメールアドレスを入力してください" }),
  password: z.string().min(5, "パスワードは5文字以上必要です"),
});

export const registerSchema = registerSchemaRaw.transform(
  ({ passwordconfirm, ...rest }) => rest
);

export type RegisterForm = z.input<typeof registerSchemaRaw>; // フォーム入力時の型（passwordconfirmあり）
export type RegisterPayload = z.output<typeof registerSchema>; // APIに送る型（passwordconfirmなし）
export type loginForm = z.infer<typeof loginSchema>;
