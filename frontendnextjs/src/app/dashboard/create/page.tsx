"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { useState } from "react";

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: "Open" | "In Progress" | "Closed";
}

export default function TicketingPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [formTicket, setFormTicket] = useState({
    id: 0,
    title: "",
    description: "",
    status: "Open",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Handle ticket submission (Add or Update)
  const handleSubmitTicket = () => {
    if (!formTicket.title || !formTicket.description) {
      alert("Please fill in all fields");
      return;
    }

    if (isEditing) {
      // Update existing ticket
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === formTicket.id
            ? {
                ...formTicket,
                status: formTicket.status as "Open" | "In Progress" | "Closed",
              }
            : ticket
        )
      );
      setIsEditing(false);
    } else {
      // Add new ticket
      const newTicket: Ticket = {
        id: Date.now(),
        title: formTicket.title,
        description: formTicket.description,
        status: "Open",
      };
      setTickets([...tickets, newTicket]);
    }

    // Reset form
    setFormTicket({ id: 0, title: "", description: "", status: "Open" });
  };

  // Handle edit ticket
  const handleEditTicket = (ticket: Ticket) => {
    setFormTicket(ticket);
    setIsEditing(true);
  };

  // Handle delete ticket
  const handleDeleteTicket = (id: number) => {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== id));
  };

  // Helper function for status color
  const statusColor = (status: Ticket["status"]) => {
    switch (status) {
      case "Open":
        return "text-green-500";
      case "In Progress":
        return "text-yellow-500";
      case "Closed":
        return "text-red-500";
      default:
        return "";
    }
  };

  // Ticket Item Component
  const TicketItem = ({
    ticket,
    onEdit,
    onDelete,
  }: {
    ticket: Ticket;
    onEdit: (t: Ticket) => void;
    onDelete: (id: number) => void;
  }) => (
    <li className="border-b last:border-b-0 py-4 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-bold">{ticket.title}</h3>
        <p className="text-sm text-gray-600">{ticket.description}</p>
        <p className={`text-sm font-semibold ${statusColor(ticket.status)}`}>
          {ticket.status}
        </p>
      </div>
      <div className="space-x-2">
        <button
          onClick={() => onEdit(ticket)}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(ticket.id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </li>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Ticketing System</h1>

        {/* Add/Edit Ticket Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? "Edit Ticket" : "Add Ticket"}
          </h2>
          <input
            type="text"
            placeholder="Title"
            value={formTicket.title}
            onChange={(e) =>
              setFormTicket({ ...formTicket, title: e.target.value })
            }
            className="w-full p-2 mb-4 border rounded-md"
          />
          <textarea
            placeholder="Description"
            value={formTicket.description}
            onChange={(e) =>
              setFormTicket({ ...formTicket, description: e.target.value })
            }
            className="w-full p-2 mb-4 border rounded-md"
          />
          <button
            onClick={handleSubmitTicket}
            className={`${
              isEditing
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white px-4 py-2 rounded`}
          >
            {isEditing ? "Update Ticket" : "Add Ticket"}
          </button>
        </div>

        {/* Tickets List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Tickets</h2>
          {tickets.length === 0 ? (
            <p>No tickets available.</p>
          ) : (
            <ul>
              {tickets.map((ticket) => (
                <TicketItem
                  key={ticket.id}
                  ticket={ticket}
                  onEdit={handleEditTicket}
                  onDelete={handleDeleteTicket}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
