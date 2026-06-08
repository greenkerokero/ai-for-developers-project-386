import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOwnerAvailability } from "@/api/availability.queries";
import { useUpdateAvailability } from "@/api/availability.mutations";
import { availabilityScheduleSchema } from "@/lib/validators";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useEffect } from "react";

type FormData = z.infer<typeof availabilityScheduleSchema>;

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

export function AvailabilityPage() {
  const { data: schedule, isLoading } = useOwnerAvailability();
  const { mutate, isPending } = useUpdateAvailability();

  const { register, control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(availabilityScheduleSchema),
    defaultValues: {
      rules: DAYS.map(day => ({
        dayOfWeek: day,
        isAvailable: false,
        startTime: "09:00",
        endTime: "17:00"
      }))
    }
  });

  const { fields } = useFieldArray({
    control,
    name: "rules"
  });

  useEffect(() => {
    if (schedule?.rules) {
      // Ensure all days are represented
      const mappedRules = DAYS.map(day => {
        const existing = schedule.rules.find(r => r.dayOfWeek === day);
        if (existing) return existing;
        return { dayOfWeek: day, isAvailable: false, startTime: "09:00", endTime: "17:00" };
      });
      reset({ rules: mappedRules });
    }
  }, [schedule, reset]);

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Availability updated");
      },
    });
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Availability</h1>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="w-32 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`rules.${index}.isAvailable`}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    {...register(`rules.${index}.isAvailable`)}
                  />
                  <Label htmlFor={`rules.${index}.isAvailable`} className="capitalize font-medium text-base">
                    {field.dayOfWeek}
                  </Label>
                </div>
                
                <div className="flex-1 flex items-center space-x-4">
                  <Input 
                    type="time" 
                    {...register(`rules.${index}.startTime`)} 
                    className="w-32"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input 
                    type="time" 
                    {...register(`rules.${index}.endTime`)} 
                    className="w-32"
                  />
                </div>
                {/* Hidden input to keep dayOfWeek in the form data */}
                <input type="hidden" {...register(`rules.${index}.dayOfWeek`)} value={field.dayOfWeek} />
              </div>
            ))}

            <div className="flex justify-end pt-4">
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
