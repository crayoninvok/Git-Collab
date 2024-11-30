import Link from "next/link";
import { FaUser } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800/60 backdrop-blur-md text-white py-4 px-8 flex justify-between items-center shadow-md">
    
      <Link href="/"><h1 className="text-xl font-bold text-orange-400">TIKO</h1></Link>

    
      <ul className="flex gap-8 text-sm">
        <Link className="hover:text-orange-400 cursor-pointer" href= "/">Homepage</Link>
        <Link className="hover:text-orange-400 cursor-pointer" href= "/event">Event</Link>
        <Link className="hover:text-orange-400 cursor-pointer" href= "/artist">Artist</Link>
        <Link className="hover:text-orange-400 cursor-pointer" href= "/news">News</Link>
      </ul>
      <Link href="/login"><FaUser className="text-lg cursor-pointer hover:text-orange-400" /></Link>
    </nav>
  );
}
