"use client";

import { useEffect, useState } from "react";
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
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Palette, LogIn } from "lucide-react";
import Link from "next/link";
import { LogoutButton } from "@/components/Auth/Logout";

type Emotion = {
  id: string;
  name: string;
  color_code: string;
};

type WorldColor = {
  world_color: string;
};

export default function EmotionColorApp() {
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState<null | Emotion>(null);

  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [worldColor, setWorldColor] = useState<WorldColor | null>(null);

  useEffect(() => {
    const fetchWorldColor = async () => {
      const res = await fetch("http://localhost:8000/api/get-world-color");
      if (res.ok) {
        const data = await res.json();
        console.log(data, "worldcolor情報");
        setWorldColor(data);
      }
    };
    fetchWorldColor();
  }, []);
  useEffect(() => {
    console.log(worldColor, "worldColor情報");
  }, [worldColor]);

  useEffect(() => {
    const fetchMoods = async () => {
      const res = await fetch("http://localhost:8000/api/get-moods");
      if (res.ok) {
        const data = await res.json();
        setEmotions(data);
      }
    };
    fetchMoods();
  }, []);


  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      if (token) {
        const res = await fetch("http://localhost:8000/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    console.log(user, "user情報");
  }, [user]);
  const handleEmotionSelect = (emotion: (typeof emotions)[0]) => {
    setSelectedEmotion(emotion);
    setCurrentEmotion(emotion);
    setIsDialogOpen(false);
  };

  const handleVote = async (emotion: Emotion) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await fetch("http://localhost:8000/api/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        mood_id: emotion.id,
      }),
    });
    if (res.ok) {
      console.log("投票しました");
      window.location.reload();
    }
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
          {!user ? (
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent">
                <LogIn className="h-4 w-4" />
                ログイン
              </Button>
            </Link>
          ) : (
            <LogoutButton />
          )}
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
            {worldColor?.world_color ? (
              <>
                <CardContent className="pb-8">
                  <div
                    className="w-48 h-48 mx-auto rounded-full shadow-2xl transition-all duration-1000 ease-in-out flex items-center justify-center"
                    style={{
                      backgroundColor: worldColor?.world_color ?? "#FFFFFF",
                    }}>
                    <div className="text-white text-3xl font-bold drop-shadow-lg">
                      {worldColor?.world_color}
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">12,847人が参加中</span>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                      <Heart className="h-3 w-3" />
                      {worldColor?.world_color}
                    </Badge>
                  </div>
                </CardContent>
              </>
            ) : null}
          </Card>

          {/* 気分選択ボタン */}
          <div className="text-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  今の気分は？
                </Button>
              </DialogTrigger>
              <DialogContent
                showCloseButton={false}
                className="sm:max-w-2xl max-h-[85vh] overflow-y-auto p-4">
                <DialogHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-3 relative">
                  <DialogClose
                    aria-label="閉じる"
                    className="absolute right-0 top-0 mr-1 mt-1 rounded-md w-10 h-10 flex items-center justify-center text-2xl text-muted-foreground hover:text-foreground focus:outline-none">
                    ×
                  </DialogClose>
                  <DialogTitle className="text-2xl text-center">
                    今日の気分は？
                  </DialogTitle>
                  <DialogDescription className="text-center text-lg">
                    あなたの今の気持ちを選んでください
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-6 pb-2">
                  {emotions.map((emotion) => (
                    <Card
                      key={emotion.name}
                      className="cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-lg border-2 hover:border-primary/50"
                      onClick={() => {
                        handleEmotionSelect(emotion);
                        handleVote(emotion);
                      }}>
                      <CardContent className="p-4 text-center">
                        <div
                          className="w-16 h-16 mx-auto rounded-full mb-3 shadow-md"
                          style={{ backgroundColor: emotion.color_code }}
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
                  <span
                    className={`font-bold`}
                    style={{ color: currentEmotion?.color_code }}>
                    {selectedEmotion.name}
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
