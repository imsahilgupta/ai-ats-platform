"use client";

import { useRef } from "react";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUpdateProfileDetailsMutation } from "@/hooks/use-profile-details";

function initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

export function PhotoUpload({ photoDataUrl, username }: { photoDataUrl: string | null; username: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const mutation = useUpdateProfileDetailsMutation();

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      mutation.mutate({ photoDataUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative">
      <Avatar className="size-16">
        {photoDataUrl && <AvatarImage src={photoDataUrl} alt={username} />}
        <AvatarFallback className="bg-primary/10 text-lg font-medium text-primary">
          {initials(username)}
        </AvatarFallback>
      </Avatar>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground"
        aria-label="Change photo"
      >
        <Camera className="size-3.5" />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
