'use client'

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import AdminSidebar from "../../../components/adminSidebarDashboard";

type EventForm = {
  title: string;
  category: string;
  location: string;
  venue: string;
  description: string;
  date: string;
  time: string;
  eventType: "free" | "paid";
  bannerImage?: FileList;
};

type TicketType = {
  id: string;
  category: string;
  price: number;
  quantity: number;
};

// Define a custom error type
type ApiError = {
  message: string;
  error?: string;
};

export default function CreateEventPage() {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    { id: "free", category: "Free", price: 0, quantity: 1 }
  ]);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, setValue, watch, reset } = useForm<EventForm>({
    defaultValues: {
      eventType: "free"
    }
  });

  const eventType = watch("eventType");

  // Effect to handle ticket type changes when event type changes
  useEffect(() => {
    const currentQuantity = ticketTypes[0]?.quantity || 1;
    
    if (eventType === "free") {
      setTicketTypes([{ 
        id: "free", 
        category: "Free", 
        price: 0, 
        quantity: currentQuantity 
      }]);
    } else {
      setTicketTypes([{
        id: Date.now().toString(),
        category: "",
        price: 0,
        quantity: currentQuantity
      }]);
    }
  }, [eventType]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setValue("bannerImage", e.target.files as FileList);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTicketType = () => {
    setTicketTypes([
      ...ticketTypes,
      {
        id: Date.now().toString(),
        category: "",
        price: 0,
        quantity: 1
      }
    ]);
  };

  const removeTicketType = (id: string) => {
    if (ticketTypes.length > 1) {
      setTicketTypes(ticketTypes.filter(ticket => ticket.id !== id));
    }
  };

  const handleTicketChange = (
    index: number,
    field: keyof TicketType,
    value: string | number
  ) => {
    const updatedTickets = [...ticketTypes];
    
    if (eventType === "free") {
      if (field === "quantity") {
        updatedTickets[0] = {
          ...updatedTickets[0],
          quantity: Number(value)
        };
        setTicketTypes(updatedTickets);
      }
      return;
    }

    updatedTickets[index] = {
      ...updatedTickets[index],
      [field]: field === "price" || field === "quantity" ? Number(value) : value
    };
    setTicketTypes(updatedTickets);
  };

  const onSubmit = async (data: EventForm) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("category", data.category);
      formData.append("location", data.location);
      formData.append("venue", data.venue);
      formData.append("description", data.description);
      formData.append("date", data.date);
      formData.append("time", data.time);
      formData.append("eventType", data.eventType);

      const formattedTickets = ticketTypes.map(({ category, price, quantity }) => ({
        category,
        price,
        quantity,
      }));

      formData.append("tickets", JSON.stringify(formattedTickets));

      if (data.bannerImage?.[0]) {
        formData.append("banner", data.bannerImage[0]);
      }

      const token = localStorage.getItem("token");
      const response = await fetch("https://backend-minpro-kappa.vercel.app/api/events/create", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error);
      }

      alert("Event created successfully!");
      reset();
      setImagePreview("");
      setTicketTypes([{ id: "free", category: "Free", price: 0, quantity: 1 }]);
    } catch (error: unknown) {
      console.error("Error:", error);
      const apiError = error as ApiError;
      alert(apiError.message || "An error occurred while creating the event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <AdminSidebar/>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-zinc-900 rounded-xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-orange-500 mb-8 text-center">
            Create New Event
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Event Type Selection */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">Event Type</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    {...register("eventType")}
                    value="free"
                    className="mr-2"
                  />
                  Free Event
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    {...register("eventType")}
                    value="paid"
                    className="mr-2"
                  />
                  Paid Event
                </label>
              </div>
            </div>

            {/* Banner Upload */}
            <div>
              <label className="block mb-2 font-medium">Event Banner</label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={300}
                    height={200}
                  />
                ) : (
                  <span className="text-gray-500">No image selected</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2"
              />
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Event Title</label>
                <input
                  {...register("title")}
                  placeholder="Enter Event Title"
                  className="p-3 bg-zinc-800 rounded-lg w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Category</label>
                <select
                  {...register("category")}
                  className="p-3 bg-zinc-800 rounded-lg w-full"
                  required
                >
                  <option value="Music">Music</option>
                  <option value="Orchestra">Orchestra</option>
                  <option value="Opera">Opera</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Location</label>
                <select
                  {...register("location")}
                  className="p-3 bg-zinc-800 rounded-lg w-full"
                  required
                >
                  <option value="Bandung">Bandung</option>
                  <option value="Bali">Bali</option>
                  <option value="Surabaya">Surabaya</option>
                  <option value="Jakarta">Jakarta</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Venue</label>
                <input
                  {...register("venue")}
                  placeholder="Enter Venue"
                  className="p-3 bg-zinc-800 rounded-lg w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Date</label>
                <input
                  type="date"
                  {...register("date")}
                  className="p-3 bg-zinc-800 rounded-lg w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Time</label>
                <input
                  type="time"
                  {...register("time")}
                  className="p-3 bg-zinc-800 rounded-lg w-full"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                {...register("description")}
                placeholder="Enter Event Description"
                className="p-3 bg-zinc-800 rounded-lg w-full h-32"
                required
              />
            </div>

            {/* Tickets Section */}
            <div>
              <h2 className="text-lg font-bold mb-2 text-orange-500">Tickets</h2>
              <div className="space-y-4">
                {eventType === "free" ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-zinc-800 rounded-lg">
                    <div>
                      <label className="block mb-1 font-medium">Category</label>
                      <input
                        type="text"
                        value="Free"
                        className="p-3 bg-zinc-700 rounded-lg w-full cursor-not-allowed opacity-50"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Price (Rp)</label>
                      <input
                        type="number"
                        value={0}
                        className="p-3 bg-zinc-700 rounded-lg w-full cursor-not-allowed opacity-50"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Quantity</label>
                      <input
                        type="number"
                        value={ticketTypes[0].quantity}
                        onChange={(e) => handleTicketChange(0, "quantity", parseInt(e.target.value))}
                        className="p-3 bg-zinc-700 rounded-lg w-full"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {ticketTypes.map((ticket, index) => (
                      <div
                        key={ticket.id}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-zinc-800 rounded-lg relative group"
                      >
                        <div>
                          <label className="block mb-1 font-medium">Category</label>
                          <input
                            type="text"
                            value={ticket.category}
                            onChange={(e) => handleTicketChange(index, "category", e.target.value)}
                            className="p-3 bg-zinc-700 rounded-lg w-full"
                            placeholder="Enter category"
                            required
                          />
                        </div>
                        <div>
                          <label className="block mb-1 font-medium">Price (Rp)</label>
                          <input
                            type="number"
                            value={ticket.price}
                            onChange={(e) => handleTicketChange(index, "price", parseInt(e.target.value))}
                            className="p-3 bg-zinc-700 rounded-lg w-full"
                            min="0"
                            required
                          />
                        </div>
                        <div>
                          <label className="block mb-1 font-medium">Quantity</label>
                          <input
                            type="number"
                            value={ticket.quantity}
                            onChange={(e) => handleTicketChange(index, "quantity", parseInt(e.target.value))}
                            className="p-3 bg-zinc-700 rounded-lg w-full"
                            min="1"
                            required
                          />
                        </div>
                        {ticketTypes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTicketType(ticket.id)}
                            className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addTicketType}
                      className="px-4 py-2 bg-orange-500 rounded-lg text-white hover:bg-orange-600 transition-colors"
                    >
                      Add Ticket Category
                    </button>
                  </>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 py-3 rounded-lg text-white font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {loading ? "Creating Event..." : "Create Event"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}