import { useState } from "react";
import { Ticket } from "@/types/event";
import { formatPrice } from "@/helpers/formatPrice";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface EventTicketsProps {
  tickets: Ticket[];
}

export default function EventTickets({ tickets }: EventTicketsProps) {
  const router = useRouter();
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string>("");

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);

  const handleQuantityChange = (change: number) => {
    if (!selectedTicket) return;
    
    const newQuantity = quantity + change;
    // Check for max 4 tickets
    if (newQuantity > 4) {
      setError("Maximum 4 tickets allowed per purchase");
      return;
    }
    // Check against available quantity and minimum of 1
    if (newQuantity >= 1 && newQuantity <= selectedTicket.quantity) {
      setQuantity(newQuantity);
      setError("");
    }
  };

  const total = selectedTicket ? selectedTicket.price * quantity : 0;

  const handleBuyTickets = () => {
    if (!selectedTicket) return;

    // Navigate to payment page with selected ticket info
    router.push(`/payment?ticketId=${selectedTicket.id}&quantity=${quantity}&total=${total}`);
  };

  return (
    <div className="rounded-xl bg-zinc-900 p-6 text-white">
      <h2 className="mb-4 text-xl font-bold">Select Tickets</h2>
      
      <div className="space-y-3 mb-6">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => {
              setSelectedTicketId(ticket.id);
              setQuantity(1);
              setError("");
            }}
            className={`cursor-pointer rounded-lg p-4 transition-all ${
              selectedTicketId === ticket.id
                ? "bg-zinc-800 border-2 border-orange-500"
                : "bg-zinc-800/50 border-2 border-transparent hover:bg-zinc-800"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{ticket.category}</h3>
                <p className="text-sm text-gray-400">
                  {ticket.quantity} tickets left
                </p>
              </div>
              <span className="text-lg font-semibold text-orange-400">
                {formatPrice(ticket.price)}
              </span>
            </div>
          </div>
        ))}
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
                  disabled={quantity >= 4 || quantity >= selectedTicket.quantity}
                  className="p-1 rounded-full hover:bg-zinc-700 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm">
              {error}
            </div>
          )}

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