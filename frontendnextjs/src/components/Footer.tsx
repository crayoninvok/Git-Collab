"use client";

import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaTwitter,
  FaTwitch,
  FaYoutube,
} from "react-icons/fa";
import Link from "next/link";
import { useSession } from "@/context/useSessionHook";

export default function Footer() {
  const { isAuth } = useSession();

  const socialLinks = [
    { icon: FaFacebook, href: "https://facebook.com", hoverColor: "hover:text-blue-600" },
    { icon: FaInstagram, href: "https://instagram.com", hoverColor: "hover:text-pink-500" },
    { icon: FaTiktok, href: "https://tiktok.com", hoverColor: "hover:text-black" },
    { icon: FaTwitter, href: "https://twitter.com", hoverColor: "hover:text-blue-400" },
    { icon: FaTwitch, href: "https://twitch.tv", hoverColor: "hover:text-purple-500" },
    { icon: FaYoutube, href: "https://youtube.com", hoverColor: "hover:text-red-600" },
  ];

  const navLinks = isAuth 
    ? [
        { href: "/about", label: "About" },
        { href: "/event", label: "Event" },
        { href: "/artist", label: "Artist" },
        { href: "/news", label: "News" },
        { href: "/help", label: "Help" },
      ]
    : [
        { href: "/about", label: "About" },
        { href: "/event", label: "Event" },
        { href: "/help", label: "Help" },
      ];

  const legalLinks = [
    { label: "Terms of Use", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
  ];

  return (
    <footer className="w-full bg-white text-gray-700 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="flex flex-col space-y-4">
            <h1 className="text-2xl font-bold text-orange-600">TIKO</h1>
            <div className="text-sm space-y-2">
              <p>Copyright © 2024 TIKO</p>
              <p>Bojongsoang, Bandung</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              {legalLinks.map((link, index) => (
                <Link 
                  key={link.label} 
                  href={link.href}
                  className="hover:text-orange-500 transition-colors"
                >
                  {link.label}
                  {index !== legalLinks.length - 1 && <span className="mx-2">|</span>}
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-4">
            <h2 className="text-lg font-semibold">Quick Links</h2>
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm hover:text-orange-500 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div className="flex flex-col space-y-4">
            <h2 className="text-lg font-semibold">Connect With Us</h2>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`transition-colors ${social.hoverColor}`}
                    aria-label={`Visit our ${social.href.split('https://')[1].split('.')[0]} page`}
                  >
                    <Icon size={24} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}