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
import { Heart, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "@/components/home/Header";
import Graqh from "@/components/home/Graqh";

export type Emotion = {
  id: string;
  name: string;
  color_code: string;
};

type WorldColor = {
  colorsDescription: Emotion[];
  world_color: string;
};

export default function EmotionColorApp() {
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState<null | Emotion>(null);

  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [worldColor, setWorldColor] = useState<WorldColor | null>(null);
  const [showGraph, setShowGraph] = useState(false);

  const router = useRouter();
  console.log(process.env.NEXT_PUBLIC_API_URL, "API_URL");
  useEffect(() => {
    const fetchWorldColor = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/get-world-color`
      );
      if (res.ok) {
        const data = await res.json();
        setWorldColor(data);
      }
    };
    fetchWorldColor();
  }, []);
  useEffect(() => {
    console.log(user, "今現在のuser情報");
  }, [user]);
  useEffect(() => {
    console.log(worldColor?.world_color, "今現在のworldColor情報");
    console.log(worldColor?.colorsDescription, "グラフ表示用の内訳");
  }, [worldColor]);

  useEffect(() => {
    const fetchMoods = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/get-moods`
      );
      if (res.ok) {
        const data = await res.json();
        setEmotions(data);
      }
    };
    fetchMoods();
  }, []);
  useEffect(() => {
    console.log(emotions, "emotions");
  }, [emotions]);
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      if (token) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
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

  const handleEmotionSelect = (emotion: (typeof emotions)[0]) => {
    setSelectedEmotion(emotion);
    setCurrentEmotion(emotion);
    setIsDialogOpen(false);
  };

  const handleVote = async (emotion: Emotion) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vote`, {
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
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <Header user={user} />

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
              {/* 表示切り替え */}
              <div className="mt-3 flex justify-center gap-2">
                <Button
                  size="sm"
                  variant={showGraph ? "outline" : "default"}
                  onClick={() => setShowGraph(false)}>
                  色表示
                </Button>
                <Button
                  size="sm"
                  variant={showGraph ? "default" : "outline"}
                  onClick={() => setShowGraph(true)}>
                  色内訳
                </Button>
              </div>
            </CardHeader>
            {worldColor?.world_color ? (
              <>
                {showGraph ? (
                  <CardContent className="pb-8">
                    {/* グラフ未実装: プレースホルダー */}
                    <div className="h-64 rounded-md border bg-muted/30 flex items-center justify-center text-muted-foreground">
                      <Graqh datas={worldColor?.colorsDescription} />
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                      参加者: {worldColor?.colorsDescription.length ?? 0} 件
                    </div>
                  </CardContent>
                ) : (
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
                        <span className="text-sm">
                          {worldColor?.colorsDescription.length}人が参加中
                        </span>
                      </div>
                      <Badge variant="secondary" className="gap-1">
                        <Heart className="h-3 w-3" />
                        {worldColor?.world_color}
                      </Badge>
                    </div>
                  </CardContent>
                )}
              </>
            ) : null}
          </Card>

          {/* 気分選択ボタン */}
          <div className="text-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => !user && router.push("/login")}>
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
