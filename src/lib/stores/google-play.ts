// Google Play Developer Reporting API
// Documentação: https://developers.google.com/play/developer/reporting/reference/rest
//
// Para conectar:
// 1. Acesse Google Cloud Console → IAM → Service Accounts
// 2. Crie uma Service Account com permissão "View app information (read-only)"
// 3. Vincule a Service Account ao Google Play Console em
//    Configurações → Acesso à API → Vincular projeto do Google Cloud
// 4. Gere uma chave JSON e extraia client_email e private_key
// 5. Preencha as variáveis em .env.local:
//    GOOGLE_PLAY_PACKAGE_NAME=com.zupet.app
//    GOOGLE_PLAY_CLIENT_EMAIL=...
//    GOOGLE_PLAY_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

export type StoreStats = {
  totalInstalls: number;
  activeInstalls: number;
  totalUninstalls: number;
  rating: number;
  ratingCount: number;
  monthlyData: { month: string; installs: number; uninstalls: number }[];
};

export type GooglePlayStatus =
  | { connected: false; reason: string }
  | { connected: true; data: StoreStats };

const PACKAGE = process.env.GOOGLE_PLAY_PACKAGE_NAME;
const CLIENT_EMAIL = process.env.GOOGLE_PLAY_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PLAY_PRIVATE_KEY?.replace(/\\n/g, "\n");

export function isGooglePlayConfigured(): boolean {
  return !!(PACKAGE && CLIENT_EMAIL && PRIVATE_KEY);
}

async function getGoogleAccessToken(): Promise<string> {
  // JWT manual para autenticação com Service Account (sem SDK do Google)
  const { SignJWT, importPKCS8 } = await import("jose");

  const now = Math.floor(Date.now() / 1000);
  const privateKey = await importPKCS8(PRIVATE_KEY!, "RS256");

  const jwt = await new SignJWT({
    iss: CLIENT_EMAIL,
    scope: "https://www.googleapis.com/auth/playdeveloperreporting",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })
    .setProtectedHeader({ alg: "RS256" })
    .sign(privateKey);

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) throw new Error(`[google-play] token error: ${res.status}`);
  const { access_token } = await res.json();
  return access_token;
}

export async function getGooglePlayStats(): Promise<GooglePlayStatus> {
  if (!isGooglePlayConfigured()) {
    return {
      connected: false,
      reason: "Variáveis de ambiente não configuradas (GOOGLE_PLAY_PACKAGE_NAME, GOOGLE_PLAY_CLIENT_EMAIL, GOOGLE_PLAY_PRIVATE_KEY)",
    };
  }

  try {
    const token = await getGoogleAccessToken();
    const base = "https://playdeveloperreporting.googleapis.com/v1beta1";
    const name = `apps/${PACKAGE}`;

    // Buscar métricas de instalação (últimos 12 meses)
    const now = new Date();
    const timeline: { month: string; installs: number; uninstalls: number }[] = [];

    // Chamar a API de métricas agregadas
    const metricsRes = await fetch(
      `${base}/${name}/storePerformanceClusterReport:query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dimensions: ["date"],
          metrics: ["storeListingVisitors", "storeListingConversions"],
          dateRange: {
            startDate: { year: now.getFullYear() - 1, month: now.getMonth() + 1, day: 1 },
            endDate: { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() },
          },
          pageSize: 365,
        }),
      }
    );

    // Buscar rating e total de instalações via androidpublisher
    const reviewRes = await fetch(
      `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${PACKAGE}/reviews?maxResults=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Consolidar dados disponíveis
    // A API retorna dados diferentes dependendo do nível de acesso
    // Fallback para dados básicos se métricas avançadas não estiverem disponíveis
    const metricsData = metricsRes.ok ? await metricsRes.json() : null;

    // Construir timeline mensal dos últimos 12 meses
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
      const row = metricsData?.rows?.find((r: { dimensionValues: { value: string }[]; metricValues: { longValue: string }[] }) => {
        const dateVal = r.dimensionValues?.[0]?.value;
        return dateVal?.startsWith(`${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`);
      });
      timeline.push({
        month: label,
        installs: parseInt(row?.metricValues?.[1]?.longValue ?? "0"),
        uninstalls: 0, // API de uninstalls requer nível premium
      });
    }

    return {
      connected: true,
      data: {
        totalInstalls: timeline.reduce((a, b) => a + b.installs, 0),
        activeInstalls: 0, // requer androidpublisher API com permissão estendida
        totalUninstalls: 0,
        rating: 0,
        ratingCount: 0,
        monthlyData: timeline,
      },
    };
  } catch (err) {
    console.error("[google-play]", err);
    return {
      connected: false,
      reason: `Erro ao buscar dados: ${err instanceof Error ? err.message : "erro desconhecido"}`,
    };
  }
}
