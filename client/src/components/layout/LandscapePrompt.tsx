import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * LandscapePrompt component displays a message encouraging mobile users
 * to rotate their device to landscape mode for a better experience
 */
export default function LandscapePrompt() {
  const isMobile = useIsMobile();
  const [isPortrait, setIsPortrait] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Check if the device is in portrait mode
  useEffect(() => {
    if (!isMobile) return;

    const checkOrientation = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      setIsPortrait(isPortrait);
    };

    // Check immediately and on resize
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    
    return () => {
      window.removeEventListener('resize', checkOrientation);
    };
  }, [isMobile]);

  if (!isMobile || !isPortrait || dismissed) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-slate-800 border border-slate-700 p-5 rounded-lg max-w-xs text-center shadow-lg">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-slate-700 p-3">
            <RotateCcw className="h-10 w-10 text-blue-400 animate-pulse" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">For Best Experience</h3>
        <p className="text-slate-300 mb-4">
          Please rotate your device to landscape mode to see all visualization panels simultaneously.
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setDismissed(true)}
            className="bg-slate-700 border-slate-600 hover:bg-slate-600"
          >
            Continue in Portrait
          </Button>
          <Button
            onClick={() => setDismissed(true)}
          >
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
}