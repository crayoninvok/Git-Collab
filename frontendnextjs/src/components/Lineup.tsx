export default function Lineup() {
  const artists = [
    { name: "Anyma", image: "/anyamanobg.png" },
    { name: "Armin van Buuren", image: "/arminnobg.png" },
    { name: "Steve Aoki", image: "/stevenobg.png" },
    { name: "Timmy Trumpet", image: "/timynobg.png" },
  ];

  return (
    <section className="bg-transparant py-12 text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold glowing-text mb-6">
          LINE UP
        </h2>
        <p className="uppercase text-sm tracking-wide mb-6">
          In Alphabetical Order
        </p>
        <a
          href="#view-all"
          className="text-green-500 mb-6 inline-block"
        >
          View All
        </a>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {artists.map((artist, index) => (
            <div
              key={index}
              className="relative rounded-xl overflow-hidden border border-gray-400 shadow-lg transition-transform transform hover:scale-105 hover:shadow-glow cursor-pointer"
            >
              {/* Image */}
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
              {/* Artist Name Overlay */}
              <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 py-3 text-center">
                <p className="text-xl font-bold tracking-wide">{artist.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
