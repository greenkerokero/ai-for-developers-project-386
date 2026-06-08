import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 max-w-3xl mx-auto">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
        Назначение встреч стало проще
      </h1>
      <p className="text-xl text-muted-foreground leading-relaxed">
        Удобный сервис для бронирования времени. Забудьте о бесконечных переписках — выберите удобный слот и запланируйте звонок в пару кликов.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" asChild>
          <Link to="/events">Выбрать время</Link>
        </Button>
      </div>
    </div>
  );
}
