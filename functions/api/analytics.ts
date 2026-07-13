import {
  error,
  json,
  requireAdmin,
  type Ctx,
  type Env,
} from "../_lib/env";
import { getGoogleAccessToken } from "../_lib/google-auth";

type AnalyticsRange = "7d" | "28d" | "90d";

type RunReportResponse = {
  rows?: Array<{
    dimensionValues?: Array<{ value?: string }>;
    metricValues?: Array<{ value?: string }>;
  }>;
};

function getStartDate(range: AnalyticsRange): string {
  switch (range) {
    case "7d":
      return "7daysAgo";
    case "90d":
      return "90daysAgo";
    case "28d":
    default:
      return "28daysAgo";
  }
}

function numberValue(value?: string): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function callAnalyticsApi(
  propertyId: string,
  accessToken: string,
  method: "runReport" | "runRealtimeReport",
  body: Record<string, unknown>,
): Promise<RunReportResponse> {
  const endpoint =
    `https://analyticsdata.googleapis.com/v1beta/properties/` +
    `${encodeURIComponent(propertyId)}:${method}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("GA4 API error:", response.status, text);

    throw new Error(`Google Analytics request failed: ${response.status}`);
  }

  return (await response.json()) as RunReportResponse;
}

export const onRequestGet: PagesFunction<
  Env,
  string,
  { isAdmin?: boolean }
> = async (ctx) => {
  const guard = requireAdmin(ctx as Ctx);

  if (guard) {
    return guard;
  }

  const propertyId = ctx.env.GA4_PROPERTY_ID;
  const clientEmail = ctx.env.GA4_CLIENT_EMAIL;
  const privateKey = ctx.env.GA4_PRIVATE_KEY;

  if (!propertyId || !clientEmail || !privateKey) {
    return error(503, "Analytics integration is not configured");
  }

  const url = new URL(ctx.request.url);
  const requestedRange = url.searchParams.get("range") ?? "28d";

  if (!["7d", "28d", "90d"].includes(requestedRange)) {
    return error(400, "Invalid analytics date range");
  }

  const range = requestedRange as AnalyticsRange;
  const startDate = getStartDate(range);

  try {
    const accessToken = await getGoogleAccessToken({
      clientEmail,
      privateKey,
    });

    const [
      summaryReport,
      pagesReport,
      sourcesReport,
      devicesReport,
      countriesReport,
      realtimeReport,
    ] = await Promise.all([
      callAnalyticsApi(propertyId, accessToken, "runReport", {
        dateRanges: [{ startDate, endDate: "today" }],
        metrics: [
          { name: "totalUsers" },
          { name: "newUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
          { name: "averageSessionDuration" },
        ],
      }),

      callAnalyticsApi(propertyId, accessToken, "runReport", {
        dateRanges: [{ startDate, endDate: "today" }],
        dimensions: [
          { name: "pageTitle" },
          { name: "pagePath" },
        ],
        metrics: [
          { name: "screenPageViews" },
          { name: "totalUsers" },
        ],
        orderBys: [
          {
            metric: { metricName: "screenPageViews" },
            desc: true,
          },
        ],
        limit: "10",
      }),

      callAnalyticsApi(propertyId, accessToken, "runReport", {
        dateRanges: [{ startDate, endDate: "today" }],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [
          { name: "sessions" },
          { name: "totalUsers" },
        ],
        orderBys: [
          {
            metric: { metricName: "sessions" },
            desc: true,
          },
        ],
        limit: "10",
      }),

      callAnalyticsApi(propertyId, accessToken, "runReport", {
        dateRanges: [{ startDate, endDate: "today" }],
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "totalUsers" }],
        orderBys: [
          {
            metric: { metricName: "totalUsers" },
            desc: true,
          },
        ],
      }),

      callAnalyticsApi(propertyId, accessToken, "runReport", {
        dateRanges: [{ startDate, endDate: "today" }],
        dimensions: [{ name: "country" }],
        metrics: [{ name: "totalUsers" }],
        orderBys: [
          {
            metric: { metricName: "totalUsers" },
            desc: true,
          },
        ],
        limit: "10",
      }),

      callAnalyticsApi(propertyId, accessToken, "runRealtimeReport", {
        metrics: [{ name: "activeUsers" }],
      }),
    ]);

    const summaryValues =
      summaryReport.rows?.[0]?.metricValues ?? [];

    const realtimeValue =
      realtimeReport.rows?.[0]?.metricValues?.[0]?.value;

    return json({
      range,
      summary: {
        users: numberValue(summaryValues[0]?.value),
        newUsers: numberValue(summaryValues[1]?.value),
        sessions: numberValue(summaryValues[2]?.value),
        pageViews: numberValue(summaryValues[3]?.value),
        averageEngagementSeconds: numberValue(
          summaryValues[4]?.value,
        ),
        activeUsers: numberValue(realtimeValue),
      },

      topPages:
        pagesReport.rows?.map((row) => ({
          title: row.dimensionValues?.[0]?.value ?? "Untitled",
          path: row.dimensionValues?.[1]?.value ?? "/",
          pageViews: numberValue(row.metricValues?.[0]?.value),
          users: numberValue(row.metricValues?.[1]?.value),
        })) ?? [],

      sources:
        sourcesReport.rows?.map((row) => ({
          channel:
            row.dimensionValues?.[0]?.value ?? "Unassigned",
          sessions: numberValue(row.metricValues?.[0]?.value),
          users: numberValue(row.metricValues?.[1]?.value),
        })) ?? [],

      devices:
        devicesReport.rows?.map((row) => ({
          device: row.dimensionValues?.[0]?.value ?? "Unknown",
          users: numberValue(row.metricValues?.[0]?.value),
        })) ?? [],

      countries:
        countriesReport.rows?.map((row) => ({
          country: row.dimensionValues?.[0]?.value ?? "Unknown",
          users: numberValue(row.metricValues?.[0]?.value),
        })) ?? [],
    });
  } catch (cause) {
    console.error("Analytics dashboard error:", cause);

    return error(502, "Unable to retrieve Google Analytics data");
  }
};
