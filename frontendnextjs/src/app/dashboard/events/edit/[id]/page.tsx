'use client'

import { useState, useEffect } from 'react';
import { useSession } from '@/context/useSessionHook';
import { useRouter, useParams } from 'next/navigation';
import AdminSidebar from '@/components/adminSidebarDashboard';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  eventType?: 'free' | 'paid';
}

export default function EditEventPage() {
  const { isAuth, type } = useSession();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [eventData, setEventData] = useState<Event | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [newImage, setNewImage] = useState<File | null>(null);

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
        data.eventType = data.tickets[0]?.price === 0 ? 'free' : 'paid';
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!eventData) return;
    const { name, value } = e.target;
    
    if (name === 'time') {
      const timeValue = value.split(':').slice(0, 2).join(':');
      setEventData({ ...eventData, [name]: timeValue });
    } else {
      setEventData({ ...eventData, [name]: value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
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
      id: updatedTickets[index].id,
      category: field === 'category' ? value : updatedTickets[index].category,
      price: field === 'price' ? Number(value) : updatedTickets[index].price,
      quantity: field === 'quantity' ? Number(value) : updatedTickets[index].quantity
    };
    
    const eventType = updatedTickets[0]?.price === 0 ? 'free' : 'paid';
    setEventData({ ...eventData, tickets: updatedTickets, eventType });
  };

  const validateForm = () => {
    if (!eventData) return false;
    
    if (!eventData.title.trim()) return 'Title is required';
    if (!eventData.description.trim()) return 'Description is required';
    if (!eventData.venue.trim()) return 'Venue is required';
    if (!eventData.date) return 'Date is required';
    if (!eventData.time) return 'Time is required';
    if (!eventData.category) return 'Category is required';
    if (!eventData.location) return 'Location is required';

    for (const ticket of eventData.tickets) {
      if (!ticket.category.trim()) return 'Ticket category is required';
      if (ticket.price < 0) return 'Ticket price cannot be negative';
      if (ticket.quantity < 1) return 'Ticket quantity must be at least 1';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventData) return;

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      
      // Format the base event data
      const formattedEventData = {
        title: eventData.title,
        category: eventData.category,
        location: eventData.location,
        venue: eventData.venue,
        description: eventData.description,
        date: new Date(eventData.date).toISOString().split('T')[0],
        time: eventData.time,
        eventType: eventData.tickets[0]?.price === 0 ? 'free' : 'paid'
      };

      // Add all formatted event data to formData
      Object.entries(formattedEventData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      // Format tickets data
      const formattedTickets = eventData.tickets.map(ticket => ({
        id: ticket.id,
        category: ticket.category.trim(),
        price: Number(ticket.price),
        quantity: Number(ticket.quantity)
      }));

      formData.append('tickets', JSON.stringify(formattedTickets));

      if (newImage) {
        formData.append('banner', newImage);
      }

      console.log('Submitting data:', {
        ...formattedEventData,
        tickets: formattedTickets
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_BE}/events/edit/${params.id}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update event');
      }

      setSuccess('Event updated successfully');
      setTimeout(() => {
        router.push('/dashboard/events');
      }, 2000);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update event');
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-xl text-red-500">Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <AdminSidebar />
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-orange-500 mb-8">Edit Event</h1>

          {success && (
            <Alert className="mb-6 bg-green-500/10 text-green-500">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-6 bg-red-500/10 text-red-500">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setNewImage(null);
                      }}
                      className="mt-2 text-red-500 hover:text-red-400"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <label className="relative cursor-pointer bg-zinc-800 rounded-md font-medium text-orange-500 hover:text-orange-400 p-2">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
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
                className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={eventData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Time</label>
                <input
                  type="time"
                  name="time"
                  value={eventData.time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full px-3 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
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
                      className="w-full px-3 py-2 bg-zinc-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                      disabled={eventData.eventType === 'free'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Price</label>
                    <input
                      type="number"
                      value={ticket.price}
                      onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      min="0"
                      required
                      disabled={eventData.eventType === 'free'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Quantity</label>
                    <input
                      type="number"
                      value={ticket.quantity}
                      onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      min="1"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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