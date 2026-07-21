"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth/client";
import { useState } from "react";
import { toast } from "sonner";

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/auth");
            router.refresh();
          },
        },
      });
    } catch (error) {
      toast.error("Failed to sign out.");
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="danger" 
      onClick={handleSignOut}
      disabled={isLoading}
      className="gap-2 font-semibold shadow-sm"
    >
      <LogOut className="w-4 h-4" />
      {isLoading ? "Signing out..." : "Sign Out"}
    </Button>
  );
}
