"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  fallbackUrl?: string;
  className?: string;
}

export function BackButton({ fallbackUrl = "/", className = "" }: BackButtonProps) {
  const [showBackButton, setShowBackButton] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Show back button if there's history or if we're not on the main page
    const hasHistory = window.history.length > 1;
    const isNotMainPage = window.location.pathname !== "/";
    
    setShowBackButton(hasHistory || isNotMainPage);
  }, []);

  const handleBack = () => {
    // Always go to main products page instead of browser back
    router.push('/');
  };

  if (!showBackButton) return null;

  return (
    <Button
      onClick={handleBack}
      variant="outline"
      size="icon"
      className={`fixed bottom-4 left-4 z-50 bg-gradient-to-r from-gray-300 to-gray-400 backdrop-blur-sm border-gray-500 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft className="h-4 w-4 text-white" />
    </Button>
  );
}
