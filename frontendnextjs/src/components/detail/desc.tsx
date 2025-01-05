// src/components/detail/desc.tsx
import { Event } from "@/types/event";
import { MapPin } from "lucide-react";

interface EventDetailsProps {
  event: Event;
}

export default function EventDetails({ event }: EventDetailsProps) {
  return (
    <div className="space-y-8 text-white">
      <section className="rounded-xl bg-zinc-900 p-6">
        <h2 className="mb-4 text-2xl font-bold">About This Event</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 whitespace-pre-wrap">{event.description}</p>
        </div>
      </section>

      <section className="rounded-xl bg-zinc-900 p-6">
        <h2 className="mb-4 text-2xl font-bold">Venue Information</h2>
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-zinc-800 p-4 flex-1">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 mt-1 text-orange-500" />
              <div>
                <h3 className="font-medium text-orange-400">{event.venue}</h3>
                <p className="mt-1 text-sm text-gray-400">{event.location}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl bg-zinc-900 p-6">
        <h2 className="mb-4 text-2xl font-bold">Event Rules</h2>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-orange-500">•</span>
            <span>Please arrive at least 30 minutes before the event starts</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500">•</span>
            <span>Valid ID matching the ticket name is required for entry</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500">•</span>
            <span>No refunds or exchanges except in case of event cancellation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500">•</span>
            <span>Professional cameras and recording equipment are not permitted</span>
          </li>
        </ul>
      </section>
    </div>
  );
}