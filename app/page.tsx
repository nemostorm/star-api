import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-bold">StarAPI</h1>
        <p className="text-xl text-muted-foreground max-w-md">
          Test your API endpoints with ease. A powerful and intuitive API testing tool.
        </p>
        <Link href="/home">
          <Button size="lg" className="cursor-pointer">
            Start Testing APIs
          </Button>
        </Link>
      </div>
    </div>
  );
}
