import { getGooglePlayStats, isGooglePlayConfigured } from "@/lib/stores/google-play";
import { getAppStoreStats, isAppStoreConfigured } from "@/lib/stores/app-store";
import StoresClient from "./StoresClient";

export default async function StoresPage() {
  const [googlePlay, appStore] = await Promise.all([
    getGooglePlayStats(),
    getAppStoreStats(),
  ]);

  return (
    <StoresClient
      googlePlay={googlePlay}
      appStore={appStore}
      googlePlayConfigured={isGooglePlayConfigured()}
      appStoreConfigured={isAppStoreConfigured()}
    />
  );
}
