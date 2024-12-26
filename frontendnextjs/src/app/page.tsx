// src/app/page.tsx
import Hero from "@/components/Hero";
import UpcomingEvents from "@/components/home/EventSection";

export default function Home() {
  return (
    <div>
      <main className="min-h-screen bg-black text-white">
        <Hero
          title="Embrace The Joy Of Live Events"
          highlightedText="With TIKO"
          searchPlaceholder="Find Your Concert"
        />
        <div className="container mx-auto px-4 space-y-16 py-12">
          <UpcomingEvents />
        </div>
      </main>
    </div>
  );
}