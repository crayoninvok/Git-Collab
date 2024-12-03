import Hero from "@/components/Hero";
import Lineup from "@/components/Lineup";


export default function Home() {
  return (
    <div
      className="relative min-h-screen text-white"
      style={{
        backgroundImage: "url('/DWPGIF.gif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Content */}
      <Hero targetDate = "2024-12-15T00:00:00" />
      <Lineup />
    </div>
  );
}

