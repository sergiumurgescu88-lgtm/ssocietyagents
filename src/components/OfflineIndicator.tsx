import { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function OfflineIndicator() {
  const [online, setOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => { setOnline(true); setTimeout(() => setShowBanner(false), 3000); };
    const handleOffline = () => { setOnline(false); setShowBanner(true); };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showBanner && online) return null;

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-[60] flex items-center justify-center gap-2 py-2 text-xs font-medium transition-colors",
      online ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"
    )}>
      {online ? (
        <>
          <Wifi className="h-3.5 w-3.5" />
          Conexiune restabilită
        </>
      ) : (
        <>
          <WifiOff className="h-3.5 w-3.5" />
          Ești offline — unele funcții nu sunt disponibile
        </>
      )}
    </div>
  );
}
