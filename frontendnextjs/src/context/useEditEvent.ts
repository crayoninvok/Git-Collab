// src/context/useEditEvent.ts
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
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        // Menggunakan path yang sesuai dengan index.ts
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL_BE}/events/edit/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch event data");
        }

        const data = await response.json();
        console.log("Parsed data:", data);

        if (!data) {
          throw new Error("No data received from server");
        }

        setEvent(data);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load event data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, isAuth, type]);

  const updateEvent = async (formData: FormData): Promise<void> => {
    if (!isAuth || type !== "promotor") {
      throw new Error("Not authorized");
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("Sending FormData:");
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      const ticketsData = formData.get("tickets");
      console.log("Tickets before sending:", ticketsData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_BE}/events/edit/${eventId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      console.log("Update response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update event");
      }

      const data = await response.json();
      if (!data) {
        throw new Error("No data received from server after update");
      }

      setEvent(data.data || data);
    } catch (err) {
      console.error("Error updating event:", err);
      setError(err instanceof Error ? err.message : "Failed to update event");
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
