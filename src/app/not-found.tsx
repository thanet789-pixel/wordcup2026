import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="font-heading text-6xl text-gold">404</h1>
      <p className="text-white/50">Page not found</p>
      <Button asChild>
        <Link href="/home">Back to Home</Link>
      </Button>
    </div>
  );
}
