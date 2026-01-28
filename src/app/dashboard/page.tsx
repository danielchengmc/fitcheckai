'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/hooks/use-user';
import { CalorieGoals } from '@/components/calorie-goals';

export default function DashboardPage() {
  const { user } = useUser();
  const userName = user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {userName}!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Ready to crush your goals? Track a workout or log a meal to get started. Here are your AI-recommended calorie goals.
          </p>
        </CardContent>
      </Card>

      <CalorieGoals />
    </div>
  );
}
