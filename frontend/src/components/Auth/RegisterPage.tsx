"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Palette, ArrowLeft, Mail, Lock, User } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { RegisterPayload, registerSchemaRaw } from "@/schema/auth/auth-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(registerSchemaRaw),
  });

  const onSubmit = async (data: RegisterPayload) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
      }),
    });
    if (res) {
      const data = await res.json();
      console.log(data);
      localStorage.setItem("token", data.access_token);
      router.push("/");
    }
    console.log(data);
  };
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* ヘッダー */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <Palette className="h-5 w-5" />
            <span className="text-sm">世界の感情色に戻る</span>
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold">
              {isSignUp ? "新規登録" : "ログイン"}
            </CardTitle>
            <CardDescription>
              {isSignUp
                ? "アカウントを作成して、あなたの感情を世界と共有しましょう"
                : "アカウントにログインして、あなたの感情を世界と共有しましょう"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Googleログインボタン */}
            <Button
              variant="outline"
              className="w-full bg-transparent hover:bg-muted/50"
              size="lg">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Googleで{isSignUp ? "登録" : "ログイン"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  または
                </span>
              </div>
            </div>

            {/* メールログインフォーム */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  名前
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...register("name")}
                    id="name"
                    type="text"
                    placeholder="山田太郎"
                    className={
                      errors.name
                        ? "border-red-500 focus-visible:ring-red-500 pl-10"
                        : "pl-10"
                    }
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  メールアドレス
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...register("email")}
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    className={
                      errors.email
                        ? "border-red-500 focus-visible:ring-red-500 pl-10"
                        : "pl-10"
                    }
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email?.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  パスワード
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...register("password")}
                    type="password"
                    placeholder="パスワード"
                    className={
                      errors.password
                        ? "border-red-500 focus-visible:ring-red-500 pl-10"
                        : "pl-10"
                    }
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    確認パスワード
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...register("passwordconfirm")}
                      type="password"
                      placeholder="確認パスワード"
                      className={
                        errors.passwordconfirm
                          ? "border-red-500 focus-visible:ring-red-500 pl-10"
                          : "pl-10"
                      }
                    />
                    {errors.passwordconfirm && (
                      <p className="text-sm text-red-500">
                        {errors.passwordconfirm?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                アカウントを作成
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                アカウントお持ちの方は
              </span>
              <Link href="/login">
                <Button
                  variant="link"
                  className="p-0 ml-1 h-auto font-medium"
                  onClick={() => setIsSignUp(!isSignUp)}>
                  ログイン
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
