"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { useState, useEffect } from "react";
import EventCard from "./EventCard";
import Link from "next/link";
import { Event } from "@/types/event";
import "swiper/css";
import "swiper/css/navigation";

interface CategoryOption {
  value: "all" | "Music" | "Orchestra" | "Opera" | "Other";
  label: string;
}

interface LocationOption {
  value: "all" | "Bandung" | "Bali" | "Surabaya" | "Jakarta";
  label: string;
}

const categories: CategoryOption[] = [
  { value: "all", label: "All Categories" },
  { value: "Music", label: "Music" },
  { value: "Orchestra", label: "Orchestra" },
  { value: "Opera", label: "Opera" },
  { value: "Other", label: "Other" },
];

const locations: LocationOption[] = [
  { value: "all", label: "All Locations" },
  { value: "Bandung", label: "Bandung" },
  { value: "Jakarta", label: "Jakarta" },
  { value: "Surabaya", label: "Surabaya" },
  { value: "Bali", label: "Bali" },
];

export default function EventSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryOption["value"]>("all");
  const [activeLocation, setActiveLocation] = useState<LocationOption["value"]>("all");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/events");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getLowestTicketPrice = (tickets: Event["tickets"]) => {
    if (!tickets?.length) return "Price not available";
    const lowestPrice = Math.min(...tickets.map((ticket) => ticket.price));
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(lowestPrice);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredEvents = events.filter((event) => {
    const matchesCategory = activeCategory === "all" || event.category === activeCategory;
    const matchesLocation = activeLocation === "all" || event.location === activeLocation;
    return matchesCategory && matchesLocation;
  });

  const topEvents = events
    .filter(event => event.tickets.length > 0)
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">Top Events</h2>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          slidesPerView={2}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          className="!px-1"
        >
          {topEvents.map((event) => (
            <SwiperSlide key={`top-${event.id}`}>
              <EventCard
                event={{
                  id: event.id.toString(),
                  slug: event.slug,
                  title: event.title,
                  date: formatDate(event.date),
                  venue: event.venue,
                  location: event.location,
                  ticketPrice: getLowestTicketPrice(event.tickets),
                  imageUrl: event.thumbnail || "/default-event.jpg",
                  isTopEvent: true,
                  category: event.category,
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>


      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Upcoming Events</h2>
          <Link href="/events" className="text-orange-400 hover:text-orange-300 text-sm">
            View All
          </Link>
        </div>


        <div className="space-y-3">

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setActiveCategory(category.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors
                  ${activeCategory === category.value
                    ? 'bg-orange-500 text-white'
                    : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>


          <div className="flex gap-2 overflow-x-auto pb-2">
            {locations.map((location) => (
              <button
                key={location.value}
                onClick={() => setActiveLocation(location.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors
                  ${activeLocation === location.value
                    ? 'bg-orange-500 text-white'
                    : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                  }`}
              >
                {location.label}
              </button>
            ))}
          </div>
        </div>


        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={16}
          slidesPerView={2}
          navigation
          loop={filteredEvents.length > 2}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          className="!px-1"
        >
          {filteredEvents.map((event) => (
            <SwiperSlide key={event.id}>
              <EventCard
                event={{
                  id: event.id.toString(),
                  slug: event.slug,
                  title: event.title,
                  date: formatDate(event.date),
                  venue: event.venue,
                  location: event.location,
                  ticketPrice: getLowestTicketPrice(event.tickets),
                  imageUrl: event.thumbnail || "/default-event.jpg",
                  category: event.category,
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
}