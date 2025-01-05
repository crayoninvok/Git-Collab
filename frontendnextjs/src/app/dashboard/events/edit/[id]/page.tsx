'use client'
// src/app/promotor/edit-event/[id]/page.tsx

import { useState, useEffect } from 'react';
import { useSession } from '@/context/useSessionHook';
import { useRouter, useParams } from 'next/navigation';
import AdminSidebar from '@/components/adminSidebarDashboard';


interface Ticket {
  id: number;
  category: string;
  price: number;
  quantity: number;
}

interface Event {
  id: number;
  title: string;
  category: string;
  location: string;
  venue: string;
  description: string;
  date: string;
  time: string;
  thumbnail: string;
  tickets: Ticket[];
}

export default function EditEventPage() {
  const { isAuth, type } = useSession();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [eventData, setEventData] = useState<Event | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    const fetchEventData = async () => {
      if (!isAuth || type !== 'promotor') return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL_BE}/events/edit/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch event data');
        }

        const data = await response.json();
        setEventData(data);
        setImagePreview(data.thumbnail || '');
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load event data');
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [isAuth, type, params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!eventData) return;
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTicketChange = (index: number, field: keyof Ticket, value: string) => {
    if (!eventData) return;
    const updatedTickets = [...eventData.tickets];
    updatedTickets[index] = {
      ...updatedTickets[index],
      [field]: field === 'category' ? value : Number(value)
    };
    setEventData({ ...eventData, tickets: updatedTickets });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventData) return;

    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      Object.keys(eventData).forEach(key => {
        if (key !== 'tickets' && key !== 'thumbnail') {
          formData.append(key, String(eventData[key as keyof Event]));
        }
      });

      formData.append('tickets', JSON.stringify(eventData.tickets));

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput.files?.[0]) {
        formData.append('banner', fileInput.files[0]);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_BE}/api/events/edit/${params.id}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      router.push('/promotor/my-events');
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to update event');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuth || type !== 'promotor') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-xl text-white">Please log in as a promotor to edit events.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-xl text-white">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-xl text-white">Event not found</p>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-black py-12 px-4">
                <AdminSidebar/>
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-orange-500 mb-8">Edit Event</h1>

          {/* Banner Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">Event Banner</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <div className="mb-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mx-auto h-48 w-96 object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="flex text-sm text-gray-400">
                    <label className="relative cursor-pointer bg-zinc-800 rounded-md font-medium text-orange-500 hover:text-orange-400">
                      <span>Upload a file</span>
                      <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                )}
                <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={eventData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Category</label>
                <select
                  name="category"
                  value={eventData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white"
                  required
                >
                  <option value="Music">Music</option>
                  <option value="Orchestra">Orchestra</option>
                  <option value="Opera">Opera</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Location</label>
                <select
                  name="location"
                  value={eventData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white"
                  required
                >
                  <option value="Bandung">Bandung</option>
                  <option value="Bali">Bali</option>
                  <option value="Surabaya">Surabaya</option>
                  <option value="Jakarta">Jakarta</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Venue</label>
              <input
                type="text"
                name="venue"
                value={eventData.venue}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={eventData.date.split('T')[0]}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Time</label>
                <input
                  type="time"
                  name="time"
                  value={eventData.time.split('T')[1]?.substring(0, 5) || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Description</label>
              <textarea
                name="description"
                value={eventData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white"
                required
              />
            </div>

            {/* Tickets */}
            <div>
              <h3 className="text-lg font-medium text-orange-500 mb-4">Tickets</h3>
              {eventData.tickets.map((ticket, index) => (
                <div key={ticket.id} className="grid grid-cols-3 gap-4 mb-4 p-4 bg-zinc-800 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Category</label>
                    <input
                      type="text"
                      value={ticket.category}
                      onChange={(e) => handleTicketChange(index, 'category', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-700 border border-gray-600 rounded-lg text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Price</label>
                    <input
                      type="number"
                      value={ticket.price}
                      onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-700 border border-gray-600 rounded-lg text-white"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Quantity</label>
                    <input
                      type="number"
                      value={ticket.quantity}
                      onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-700 border border-gray-600 rounded-lg text-white"
                      min="1"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                {submitting ? 'Updating...' : 'Update Event'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}