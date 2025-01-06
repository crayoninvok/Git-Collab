"use client";

import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { Calendar} from "lucide-react";
import EventCard from "@/components/home/EventCard";
import SearchEvent from "@/components/search";
import { Event } from "@/types/event";

type CategoryType = "all" | "Music" | "Orchestra" | "Opera" | "Other";
type LocationType = "all" | "Bandung" | "Bali" | "Surabaya" | "Jakarta";
type SortType = "date-asc" | "date-desc" | "price-asc" | "price-desc";

interface FilterOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

const categories: FilterOption[] = [
  { value: "all", label: "All Categories" },
  { value: "Music", label: "Music", icon: "🎵" },
  { value: "Orchestra", label: "Orchestra", icon: "🎻" },
  { value: "Opera", label: "Opera", icon: "🎭" },
  { value: "Other", label: "Other", icon: "✨" },
];

const locations: FilterOption[] = [
  { value: "all", label: "All Locations" },
  { value: "Bandung", label: "Bandung" },
  { value: "Jakarta", label: "Jakarta" },
  { value: "Surabaya", label: "Surabaya" },
  { value: "Bali", label: "Bali" },
];

const sortOptions: FilterOption[] = [
  { value: "date-asc", label: "Date (Nearest)" },
  { value: "date-desc", label: "Date (Furthest)" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
];

export default function ViewAllEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryType>("all");
  const [activeLocation, setActiveLocation] = useState<LocationType>("all");
  const [activeSort, setActiveSort] = useState<SortType>("date-asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 12;
  const base_url=process.env.NEXT_PUBLIC_BASE_URL_BE

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${base_url}/events`);
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        if (!Array.isArray(data)) {
          console.error("Received data is not an array:", data);
          setEvents([]);
          return;
        }
        
        // Filter out past events
        const now = new Date();
        const futureEvents = data.filter(event => new Date(event.date) >= now);
        setEvents(futureEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const filteredAndSortedEvents = useMemo(() => {
    const filtered = events.filter((event) => {
      const matchesCategory = activeCategory === "all" || event.category === activeCategory;
      const matchesLocation = activeLocation === "all" || event.location === activeLocation;
      const matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesLocation && matchesSearch;
    });

    // Sort events based on selected option
    return filtered.sort((a, b) => {
      switch (activeSort) {
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "price-asc":
          return Math.min(...a.tickets.map(t => t.price)) - Math.min(...b.tickets.map(t => t.price));
        case "price-desc":
          return Math.max(...b.tickets.map(t => t.price)) - Math.max(...a.tickets.map(t => t.price));
        default:
          return 0;
      }
    });
  }, [events, activeCategory, activeLocation, searchQuery, activeSort]);

  const totalPages = Math.ceil(filteredAndSortedEvents.length / eventsPerPage);
  const currentEvents = filteredAndSortedEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  const FilterButton = ({ 
    option, 
    isActive, 
    onClick 
  }: { 
    option: FilterOption; 
    isActive: boolean; 
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`
        rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all
        flex items-center gap-2 hover:scale-105
        ${isActive 
          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
          : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
        }
      `}
    >
      {option.icon && <span>{option.icon}</span>}
      {option.label}
    </button>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-orange-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 pt-24 pb-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Upcoming Events</h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(), "MMMM d, yyyy")}</span>
          </div>
        </div>

        <div className="space-y-6">
          <SearchEvent onSearch={handleSearch} />

          <div className="flex flex-col gap-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <FilterButton
                  key={category.value}
                  option={category}
                  isActive={activeCategory === category.value}
                  onClick={() => {
                    setActiveCategory(category.value as CategoryType);
                    setCurrentPage(1);
                  }}
                />
              ))}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {locations.map((location) => (
                <FilterButton
                  key={location.value}
                  option={location}
                  isActive={activeLocation === location.value}
                  onClick={() => {
                    setActiveLocation(location.value as LocationType);
                    setCurrentPage(1);
                  }}
                />
              ))}
            </div>

            <div className="flex justify-between items-center">
              <p className="text-gray-400">
                Showing {currentEvents.length} of {filteredAndSortedEvents.length} events
              </p>
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value as SortType)}
                className="bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {currentEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-xl font-semibold mb-2">No events found</h3>
            <p>Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentEvents.map((event) => (
              <EventCard
                key={event.id}
                event={{
                  ...event,
                  date: new Date(event.date).toISOString(),
                  time: new Date(event.time).toISOString(),
                }}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-zinc-800 text-white disabled:opacity-50 
                disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-orange-500 text-white"
                    : "bg-zinc-800 text-white hover:bg-zinc-700"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-zinc-800 text-white disabled:opacity-50 
                disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}