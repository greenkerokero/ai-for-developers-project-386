import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { usePublicEventType, usePublicSlots } from "@/api/event-types.queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format, parseISO } from "date-fns";

export function EventTypeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  
  const { data: eventType, isLoading: typeLoading, error: typeError } = usePublicEventType(slug!);
  const { data: slots, isLoading: slotsLoading } = usePublicSlots(slug!, selectedDate);

  if (typeLoading) return <div className="p-8 text-center">Loading...</div>;
  if (typeError || !eventType) return <div className="p-8 text-center text-destructive">Event type not found</div>;

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">{eventType.name}</h1>
        <p className="text-muted-foreground flex items-center mb-6">
          <span className="mr-2">⏱</span> {eventType.durationMinutes} minutes
        </p>
        <p className="whitespace-pre-wrap">{eventType.description}</p>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Select a Date & Time</h2>
          <input 
            type="date" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mb-6"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={format(new Date(), "yyyy-MM-dd")}
          />
          
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {slotsLoading ? (
              <div className="text-center py-4">Loading slots...</div>
            ) : slots?.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No available slots on this date.</div>
            ) : (
              slots?.map((slot, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  className="w-full justify-start text-left font-normal"
                  disabled={!slot.isAvailable}
                  asChild={slot.isAvailable}
                >
                  {slot.isAvailable ? (
                    <Link to={`/${slug}/book?startTime=${slot.startTime}`}>
                      {format(parseISO(slot.startTime), "h:mm a")}
                    </Link>
                  ) : (
                    <span>{format(parseISO(slot.startTime), "h:mm a")} (Unavailable)</span>
                  )}
                </Button>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
