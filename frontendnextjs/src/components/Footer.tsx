import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaTwitter,
  FaTwitch,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 border-t border-gray-200 py-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-orange-600">TIKO</h1>
          <p className="text-sm mt-2">Copyright 2024 TIKO, Bojongsoang</p>
          <ul className="text-xs mt-2 space-y-1">
            <li>Terms of Use | Privacy Policy | Cookie Policy</li>
            <li>GDPR/CCPA Privacy Request | Cookie Settings</li>
          </ul>
        </div>

        <div className="hidden md:flex space-x-6">
          <a href="/about" className="text-sm hover:underline">
            About
          </a>
          <a href="/cities" className="text-sm hover:underline">
            Cities
          </a>
          <a href="/artist" className="text-sm hover:underline">
            Artist
          </a>
          <a href="/venues" className="text-sm hover:underline">
            Venues
          </a>
          <a href="/impact" className="text-sm hover:underline">
            Impact
          </a>
          <a href="/help" className="text-sm hover:underline">
            Help
          </a>
        </div>

        {/* BELUM DI LINK */}
        <div>
          <h2 className="text-md font-semibold mb-2">Find us on</h2>
          <div className="flex text-md space-x-3">
            <a
              href="https://www.facebook.com/?locale=id_ID"
              className="hover:text-blue-700"
            >
              <FaFacebook size={24} />
            </a>
            <a href="https://instagram.com/" className="hover:text-pink-400">
              <FaInstagram size={24} />
            </a>
            <a
              href="https://www.tiktok.com/id-ID/"
              className="hover:text-black"
            >
              <FaTiktok size={24} />
            </a>
            <a href="#" className="hover:text-blue-500">
              <FaTwitter size={24} />
            </a>
            <a href="https://www.twitch.tv/" className="hover:text-purple-500">
              <FaTwitch size={24} />
            </a>
            <a href="https://www.youtube.com/" className="hover:text-red-500">
              <FaYoutube size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
