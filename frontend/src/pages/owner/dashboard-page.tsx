import { useOwnerBookings } from "@/api/bookings.queries";
import { useCancelBooking } from "@/api/bookings.mutations";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function DashboardPage() {
  const { data, isLoading } = useOwnerBookings();
  const { mutate: cancelBooking, isPending } = useCancelBooking();

  const handleCancel = (id: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      cancelBooking(id, {
        onSuccess: () => toast.success("Booking cancelled successfully"),
      });
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading bookings...</div>;

  const upcomingBookings = data?.items.filter(b => b.status === "confirmed") || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingBookings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No upcoming bookings.</p>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map(booking => (
                <div key={booking.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{booking.eventTypeName} with {booking.guestName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(booking.startTime), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                    </p>
                    <p className="text-sm text-muted-foreground">{booking.guestEmail}</p>
                    {booking.guestComment && (
                      <p className="text-sm mt-2 p-2 bg-muted rounded-md">"{booking.guestComment}"</p>
                    )}
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    disabled={isPending}
                    onClick={() => handleCancel(booking.id)}
                  >
                    Cancel
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
