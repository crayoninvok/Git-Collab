import { Event } from "@/types/event";
import Link from "next/link";

interface EventCardProps {
  event: {
    id: string;
    slug: string; 
    title: string;
    date: string;
    venue: string;
    ticketPrice: string;
    imageUrl: string;
    category?: "Music" | "Orchestra" | "Opera" | "Other";
    location?: "Bandung" | "Bali" | "Surabaya" | "Jakarta";
    isTopEvent?: boolean;
  };
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/concert/${event.slug}`} className="block"> 
      <div className="group relative overflow-hidden rounded-lg bg-zinc-900 transition-all duration-300 hover:shadow-lg">
        <div className="relative h-[200px]">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          {event.isTopEvent && (
            <span className="absolute left-2 top-2 rounded-full bg-orange-500 px-2 py-0.5 text-xs font-medium text-white">
              Top Event
            </span>
          )}
        </div>
        <div className="p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold text-white line-clamp-2 group-hover:text-orange-400 transition-colors">
              {event.title}
            </h3>
          </div>
          <div className="space-y-1 text-xs">
            <p className="text-gray-400">{event.date}</p>
            <div className="flex items-center justify-between">
              <p className="text-gray-400">{event.location}</p>
              <p className="font-medium text-orange-400">{event.ticketPrice}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}