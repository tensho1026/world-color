import { LogIn, Palette } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { LogoutButton } from "../Auth/Logout";

function Header({ user }: { user: any }) {
  return (
    <div>
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
    </div>
  );
}

export default Header;
