"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Check,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  User,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface WeeklySchedule {
  [key: string]: TimeSlot[];
}

interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  time: string;
  duration: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  sessionType: "initial" | "follow-up" | "urgent";
}

export function ProviderBooking() {
  const t = useTranslations();

  const [schedule, setSchedule] = useState<WeeklySchedule>({
    monday: [
      { id: "1", startTime: "09:00", endTime: "10:00", isAvailable: true },
      { id: "2", startTime: "10:00", endTime: "11:00", isAvailable: true },
      { id: "3", startTime: "14:00", endTime: "15:00", isAvailable: false },
      { id: "4", startTime: "15:00", endTime: "16:00", isAvailable: true },
    ],
    tuesday: [
      { id: "5", startTime: "09:00", endTime: "10:00", isAvailable: true },
      { id: "6", startTime: "11:00", endTime: "12:00", isAvailable: true },
      { id: "7", startTime: "14:00", endTime: "15:00", isAvailable: true },
    ],
    wednesday: [
      { id: "8", startTime: "10:00", endTime: "11:00", isAvailable: true },
      { id: "9", startTime: "13:00", endTime: "14:00", isAvailable: false },
      { id: "10", startTime: "15:00", endTime: "16:00", isAvailable: true },
    ],
    thursday: [
      { id: "11", startTime: "09:00", endTime: "10:00", isAvailable: true },
      { id: "12", startTime: "10:00", endTime: "11:00", isAvailable: true },
      { id: "13", startTime: "14:00", endTime: "15:00", isAvailable: true },
    ],
    friday: [
      { id: "14", startTime: "09:00", endTime: "10:00", isAvailable: false },
      { id: "15", startTime: "11:00", endTime: "12:00", isAvailable: true },
      { id: "16", startTime: "14:00", endTime: "15:00", isAvailable: true },
    ],
    saturday: [],
    sunday: [],
  });

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "1",
      clientName: "John Smith",
      clientEmail: "john.smith@email.com",
      clientPhone: "+1 (555) 987-6543",
      date: "2024-02-15",
      time: "10:00",
      duration: 60,
      status: "pending",
      sessionType: "initial",
      notes: "First session - anxiety and stress management",
    },
    {
      id: "2",
      clientName: "Emily Johnson",
      clientEmail: "emily.j@email.com",
      clientPhone: "+1 (555) 456-7890",
      date: "2024-02-16",
      time: "14:00",
      duration: 50,
      status: "confirmed",
      sessionType: "follow-up",
      notes: "Follow-up session - progress review",
    },
    {
      id: "3",
      clientName: "Michael Davis",
      clientEmail: "m.davis@email.com",
      clientPhone: "+1 (555) 321-0987",
      date: "2024-02-17",
      time: "09:00",
      duration: 60,
      status: "pending",
      sessionType: "urgent",
      notes: "Urgent consultation needed",
    },
  ]);

  const [selectedDay, setSelectedDay] = useState("monday");
  const [newSlot, setNewSlot] = useState({ startTime: "", endTime: "" });

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const addTimeSlot = () => {
    if (newSlot.startTime && newSlot.endTime) {
      const newId = Date.now().toString();
      setSchedule((prev) => ({
        ...prev,
        [selectedDay]: [
          ...prev[selectedDay],
          {
            id: newId,
            startTime: newSlot.startTime,
            endTime: newSlot.endTime,
            isAvailable: true,
          },
        ].sort((a, b) => a.startTime.localeCompare(b.startTime)),
      }));
      setNewSlot({ startTime: "", endTime: "" });
      toast.success(t("Common.time-slot-added-successfully"));
    }
  };

  const toggleSlotAvailability = (day: string, slotId: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day].map((slot) =>
        slot.id === slotId ? { ...slot, isAvailable: !slot.isAvailable } : slot,
      ),
    }));
  };

  const removeTimeSlot = (day: string, slotId: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day].filter((slot) => slot.id !== slotId),
    }));
    toast.success(t("Common.time-slot-removed-successfully"));
  };

  const handleBookingAction = (
    bookingId: string,
    action: "accept" | "reject",
  ) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              status: action === "accept" ? "confirmed" : "cancelled",
            }
          : booking,
      ),
    );

    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      toast.success(
        t("ProviderDashboard.booking-notification-email-sent-to", {
          action: action === "accept" ? "accepted" : "rejected",
          email: booking.clientEmail,
        }),
      );
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmed: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      completed: "bg-blue-100 text-blue-800 border-blue-200",
    };

    return (
      <Badge
        className={
          variants[status as keyof typeof variants] || variants.pending
        }
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getSessionTypeBadge = (type: string) => {
    const variants = {
      initial: "bg-purple-100 text-purple-800 border-purple-200",
      "follow-up": "bg-blue-100 text-blue-800 border-blue-200",
      urgent: "bg-red-100 text-red-800 border-red-200",
    };

    return (
      <Badge
        className={variants[type as keyof typeof variants] || variants.initial}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const upcomingBookings = bookings.filter((b) => b.status === "confirmed");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("ProviderDashboard.pending-bookings")}
            </CardTitle>
            <Clock className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBookings.length}</div>
            <p className="text-muted-foreground text-xs">
              {t("ProviderDashboard.require-your-response")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("ProviderDashboard.upcoming-sessions")}{" "}
            </CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingBookings.length}</div>
            <p className="text-muted-foreground text-xs">
              {t("ProviderDashboard.this-week")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("ProviderDashboard.available-slots")}{" "}
            </CardTitle>
            <User className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                Object.values(schedule)
                  .flat()
                  .filter((slot) => slot.isAvailable).length
              }
            </div>
            <p className="text-muted-foreground text-xs">
              {t("ProviderDashboard.this-week")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("ProviderDashboard.response-rate")}
            </CardTitle>
            <Mail className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-muted-foreground text-xs">
              {t("ProviderDashboard.within-24-hours")}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="availability" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="availability">
            {t("ProviderDashboard.manage-availability")}
          </TabsTrigger>
          <TabsTrigger value="bookings">
            {t("ProviderDashboard.booking-requests")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="availability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("ProviderDashboard.weekly-schedule")}</CardTitle>
              <p className="text-muted-foreground text-sm">
                {t("ProviderDashboard.set-your-available-time")}{" "}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {days.map((day) => (
                  <Button
                    key={day}
                    variant={selectedDay === day ? "default" : "outline"}
                    onClick={() => setSelectedDay(day)}
                    className="capitalize"
                  >
                    {day}
                  </Button>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="startTime">{t("Common.start-time")}</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) =>
                      setNewSlot((prev) => ({
                        ...prev,
                        startTime: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">{t("Common.end-time")}</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) =>
                      setNewSlot((prev) => ({
                        ...prev,
                        endTime: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addTimeSlot} className="w-full">
                    {t("Common.add-time-slot")}{" "}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium capitalize">
                  {selectedDay} {t("Common.schedule")}
                </h4>
                {schedule[selectedDay].length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    {t("Common.no-time-slots-set-for-this-day")}{" "}
                  </p>
                ) : (
                  <div className="grid gap-2">
                    {schedule[selectedDay].map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="text-muted-foreground h-4 w-4" />
                          <span className="font-medium">
                            {slot.startTime} - {slot.endTime}
                          </span>
                          <Badge
                            variant={slot.isAvailable ? "default" : "secondary"}
                          >
                            {slot.isAvailable
                              ? t("Common.available")
                              : t("Common.unavailable")}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              toggleSlotAvailability(selectedDay, slot.id)
                            }
                          >
                            {slot.isAvailable
                              ? t("Common.disable")
                              : t("Common.enable")}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeTimeSlot(selectedDay, slot.id)}
                          >
                            {t("Common.remove")}{" "}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("Common.booking-requests")}</CardTitle>
              <p className="text-muted-foreground text-sm">
                {t("Common.review-and-respond-to-client-booking-requests")}{" "}
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Common.client")}</TableHead>
                    <TableHead>{t("Common.date-and-time")}</TableHead>
                    <TableHead>{t("Common.type")}</TableHead>
                    <TableHead>{t("Common.status")}</TableHead>
                    <TableHead>{t("Common.contact")}</TableHead>
                    <TableHead>{t("Common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.clientName}</p>
                          {booking.notes && (
                            <p className="text-muted-foreground text-sm">
                              {booking.notes}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="text-muted-foreground h-4 w-4" />
                          <div>
                            <p className="font-medium">{booking.date}</p>
                            <p className="text-muted-foreground text-sm">
                              {booking.time} ({booking.duration}{" "}
                              {t("Common.min")})
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getSessionTypeBadge(booking.sessionType)}
                      </TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="text-muted-foreground h-3 w-3" />
                            <span className="text-sm">
                              {booking.clientEmail}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="text-muted-foreground h-3 w-3" />
                            <span className="text-sm">
                              {booking.clientPhone}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {booking.status === "pending" ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleBookingAction(booking.id, "accept")
                              }
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="mr-1 h-3 w-3" />
                              {t("Common.accept")}{" "}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleBookingAction(booking.id, "reject")
                              }
                            >
                              <X className="mr-1 h-3 w-3" />
                              {t("Common.reject")}{" "}
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <MessageSquare className="mr-1 h-3 w-3" />
                              {t("Common.message")}{" "}
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
