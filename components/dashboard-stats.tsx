"use client"
import { useOverallStats } from "@/hooks/useOverallStats";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardStats() {
  const { data, loading, error } = useOverallStats();

  if (loading) return <Skeleton className="h-24 w-full" />;
  if (error) return (
    <Alert variant="destructive">
      <AlertTitle>Error loading stats</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );

  // Adapt to real API structure
  const stats = data?.statsData?.[0] || {};
  // Total donors: sum of all todayStatsDonorData.hbnumDonorRegistered
  const totalDonors = Array.isArray(data?.todayStatsData?.todayStatsDonorData)
    ? data.todayStatsData.todayStatsDonorData.reduce((sum: number, d: any) => sum + (d.hbnumDonorRegistered || 0), 0)
    : '-';

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Blood Centres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-800">{stats.hbnumTotalBloodCentres ?? '-'}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Active Centres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-800">{stats.hbnumTotalActive ?? '-'}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Licensed Centres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-800">{stats.hbnumTotalLicensed ?? '-'}</div>
        </CardContent>
      </Card>
    </div>
  );
}
