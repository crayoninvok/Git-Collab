"use client";
import { useState } from "react";
import { Ticket } from "@/types/event";
import { formatPrice } from "@/helpers/formatPrice";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface EventTicketsProps {
  tickets: Ticket[];
  isPurchased?: boolean;
}

export default function EventTickets({
  tickets,
  isPurchased,
}: EventTicketsProps) {
  const router = useRouter();
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string>("");

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);

  const handleQuantityChange = (change: number) => {
    if (!selectedTicket) return;

    const newQuantity = quantity + change;
    if (newQuantity > 4) {
      setError("Maximum 4 tickets allowed per purchase");
      return;
    }
    if (newQuantity >= 1 && newQuantity <= selectedTicket.quantity) {
      setQuantity(newQuantity);
      setError("");
    }
  };

  const total = selectedTicket ? selectedTicket.price * quantity : 0;

  const handleBuyTickets = () => {
    if (!selectedTicket) return;
    router.push(
      `/payment?ticketId=${selectedTicket.id}&quantity=${quantity}&total=${total}`
    );
  };

  return (
    <div className="rounded-xl bg-zinc-900 p-6 text-white">
      <h2 className="mb-4 text-xl font-bold">Select Tickets</h2>

      <div className={`space-y-3 ${selectedTicket ? "mb-6" : ""}`}>
        {tickets.map((ticket) => {
          const isSoldOut = ticket.quantity === 0;
          
          return (
            <div
              key={ticket.id}
              onClick={() => {
                if (isPurchased || isSoldOut) return;
                setSelectedTicketId(ticket.id);
                setQuantity(1);
                setError("");
              }}
              className={`rounded-lg p-4 transition-all ${
                isPurchased || isSoldOut
                  ? "cursor-not-allowed bg-zinc-800/50 border-2 border-transparent opacity-75"
                  : selectedTicketId === ticket.id
                  ? "bg-zinc-800 border-2 border-orange-500 cursor-pointer"
                  : "bg-zinc-800/50 border-2 border-transparent hover:bg-zinc-800 cursor-pointer"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{ticket.category}</h3>
                  {isSoldOut ? (
                    <p className="text-sm text-red-400 font-medium">Sold Out</p>
                  ) : (
                    <p className="text-sm text-gray-400">
                      {ticket.quantity} tickets left
                    </p>
                  )}
                </div>
                <span className="text-lg font-semibold text-orange-400">
                  {formatPrice(ticket.price)}
                </span>
              </div>
            </div>
          );
        })}
        {isPurchased && (
          <p className="text-sm text-center !mt-4">
            You have already purchased tickets for this event
          </p>
        )}
      </div>

      {selectedTicket && (
        <div className="space-y-4">
          <div className="rounded-lg bg-zinc-800 p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-1 rounded-full hover:bg-zinc-700 disabled:opacity-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={
                    quantity >= 4 || quantity >= selectedTicket.quantity
                  }
                  className="p-1 rounded-full hover:bg-zinc-700 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <div className="border-t border-zinc-800 pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">Total Price</span>
              <span className="text-xl font-bold text-orange-400">
                {formatPrice(total)}
              </span>
            </div>

            <button
              onClick={handleBuyTickets}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Buy Tickets
            </button>
          </div>
        </div>
      )}
    </div>
  );
}