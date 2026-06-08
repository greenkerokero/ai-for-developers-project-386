import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateEventType } from "@/api/event-types.mutations";
import { eventTypeSchema } from "@/lib/validators";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

type FormData = z.infer<typeof eventTypeSchema>;

export function EventTypeFormPage() {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateEventType();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(eventTypeSchema),
    defaultValues: {
      slug: "",
      name: "",
      description: "",
      durationMinutes: 30,
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Event type created");
        navigate("/owner/event-types");
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">New Event Type</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Event Name</Label>
              <Input id="name" {...register("name")} placeholder="e.g. 15 Min Chat" />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">/</span>
                <Input id="slug" {...register("slug")} placeholder="15-min-chat" />
              </div>
              {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="durationMinutes">Duration (minutes)</Label>
              <Input id="durationMinutes" type="number" {...register("durationMinutes", { valueAsNumber: true })} />
              {errors.durationMinutes && <p className="text-sm text-destructive">{errors.durationMinutes.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea 
                id="description" 
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register("description")} 
                placeholder="What is this meeting about?"
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate("/owner/event-types")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Event Type"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
