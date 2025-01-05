"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { useState, useEffect } from "react";
import EventCard from "./EventCard";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";

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

export default function EventSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE || 'http://localhost:8000/api';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('Fetching events from:', `${base_url}/events`);
        const response = await fetch(`${base_url}/events`);
        const data = await response.json();
        console.log('Received data:', data);

        if (!Array.isArray(data)) {
          console.error('Data is not an array:', data);
          return;
        }

        // Filter future events
        const now = new Date();
        const upcomingEvents = data.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate > now;
        });

        console.log('Filtered upcoming events:', upcomingEvents);
        setEvents(upcomingEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [base_url]);

  // Sort and filter events
  const topEvents = events
    .filter(event => event.tickets.some(ticket => ticket.price > 1500000))
    .slice(0, 5);

  const upcomingEvents = [...events]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const freeEvents = events
    .filter(event => event.tickets.some(ticket => ticket.price === 0))
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const EventSlider = ({ title, events, viewAllLink }: { title: string; events: Event[]; viewAllLink?: string }) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {viewAllLink && events.length > 0 && (
          <Link
            href={viewAllLink}
            className="px-4 py-2 bg-orange-500 rounded-full text-white text-sm hover:bg-orange-600 transition-colors"
          >
            View All
          </Link>
        )}
      </div>

      {events.length > 0 ? (
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          loop={events.length > 1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 }
          }}
          className="py-4"
        >
          {events.map((event) => (
            <SwiperSlide key={event.id}>
              <EventCard 
                event={event} 
                isTopEvent={event.tickets.some(ticket => ticket.price > 1500000)} 
              />
            </SwiperSlide>
          ))}
        </Swiper >
      ) : (
        <div className="text-center py-10 text-gray-400">
          No events available for this category
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-12 px-4 md:px-6 lg:px-8 max-w-[2000px] mx-auto">
      {topEvents.length > 0 && <EventSlider title="Premium Events" events={topEvents} />}
      {upcomingEvents.length > 0 && <EventSlider title="Upcoming Events" events={upcomingEvents} viewAllLink="/events" />}
      {freeEvents.length > 0 && <EventSlider title="Free Events" events={freeEvents} viewAllLink="/events?free=true" />}
    </div>
  );
}