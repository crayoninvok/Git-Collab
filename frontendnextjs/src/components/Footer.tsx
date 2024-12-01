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
        {/* FOOTER */}
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-orange-600">TIKO</h1>
          <p className="text-sm mt-2">Copyright 2023 TIKO, Bojongsoang</p>
          <ul className="text-xs mt-2 space-y-1">
            <li>Terms of Use | Privacy Policy | Cookie Policy</li>
            <li>GDPR/CCPA Privacy Request | Cookie Settings</li>
          </ul>
        </div>

        {/* BELUM DI LINK */}
        <div className="hidden md:flex space-x-6">
          <a href="#" className="text-sm hover:underline">
            About
          </a>
          <a href="#" className="text-sm hover:underline">
            Cities
          </a>
          <a href="#" className="text-sm hover:underline">
            Artist
          </a>
          <a href="#" className="text-sm hover:underline">
            Venues
          </a>
          <a href="#" className="text-sm hover:underline">
            Impact
          </a>
          <a href="#" className="text-sm hover:underline">
            Help
          </a>
        </div>

        {/* BELUM DI LINK */}
        <div>
          <h2 className="text-sm font-semibold mb-2">Find us on</h2>
          <div className="flex space-x-3">
            <a href="#" className="hover:text-gray-500">
              <FaFacebook size={24} />
            </a>
            <a href="#" className="hover:text-gray-500">
              <FaInstagram size={24} />
            </a>
            <a href="#" className="hover:text-gray-500">
              <FaTiktok size={24} />
            </a>
            <a href="#" className="hover:text-gray-500">
              <FaTwitter size={24} />
            </a>
            <a href="#" className="hover:text-gray-500">
              <FaTwitch size={24} />
            </a>
            <a href="#" className="hover:text-gray-500">
              <FaYoutube size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
