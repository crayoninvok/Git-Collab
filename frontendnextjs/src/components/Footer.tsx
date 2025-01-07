"use client";

import {
  FaInstagram,
} from "react-icons/fa";
import Link from "next/link";
import { useSession } from "@/context/useSessionHook";

export default function Footer() {
  const { isAuth } = useSession();

  const socialLinks = [
    { icon: FaInstagram, href: "https://instagram.com/tsani", hoverColor: "hover:text-pink-500", label: "Tsania's Instagram" },
    { icon: FaInstagram, href: "https://instagram.com/dzaky", hoverColor: "hover:text-pink-500", label: "Dzaky's Instagram" },

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
    <footer className="bg-gradient-to-r from-orange-700 to-red-800 text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
   
          <div>
            <h1 className="text-3xl font-bold mb-4">TIKO</h1>
            <p className="text-sm">Asia Afrika Tower , Bandung</p>
            <p className="text-xs mt-2">© 2024 TIKO. All Rights Reserved.</p>
            <div className="flex flex-wrap mt-4 gap-2 text-xs">
              {legalLinks.map((link, index) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="hover:underline"
                >
                  {link.label}
                  {index !== legalLinks.length - 1 && (
                    <span className="mx-1 text-gray-300">|</span>
                  )}
                </Link>
              ))}
            </div>
            <p className="mt-4 text-xs italic">
              Developed by <strong>Tsania</strong> and <strong>Dzaky</strong>, Purwadhika Bandung
            </p>
          </div>


          <div>
            <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
            <div className="grid grid-cols-2 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm hover:underline hover:text-gray-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>


          <div>
            <h2 className="text-lg font-semibold mb-4">Connect With Us</h2>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-white transition-colors ${social.hoverColor}`}
                    aria-label={social.label || `Visit our ${social.href.split('https://')[1].split('.')[0]} page`}
                  >
                    <div className="flex flex-col items-center text-xs">
                      <Icon size={28} />
                      {social.label && <span className="mt-1 text-gray-300">{social.label}</span>}
                    </div>
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
