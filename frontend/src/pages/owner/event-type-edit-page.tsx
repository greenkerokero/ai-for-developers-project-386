import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOwnerEventType } from "@/api/event-types.queries";
import { useUpdateEventType } from "@/api/event-types.mutations";
import { eventTypeSchema } from "@/lib/validators";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useEffect } from "react";

type FormData = z.infer<typeof eventTypeSchema>;

export function EventTypeEditPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { data: eventType, isLoading } = useOwnerEventType(slug!);
  const { mutate, isPending } = useUpdateEventType();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(eventTypeSchema),
  });

  useEffect(() => {
    if (eventType) {
      reset({
        slug: eventType.slug,
        name: eventType.name,
        description: eventType.description,
        durationMinutes: eventType.durationMinutes,
      });
    }
  }, [eventType, reset]);

  const onSubmit = (data: FormData) => {
    // Only slug is read-only in OpenAPI definition for update, but we keep it in form for visual
    const updateData = {
      name: data.name,
      description: data.description,
      durationMinutes: data.durationMinutes,
    };
    
    mutate({ slug: slug!, body: updateData }, {
      onSuccess: () => {
        toast.success("Event type updated");
        navigate("/owner/event-types");
      },
    });
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!eventType) return <div className="p-8 text-center">Event type not found</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Edit Event Type</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Event Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2 opacity-50">
              <Label htmlFor="slug">URL Slug (Cannot be changed)</Label>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">/</span>
                <Input id="slug" {...register("slug")} disabled />
              </div>
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
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate("/owner/event-types")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
