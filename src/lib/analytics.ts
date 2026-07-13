export type AnalyticsRange = "7d" | "28d" | "90d";

export type AnalyticsData = {
  range: AnalyticsRange;

  summary: {
    users: number;
    newUsers: number;
    sessions: number;
    pageViews: number;
    averageEngagementSeconds: number;
    activeUsers: number;
  };

  topPages: Array<{
    title: string;
    path: string;
    pageViews: number;
    users: number;
  }>;

  sources: Array<{
    channel: string;
    sessions: number;
    users: number;
  }>;

  devices: Array<{
    device: string;
    users: number;
  }>;

  countries: Array<{
    country: string;
    users: number;
  }>;
};

export async function fetchAnalytics(
  range: AnalyticsRange,
): Promise<AnalyticsData> {
  const response = await fetch(
    `/api/analytics?range=${encodeURIComponent(range)}`,
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    throw new Error(
      result?.error ?? "Unable to load analytics data",
    );
  }

  return (await response.json()) as AnalyticsData;
}
