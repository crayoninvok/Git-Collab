'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TicketType {
  name: string;
  price: number;
  endDate: string;
  endTime: string;
  soldOut?: boolean;
}

export default function ConcertPage() {
  const [selectedTab, setSelectedTab] = useState<'description' | 'ticket'>('description');
  const [selectedTicket, setSelectedTicket] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(0);

  const ticketTypes: TicketType[] = [
    {
      name: 'ORANGE',
      price: 1000000,
      endDate: '22 Dec 2024',
      endTime: '23:00 WIB'
    },
    {
      name: 'YELLOW',
      price: 1200000,
      endDate: '22 Dec 2024',
      endTime: '23:00 WIB'
    },
    {
      name: 'BLUE',
      price: 1800000,
      endDate: '22 Dec 2024',
      endTime: '23:00 WIB'
    },
    {
      name: 'GREEN A',
      price: 1500000,
      endDate: '22 Dec 2024',
      endTime: '23:00 WIB'
    },
    {
      name: 'GREEN B',
      price: 1500000,
      endDate: '22 Dec 2024',
      endTime: '23:00 WIB'
    },
    {
      name: 'FESTIVAL A',
      price: 2000000,
      endDate: '31 Oct 2024',
      endTime: '23:00 WIB',
      soldOut: true
    },
    {
      name: 'FESTIVAL B',
      price: 2300000,
      endDate: '31 Oct 2024',
      endTime: '23:00 WIB',
      soldOut: true
    }
  ];

  const handleDecrement = (ticketName: string) => {
    if (selectedTicket === ticketName || !selectedTicket) {
      if (quantity > 0) {
        setQuantity(quantity - 1);
        if (quantity - 1 === 0) {
          setSelectedTicket('');
        }
      }
    }
  };

  const handleIncrement = (ticketName: string) => {
    if (quantity < 4) {
      if (!selectedTicket || selectedTicket === ticketName) {
        setSelectedTicket(ticketName);
        setQuantity(quantity + 1);
      }
    }
  };

  const calculateTotal = () => {
    const ticket = ticketTypes.find(t => t.name === selectedTicket);
    return ticket ? ticket.price * quantity : 0;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      
 {/* Hero Section */}
      <div className="relative w-full flex justify-center items-center py-8">
        <div className="relative w-[1080px] h-[240px] rounded-lg overflow-hidden">
          <Image
            src="/CAS.jpg"
            alt="Cigarettes After Sex Concert"
            layout="fill"
            objectFit="cover"
            className="brightness-50"
            priority
          />
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b border-zinc-800">
        <div className="container mx-auto">
          <div className="flex gap-8 justify-center">
            <button 
              className={`py-4 px-2 ${selectedTab === 'description' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-zinc-400'}`}
              onClick={() => setSelectedTab('description')}
            >
              Description
            </button>
            <button 
              className={`py-4 px-2 ${selectedTab === 'ticket' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-zinc-400'}`}
              onClick={() => setSelectedTab('ticket')}
            >
              Ticket
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-12">
        <div className="max-w-3xl mx-auto">
          {selectedTab === 'description' ? (
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Event Description</h2>
              <p className="text-zinc-300 mb-8">
                Get ready for an unforgettable evening as Cigarettes After Sex brings their dreamy, ambient sound to Jakarta! The iconic indie pop band will perform live at Jakarta Beach City International Stadium on February 20, 2025. Known for their mesmerizing hits like "Nothing's Gonna Hurt You Baby" and "Apocalypse," the band promises an intimate and ethereal experience for all music lovers.  
                Set against the stunning backdrop of Jakarta Beach City, this concert will feature their signature melancholic melodies, romantic lyrics, and hypnotic atmosphere. Don't miss this chance to immerse yourself in their soothing soundscape.  
                Secure your tickets now and join us for a night of music, emotion, and magic. Doors open at 6:00 PM.
              </p>
              
              {/* Seating Map */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Seating Map</h3>
                <div className="relative w-full h-[400px] bg-black rounded-lg overflow-hidden">
                  <Image
                    src="/bcis_venue.png"
                    alt="Seating Map"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Ticket Selection */}
              {ticketTypes.map((ticket) => (
                <Card 
                  key={ticket.name}
                  className="mb-4 bg-white/85 border-zinc-800"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-black">{ticket.name}</h3>
                        <div className="flex items-center text-sm text-orange-400 mt-1">
                          <span className="mr-2">⏰</span>
                          <span>Berakhir {ticket.endDate} • {ticket.endTime}</span>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-black">
                        Rp{ticket.price.toLocaleString()}
                      </div>
                    </div>

                    {!ticket.soldOut ? (
                      <div className="flex justify-end items-center gap-4">
                        <Button
                          onClick={() => handleDecrement(ticket.name)}
                          variant="outline"
                          className="w-8 h-8 rounded-full p-0"
                          disabled={Boolean(selectedTicket && selectedTicket !== ticket.name)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center text-black">
                          {selectedTicket === ticket.name ? quantity : 0}
                        </span>
                        <Button
                          onClick={() => handleIncrement(ticket.name)}
                          variant="outline"
                          className="w-8 h-8 rounded-full p-0"
                          disabled={Boolean(selectedTicket && selectedTicket !== ticket.name) || quantity >= 4}
                        >
                          +
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <span className="text-red-500 font-bold">SOLD OUT</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Total and Buy Button */}
              <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-zinc-400">Total</p>
                    <p className="text-xl font-bold">Rp{calculateTotal().toLocaleString()}</p>
                  </div>
                  <Button 
                    className="px-8 bg-red-500 hover:bg-red-600"
                    disabled={quantity === 0}
                    variant="default"
                  >
                    Buy Ticket
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}