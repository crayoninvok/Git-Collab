"use client";

import { useEffect, useState } from "react";
import { Event } from "@/types/event";
import EventTickets from "@/components/detail/ticket";
import EventDetails from "@/components/detail/desc";
import EventHero from "@/components/detail/hero";
import { useRouter } from "next/navigation";


export default function EventDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Remove token requirement from the fetch request
        const response = await fetch(
          `http://localhost:8000/api/events/slug/${params.slug}`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to fetch event");
        }

        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load event details"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (params.slug) {
      fetchEvent();
    }
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-orange-500" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white gap-4">
        <p className="text-red-400">{error || "Event not found"}</p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      <EventHero event={event} />
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <EventDetails event={event} />
          </div>
          <div>
            <div className="lg:sticky lg:top-4">
              <EventTickets
                tickets={event.tickets}
                isPurchased={event.isPurchased}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}