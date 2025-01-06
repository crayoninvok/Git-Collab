// src/hooks/useEditEvent.ts
import { useState, useEffect } from "react";
import { useSession } from "@/context/useSessionHook";

interface Ticket {
  id: number;
  category: string;
  price: number;
  quantity: number;
}

interface EventData {
  id: number;
  title: string;
  category: string;
  location: string;
  venue: string;
  description: string;
  date: string;
  time: string;
  thumbnail: string;
  tickets: Ticket[];
}

interface UseEditEventReturn {
  loading: boolean;
  error: string;
  event: EventData | null;
  updateEvent: (formData: FormData) => Promise<void>;
  setError: (error: string) => void;
}

export const useEditEvent = (eventId: string): UseEditEventReturn => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [event, setEvent] = useState<EventData | null>(null);
  const { isAuth, type } = useSession();

  useEffect(() => {
    const fetchEventData = async () => {
      if (!isAuth || type !== "promotor") return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL_BE}/events/edit/${eventId}/edit`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch event data");
        }

        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError("Failed to load event data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, isAuth, type]);

  const updateEvent = async (formData: FormData): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_BE}/events/edit/${eventId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      const updatedEvent = await response.json();
      setEvent(updatedEvent.data);
    } catch (err) {
      setError("Failed to update event");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    event,
    updateEvent,
    setError,
  };
};
