import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import LandscapePrompt from "@/components/layout/LandscapePrompt";
import TronLayout from "@/components/layout/TronLayout";

export default function Home() {
  // Using the TronLayout for a terminal-inspired interface
  // This matches the reference image with retro terminal styling
  return (
    <div className="h-full overflow-hidden">
      {/* Show landscape mode prompt for mobile users */}
      <LandscapePrompt />
      
      {/* Main workspace with retro terminal styling */}
      <TronLayout />
    </div>
  );
}
