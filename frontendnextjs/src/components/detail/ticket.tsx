import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Ticket } from '@/types/event';
import { formatPrice } from '@/helpers/formatPrice';
import { Minus, Plus } from 'lucide-react';

interface EventTicketsProps {
  tickets: Ticket[];
  eventId: number;
}

export default function EventTickets({ tickets, eventId }: EventTicketsProps) {
  const router = useRouter();
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);

  const handleQuantityChange = (change: number) => {
    if (!selectedTicket) return;
    
    const newQuantity = quantity + change;
    // Limit to maximum 4 tickets and available quantity
    const maxQuantity = Math.min(4, selectedTicket.quantity);
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const total = selectedTicket ? selectedTicket.price * quantity : 0;

  const handleBuyTickets = () => {
    if (!selectedTicket) return;

    // Prepare order details for payment page
    const orderDetails = {
      eventId,
      tickets: [{
        id: selectedTicket.id,
        category: selectedTicket.category,
        price: selectedTicket.price,
        quantity: quantity
      }],
      quantity: quantity,
      totalPrice: total
    };
    
    // Store order details in localStorage for payment page
    localStorage.setItem('pendingOrder', JSON.stringify(orderDetails));
    
    // Redirect to payment page
    router.push('/payment');
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
              <span className="text-gray-300">Quantity (Max 4)</span>
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
                  disabled={quantity >= Math.min(4, selectedTicket.quantity)}
                  className="p-1 rounded-full hover:bg-zinc-700 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            {quantity >= 4 && (
              <p className="text-xs text-orange-400 mt-2">
                Maximum 4 tickets per purchase
              </p>
            )}
          </div>

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