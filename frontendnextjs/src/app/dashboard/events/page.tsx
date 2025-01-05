'use client'
// src/app/promotor/my-events/page.tsx
import { useState, useEffect } from 'react';
import { useSession } from '@/context/useSessionHook';
import { formatDate } from '@/helpers/formatDate';
import Link from 'next/link';
import Image from 'next/image';
import AdminSidebar from '@/components/AdminSidebar';

interface Event {
 id: number;
 title: string;
 date: string;
 venue: string;
 thumbnail: string;
 reviews: {
   id: number;
   rating: number;
   comment: string;
   user: {
     username: string;
   };
 }[];
}

export default function MyEventsPage() {
    const { isAuth, type } = useSession();
    const [events, setEvents] = useState<Event[]>([]);
    const [showPastEvents, setShowPastEvents] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            if (!isAuth || type !== 'promotor') return;

            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Authentication token not found');

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL_BE}/promotors/events`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch events');
                }

                const data = await response.json();
                setEvents(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load events');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [isAuth, type]);

    const now = new Date();
    const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return showPastEvents ? eventDate <= now : eventDate > now;
    });

    if (!isAuth || type !== 'promotor') return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <p className="text-xl text-white">Please log in as a promotor to view this page.</p>
        </div>
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="animate-pulse text-xl text-white">Loading events...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black pt-[65px]">
            <div className="max-w-[2000px] mx-auto p-4 sm:p-6 lg:p-8">
                <AdminSidebar/>

                {/* Tab Buttons */}
                <div className="mb-12 flex justify-between items-center gap-6">
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowPastEvents(false)}
                            className={`px-8 py-4 rounded-2xl font-medium text-sm transition-all
               ${!showPastEvents
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                                    : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'}`}
                        >
                            Upcoming Events
                        </button>
                        <button
                            onClick={() => setShowPastEvents(true)}
                            className={`px-8 py-4 rounded-2xl font-medium text-sm transition-all
               ${showPastEvents
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                                    : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'}`}
                        >
                            Past Events
                        </button>
                    </div>

                    {!showPastEvents && (
                        <Link href="/dashboard/create"
                            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 
                  text-white text-center rounded-2xl font-medium hover:from-green-600 
                  hover:to-emerald-600 transition-all shadow-lg shadow-green-500/30"
                        >
                            Create New Event
                        </Link>
                    )}
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                            <div key={event.id}
                                className="group bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-2xl overflow-hidden 
                      hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 
                      hover:scale-[1.02] border border-zinc-800/50"
                            >
                                <div className="relative aspect-[16/9]">
                                    <Image
                                        src={event.thumbnail || '/placeholder.jpg'}
                                        alt={event.title}
                                        layout="fill"
                                        objectFit="cover"
                                        className="transition-all duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 text-white">
                                        <h3 className="text-lg font-bold">{event.title}</h3>
                                        <div className="text-sm text-gray-300">
                                            <p>{formatDate(event.date)}</p>
                                            <p>{event.venue}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {showPastEvents ? (
                                        <Link href={`/dashboard/events/review/${event.id}`}
                                            className="block w-full text-center bg-gradient-to-r from-blue-500 to-blue-600 
                            text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 
                            hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30"
                                        >
                                            {event.reviews.length} Reviews
                                        </Link>
                                    ) : (
                                        <Link href={`/dashboard/events/edit/${event.id}`}
                                            className="block w-full text-center bg-gradient-to-r from-orange-500 to-orange-600 
                            text-white px-6 py-3 rounded-xl font-medium hover:from-orange-600 
                            hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
                                        >
                                            Edit Event
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full">
                            <div className="bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 rounded-2xl p-12 text-center">
                                <div className="text-5xl mb-4">🎪</div>
                                <p className="text-xl text-gray-300 mb-2">
                                    {showPastEvents ? 'No past events found' : 'No upcoming events'}
                                </p>
                                {!showPastEvents && (
                                    <p className="text-gray-500">
                                        Time to create your first amazing event!
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
