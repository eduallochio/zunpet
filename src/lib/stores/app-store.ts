// App Store Connect API
// Documentação: https://developer.apple.com/app-store-connect/api/
//
// Para conectar:
// 1. Acesse App Store Connect → Usuários e Acesso → Chaves de API
// 2. Gere uma nova chave com função "Leitor" ou "Desenvolvedor"
// 3. Baixe o arquivo .p8 (só pode ser baixado uma vez)
// 4. Anote o Key ID e o Issuer ID
// 5. Preencha as variáveis em .env.local:
//    APP_STORE_KEY_ID=XXXXXXXXXX
//    APP_STORE_ISSUER_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
//    APP_STORE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
//    APP_STORE_APP_ID=123456789  (ID numérico do app no App Store Connect)

export type AppStoreStatus =
  | { connected: false; reason: string }
  | { connected: true; data: import("./google-play").StoreStats };

const KEY_ID = process.env.APP_STORE_KEY_ID;
const ISSUER_ID = process.env.APP_STORE_ISSUER_ID;
const PRIVATE_KEY = process.env.APP_STORE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const APP_ID = process.env.APP_STORE_APP_ID;

export function isAppStoreConfigured(): boolean {
  return !!(KEY_ID && ISSUER_ID && PRIVATE_KEY && APP_ID);
}

async function getAppStoreToken(): Promise<string> {
  const { SignJWT, importPKCS8 } = await import("jose");

  const now = Math.floor(Date.now() / 1000);
  const privateKey = await importPKCS8(PRIVATE_KEY!, "ES256");

  return new SignJWT({
    iss: ISSUER_ID,
    aud: "appstoreconnect-v1",
    iat: now,
    exp: now + 1200, // máximo 20 minutos
  })
    .setProtectedHeader({ alg: "ES256", kid: KEY_ID, typ: "JWT" })
    .sign(privateKey);
}

export async function getAppStoreStats(): Promise<AppStoreStatus> {
  if (!isAppStoreConfigured()) {
    return {
      connected: false,
      reason: "Variáveis de ambiente não configuradas (APP_STORE_KEY_ID, APP_STORE_ISSUER_ID, APP_STORE_PRIVATE_KEY, APP_STORE_APP_ID)",
    };
  }

  try {
    const token = await getAppStoreToken();
    const base = "https://api.appstoreconnect.apple.com/v1";

    const now = new Date();
    const monthlyData: { month: string; installs: number; uninstalls: number }[] = [];

    // Sales Reports API — downloads mensais
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const reportDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });

      try {
        const res = await fetch(
          `${base}/salesReports?filter[frequency]=MONTHLY&filter[reportType]=SALES&filter[reportSubType]=SUMMARY&filter[vendorNumber]=${ISSUER_ID}&filter[reportDate]=${reportDate}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.ok) {
          const text = await res.text();
          // Resposta é TSV (tab-separated)
          const lines = text.split("\n").filter(Boolean);
          let installs = 0;
          for (const line of lines.slice(1)) {
            const cols = line.split("\t");
            // Coluna 7 = Units, coluna 6 = Product Type (1 = download pago, F = free download)
            const productType = cols[6];
            const units = parseInt(cols[7] ?? "0");
            if ((productType === "1" || productType === "F") && !isNaN(units)) {
              installs += units;
            }
          }
          monthlyData.push({ month: label, installs, uninstalls: 0 });
        } else {
          monthlyData.push({ month: label, installs: 0, uninstalls: 0 });
        }
      } catch {
        monthlyData.push({ month: label, installs: 0, uninstalls: 0 });
      }
    }

    // Rating via Reviews API
    let rating = 0;
    let ratingCount = 0;
    try {
      const ratingsRes = await fetch(
        `${base}/apps/${APP_ID}/customerReviews?limit=1&sort=-createdDate`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (ratingsRes.ok) {
        const ratingsData = await ratingsRes.json();
        ratingCount = ratingsData?.meta?.paging?.total ?? 0;
        // Média não está diretamente disponível na reviews API, mas podemos calcular
        // com paginação — simplificado aqui
      }
    } catch {
      // rating permanece 0
    }

    return {
      connected: true,
      data: {
        totalInstalls: monthlyData.reduce((a, b) => a + b.installs, 0),
        activeInstalls: 0, // não disponível via App Store Connect API
        totalUninstalls: 0,
        rating,
        ratingCount,
        monthlyData,
      },
    };
  } catch (err) {
    console.error("[app-store]", err);
    return {
      connected: false,
      reason: `Erro ao buscar dados: ${err instanceof Error ? err.message : "erro desconhecido"}`,
    };
  }
}
