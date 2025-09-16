"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Palette, LogIn } from "lucide-react";
import Link from "next/link";

// 感情の選択肢とそれに対応する色
const emotions = [
  { name: "楽しい", color: "#fbbf24", bgColor: "bg-yellow-400" },
  { name: "幸せ", color: "#f472b6", bgColor: "bg-pink-400" },
  { name: "穏やか", color: "#4ade80", bgColor: "bg-green-400" },
  { name: "興奮", color: "#f97316", bgColor: "bg-orange-500" },
  { name: "悲しい", color: "#3b82f6", bgColor: "bg-blue-500" },
  { name: "不安", color: "#8b5cf6", bgColor: "bg-purple-500" },
  { name: "怒り", color: "#ef4444", bgColor: "bg-red-500" },
  { name: "退屈", color: "#6b7280", bgColor: "bg-gray-500" },
  { name: "希望", color: "#06b6d4", bgColor: "bg-cyan-500" },
  { name: "愛", color: "#ec4899", bgColor: "bg-pink-500" },
];

export default function EmotionColorApp() {
  const [currentEmotion, setCurrentEmotion] = useState(emotions[1]); // デフォルトは「幸せ」
  const [selectedEmotion, setSelectedEmotion] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleEmotionSelect = (emotion: (typeof emotions)[0]) => {
    setSelectedEmotion(emotion.name);
    setCurrentEmotion(emotion);
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Palette className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">世界の感情色</h1>
          </div>
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <LogIn className="h-4 w-4" />
              ログイン
            </Button>
          </Link>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* 現在の世界の感情色表示 */}
          <Card className="text-center overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-balance">
                今、世界はこんな気持ち
              </CardTitle>
              <CardDescription className="text-lg">
                世界中の人々が感じている感情の色
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              <div
                className="w-48 h-48 mx-auto rounded-full shadow-2xl transition-all duration-1000 ease-in-out flex items-center justify-center"
                style={{ backgroundColor: currentEmotion.color }}
              >
                <div className="text-white text-3xl font-bold drop-shadow-lg">
                  {currentEmotion.name}
                </div>
              </div>
              <div className="mt-6 flex items-center justify-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">12,847人が参加中</span>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <Heart className="h-3 w-3" />
                  リアルタイム更新
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* 気分選択ボタン */}
          <div className="text-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  今の気分は？
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-center">
                    今日の気分は？
                  </DialogTitle>
                  <DialogDescription className="text-center text-lg">
                    あなたの今の気持ちを選んでください
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-6">
                  {emotions.map((emotion) => (
                    <Card
                      key={emotion.name}
                      className="cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-lg border-2 hover:border-primary/50"
                      onClick={() => handleEmotionSelect(emotion)}
                    >
                      <CardContent className="p-4 text-center">
                        <div
                          className="w-16 h-16 mx-auto rounded-full mb-3 shadow-md"
                          style={{ backgroundColor: emotion.color }}
                        />
                        <p className="font-medium text-sm">{emotion.name}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* 選択した感情の表示 */}
          {selectedEmotion && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <p className="text-lg">
                  あなたの気持ち「
                  <span className="font-bold text-primary">
                    {selectedEmotion}
                  </span>
                  」を世界の感情色に反映しました！
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  ありがとうございます。あなたの感情が世界の色を作っています。
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
