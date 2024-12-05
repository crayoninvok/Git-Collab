"use client";

import { useState } from "react";

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: "Open" | "In Progress" | "Closed";
}

export default function TicketingPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [newTicket, setNewTicket] = useState({ title: "", description: "" });
  const [editTicket, setEditTicket] = useState<Ticket | null>(null);

  // Handle new ticket submission
  const handleAddTicket = () => {
    if (!newTicket.title || !newTicket.description) {
      alert("Please fill in all fields");
      return;
    }

    const newEntry: Ticket = {
      id: tickets.length + 1,
      title: newTicket.title,
      description: newTicket.description,
      status: "Open",
    };

    setTickets([...tickets, newEntry]);
    setNewTicket({ title: "", description: "" });
  };

  // Handle delete ticket
  const handleDeleteTicket = (id: number) => {
    setTickets(tickets.filter((ticket) => ticket.id !== id));
  };

  // Handle edit ticket
  const handleEditTicket = (ticket: Ticket) => {
    setEditTicket(ticket);
  };

  // Handle update ticket
  const handleUpdateTicket = () => {
    if (!editTicket) return;

    setTickets(
      tickets.map((ticket) =>
        ticket.id === editTicket.id ? { ...editTicket } : ticket
      )
    );
    setEditTicket(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Ticketing System</h1>

      {/* Add Ticket Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Ticket</h2>
        <input
          type="text"
          placeholder="Title"
          value={newTicket.title}
          onChange={(e) =>
            setNewTicket({ ...newTicket, title: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded-md"
        />
        <textarea
          placeholder="Description"
          value={newTicket.description}
          onChange={(e) =>
            setNewTicket({ ...newTicket, description: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded-md"
        />
        <button
          onClick={handleAddTicket}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Ticket
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
              <li
                key={ticket.id}
                className="border-b last:border-b-0 py-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-bold">{ticket.title}</h3>
                  <p className="text-sm text-gray-600">{ticket.description}</p>
                  <p className="text-sm font-semibold text-blue-500">
                    {ticket.status}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditTicket(ticket)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTicket(ticket.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit Ticket Form */}
      {editTicket && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold mb-4">Edit Ticket</h2>
          <input
            type="text"
            value={editTicket.title}
            onChange={(e) =>
              setEditTicket({ ...editTicket, title: e.target.value })
            }
            className="w-full p-2 mb-4 border rounded-md"
          />
          <textarea
            value={editTicket.description}
            onChange={(e) =>
              setEditTicket({ ...editTicket, description: e.target.value })
            }
            className="w-full p-2 mb-4 border rounded-md"
          />
          <button
            onClick={handleUpdateTicket}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Update Ticket
          </button>
        </div>
      )}
    </div>
  );
}
