import { Link } from "react-router-dom";
import { usePublicEventTypes } from "@/api/event-types.queries";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function EventTypesPage() {
  const { data: eventTypes, isLoading, error } = usePublicEventTypes();

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-destructive">Failed to load event types</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Schedule a Meeting</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {eventTypes?.map((eventType) => (
          <Card key={eventType.slug} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{eventType.name}</CardTitle>
              <CardDescription>{eventType.durationMinutes} minutes</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3">
                {eventType.description}
              </p>
              <Button asChild className="w-full">
                <Link to={`/${eventType.slug}`}>Book Now</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
        {eventTypes?.length === 0 && (
          <div className="col-span-full p-8 text-center text-muted-foreground">
            No event types available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
