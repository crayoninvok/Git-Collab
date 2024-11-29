import { FaUser } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800/60 backdrop-blur-md text-white py-4 px-8 flex justify-between items-center shadow-md">
    
      <h1 className="text-xl font-bold text-orange-400">TIKO</h1>

    
      <ul className="flex gap-8 text-sm">
        <li className="hover:text-orange-400 cursor-pointer">Home</li>
        <li className="hover:text-orange-400 cursor-pointer">Event</li>
        <li className="hover:text-orange-400 cursor-pointer">Artist</li>
        <li className="hover:text-orange-400 cursor-pointer">News</li>
      </ul>

     
      <FaUser className="text-lg cursor-pointer hover:text-orange-400" />
    </nav>
  );
}
