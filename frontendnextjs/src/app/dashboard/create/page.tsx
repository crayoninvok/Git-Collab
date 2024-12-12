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
  const [formTicket, setFormTicket] = useState<Ticket>({
    id: 0,
    title: "",
    description: "",
    status: "Open",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmitTicket = () => {
    if (!formTicket.title || !formTicket.description) {
      alert("Please fill in all fields");
      return;
    }

    if (isEditing) {
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
      const newTicket: Ticket = {
        id: Date.now(),
        title: formTicket.title,
        description: formTicket.description,
        status: formTicket.status as "Open" | "In Progress" | "Closed",
      };
      setTickets([...tickets, newTicket]);
    }

    setFormTicket({ id: 0, title: "", description: "", status: "Open" });
  };

  const handleEditTicket = (ticket: Ticket) => {
    setFormTicket(ticket);
    setIsEditing(true);
  };

  const handleDeleteTicket = (id: number) => {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== id));
  };

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

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-auto bg-gray-900 text-white">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 w-auto bg-gray-100">
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
            className="w-full p-3 mb-4 border rounded-md focus:ring focus:ring-blue-300"
          />
          <textarea
            placeholder="Description"
            value={formTicket.description}
            onChange={(e) =>
              setFormTicket({ ...formTicket, description: e.target.value })
            }
            className="w-full p-3 mb-4 border rounded-md focus:ring focus:ring-blue-300"
          />
          <select
            value={formTicket.status}
            onChange={(e) =>
              setFormTicket({
                ...formTicket,
                status: e.target.value as "Open" | "In Progress" | "Closed",
              })
            }
            className="w-full p-3 mb-4 border rounded-md focus:ring focus:ring-blue-300"
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
          <div className="flex space-x-4">
            <button
              onClick={handleSubmitTicket}
              className={`${
                isEditing
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white px-4 py-2 rounded-md transition`}
            >
              {isEditing ? "Update Ticket" : "Add Ticket"}
            </button>
            {isEditing && (
              <button
                onClick={() => {
                  setFormTicket({ id: 0, title: "", description: "", status: "Open" });
                  setIsEditing(false);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Tickets</h2>
          {tickets.length === 0 ? (
            <p className="text-gray-600">No tickets available.</p>
          ) : (
            <ul className="space-y-4">
              {tickets.map((ticket) => (
                <li
                  key={ticket.id}
                  className="border-b last:border-b-0 py-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-bold">{ticket.title}</h3>
                    <p className="text-sm text-gray-600">
                      {ticket.description}
                    </p>
                    <p
                      className={`text-sm font-semibold ${statusColor(
                        ticket.status
                      )}`}
                    >
                      {ticket.status}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEditTicket(ticket)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTicket(ticket.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
