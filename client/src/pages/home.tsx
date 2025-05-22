import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import LandscapePrompt from "@/components/layout/LandscapePrompt";
import CodeTerminal from "@/components/layout/CodeTerminal";

export default function Home() {
  // Using the CodeTerminal for a VS Code-like interface
  // This matches the reference image with VS Code styling
  return (
    <div className="h-full overflow-hidden">
      {/* Show landscape mode prompt for mobile users */}
      <LandscapePrompt />
      
      {/* Main workspace with VS Code styling */}
      <CodeTerminal />
    </div>
  );
}
