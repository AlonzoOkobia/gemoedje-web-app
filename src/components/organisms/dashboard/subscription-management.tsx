"use client";
import { ManageSubscriptionDialog } from "@/components/dialogs/manage-subscription-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  CreditCard,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

interface Subscription {
  id: string;
  providerId: string;
  providerName: string;
  email: string;
  plan: "basic" | "premium";
  status: "active" | "cancelled" | "past_due";
  startDate: string;
  endDate?: string;
  amount: number;
  billingCycle: "monthly" | "annual";
  lastPayment: string;
  nextPayment: string;
}

const mockSubscriptions: Subscription[] = [
  {
    id: "1",
    providerId: "1",
    providerName: "Dr. Sarah Johnson",
    email: "sarah@example.com",
    plan: "premium",
    status: "active",
    startDate: "2024-01-01",
    amount: 49.99,
    billingCycle: "monthly",
    lastPayment: "2024-03-01",
    nextPayment: "2024-04-01",
  },
  {
    id: "2",
    providerId: "2",
    providerName: "Mark Wilson",
    email: "mark@example.com",
    plan: "basic",
    status: "past_due",
    startDate: "2024-02-01",
    amount: 29.99,
    billingCycle: "monthly",
    lastPayment: "2024-02-01",
    nextPayment: "2024-03-01",
  },
];

export function SubscriptionManagement() {
  const [subscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);

  const stats = {
    activeSubscriptions: 1847,
    monthlyRevenue: 125430,
    conversionRate: 12.4,
    pastDueAccounts: 23,
    totalContent: 156,
    draftContent: 12,
  };

  const filteredSubscriptions = subscriptions.filter(
    (sub) =>
      sub.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusBadge = (status: Subscription["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "cancelled":
        return <Badge variant="secondary">Cancelled</Badge>;
      case "past_due":
        return <Badge variant="destructive">Past Due</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscriptions
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.activeSubscriptions.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              +5.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Recurring Revenue
            </CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{stats.monthlyRevenue.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Premium Conversion Rate
            </CardTitle>
            <CreditCard className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-muted-foreground text-xs">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Past Due Accounts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pastDueAccounts}</div>
            <p className="text-muted-foreground text-xs">-3 from last week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
              <Input
                placeholder="Search by provider name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Billing Cycle</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Next Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {subscription.providerName}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {subscription.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          subscription.plan === "premium"
                            ? "default"
                            : "outline"
                        }
                      >
                        {subscription.plan === "premium" ? "Premium" : "Basic"}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                    <TableCell className="capitalize">
                      {subscription.billingCycle}
                    </TableCell>
                    <TableCell>€{subscription.amount}</TableCell>
                    <TableCell>
                      {new Date(subscription.nextPayment).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSubscription(subscription)}
                      >
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedSubscription && (
        <ManageSubscriptionDialog
          subscription={selectedSubscription}
          onClose={() => setSelectedSubscription(null)}
        />
      )}
    </div>
  );
}
