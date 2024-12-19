// src/app/event/[slug]/_components/EventHero.tsx
import { Event } from "@/types/event";
import { CalendarDays, Clock, MapPin } from "lucide-react";

interface EventHeroProps {
  event: Event;
}

export default function EventHero({ event }: EventHeroProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (time: Date) => {
    return new Date(time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      <img
        src={event.thumbnail || "/default-event.jpg"}
        alt={event.title}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="container mx-auto flex h-full flex-col justify-end px-4 pb-8">
          <div className="mb-4">
            <span className="inline-block rounded-full bg-orange-500 px-3 py-1 text-sm font-medium text-white">
              {event.category}
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-6 text-gray-300">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{formatTime(event.time)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{event.venue}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}