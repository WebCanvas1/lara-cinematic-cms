type ServiceAccountCredentials = {
  clientEmail: string;
  privateKey: string;
};

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const ANALYTICS_SCOPE =
  "https://www.googleapis.com/auth/analytics.readonly";

function base64UrlEncode(input: string | ArrayBuffer): string {
  let bytes: Uint8Array;

  if (typeof input === "string") {
    bytes = new TextEncoder().encode(input);
  } else {
    bytes = new Uint8Array(input);
  }

  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const normalized = pem.replace(/\\n/g, "\n");

  const base64 = normalized
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes.buffer;
}

export async function getGoogleAccessToken(
  credentials: ServiceAccountCredentials,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const payload = {
    iss: credentials.clientEmail,
    scope: ANALYTICS_SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };

  const unsignedToken = `${base64UrlEncode(
    JSON.stringify(header),
  )}.${base64UrlEncode(JSON.stringify(payload))}`;

  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(credentials.privateKey),
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    new TextEncoder().encode(unsignedToken),
  );

  const assertion = `${unsignedToken}.${base64UrlEncode(signature)}`;

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to authenticate with Google Analytics");
  }

  const result = (await response.json()) as {
    access_token?: string;
  };

  if (!result.access_token) {
    throw new Error("Google did not return an access token");
  }

  return result.access_token;
}
