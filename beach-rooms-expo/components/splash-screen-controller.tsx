import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useAuth } from "@/providers/auth-provider";

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  return null;
}
