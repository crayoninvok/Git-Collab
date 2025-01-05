<<<<<<< HEAD

=======
import Image from "next/image";
import { formatPrice } from "@/helpers/formatPrice";
>>>>>>> e1fddd8f90f19c6e0630e2f0849cb2353045562c
import Link from "next/link";
import { FaMapMarkerAlt, FaCalendarAlt, FaTicketAlt } from "react-icons/fa";
import { formatDate } from "@/helpers/formatDate";

interface Event {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  category: "Music" | "Orchestra" | "Opera" | "Other";
  location: "Bandung" | "Bali" | "Surabaya" | "Jakarta";
  venue: string;
  description: string;
  date: string;
  time: string;
  tickets: Array<{
    id: number;
    category: string;
    price: number;
    quantity: number;
  }>;
}

interface EventCardProps {
  event: Event;
  isTopEvent?: boolean;
}

export default function EventCard({ event, isTopEvent }: EventCardProps) {
  const default_thumbnail = process.env.NEXT_PUBLIC_DEFAULT_EVENT_THUMBNAIL;
  const lowestPrice = Math.min(...event.tickets.map(ticket => ticket.price));

  return (
    <div className="group h-full">
      <Link href={`/concert/${event.slug}`}>
        <div className="flex flex-col overflow-hidden rounded-xl bg-gradient-to-b from-zinc-800 to-zinc-900 shadow-xl transition-all duration-300 h-full">
          {/* Image Container */}
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={event.thumbnail || default_thumbnail || "/concert1.jpg"}
              alt={event.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-110"
            />
            {isTopEvent && (
              <div className="absolute left-2 top-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-3 py-1 text-xs font-medium text-white shadow-lg">
                Premium
              </div>
            )}
          </div>

          {/* Content Container */}
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-bold mb-3 text-white line-clamp-2 group-hover:text-orange-400 transition-colors">
              {event.title}
            </h3>

            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-orange-400" />
                <span>{formatDate(event.date)}</span>
              </div>

              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-orange-400" />
                <span>{event.location}</span>
              </div>

              <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaTicketAlt className="text-orange-400" />
                  <span className="text-sm text-gray-300">
                    {lowestPrice > 0 ? "From" : "Free Entry"}
                  </span>
                </div>
                {lowestPrice > 0 && (
                  <span className="font-semibold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full">
                    {formatPrice(lowestPrice)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}