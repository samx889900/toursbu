"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { markWhatsAppJoinedAction } from "@/actions/student";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

interface JoinWhatsAppButtonProps {
  bookingId: string;
  inviteLink: string;
  hasJoined: boolean;
}

export function JoinWhatsAppButton({ bookingId, inviteLink, hasJoined }: JoinWhatsAppButtonProps) {
  const [joined, setJoined] = useState(hasJoined);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleJoin = async () => {
    window.open(inviteLink, "_blank");
    if (!joined) {
      setIsUpdating(true);
      try {
        await markWhatsAppJoinedAction(bookingId);
        setJoined(true);
        toast.success("Marked as joined");
      } catch (err) {
        // Silently fail if they already joined or error
      } finally {
        setIsUpdating(false);
      }
    }
  };

  if (joined) {
    return (
      <div className="flex items-center gap-2 text-green-600 font-medium">
        <CheckCircle2 className="w-5 h-5" /> You're in the group!
      </div>
    );
  }

  return (
    <Button 
      variant="outline" 
      className="border-green-500 text-green-600 hover:bg-green-50" 
      onClick={handleJoin}
      disabled={isUpdating}
    >
      Join WhatsApp Group
    </Button>
  );
}
