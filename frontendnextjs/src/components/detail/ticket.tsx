// components/detail/ticket.tsx
import { useState } from "react";
import { Ticket } from "../../types/event";
import { formatPrice } from "@/helpers/formatPrice";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface EventTicketsProps {
  tickets: Ticket[];
  eventId: number;
}

export default function EventTickets({ tickets, eventId }: EventTicketsProps) {
  const router = useRouter();
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const MAX_TICKETS = 4;

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);

  const handleQuantityChange = (change: number) => {
    if (!selectedTicket) return;
    
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= Math.min(selectedTicket.quantity, MAX_TICKETS)) {
      setQuantity(newQuantity);
    }
  };

  const handleBuyTickets = async () => {
    if (!selectedTicket) return;

    try {
      // Session check using your existing auth endpoint
      const session = await axios.get('http://localhost:8000/api/auth/session', {
        withCredentials: true
      });

      if (!session.data) {
        sessionStorage.setItem('pendingPurchase', JSON.stringify({
          eventId,
          ticketId: selectedTicketId,
          quantity
        }));
        router.push('/login');
        return;
      }

      if (session.data.type !== 'user') {
        alert('Only registered users can purchase tickets');
        return;
      }

      // Load Midtrans script dynamically
      const script = document.createElement('script');
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!);
      document.head.appendChild(script);

      script.onload = async () => {
        try {
          const response = await axios.post(
            'http://localhost:8000/api/payment/token',
            {
              eventId,
              ticketId: selectedTicketId,
              quantity,
              totalPrice: selectedTicket.price * quantity
            },
            {
              withCredentials: true
            }
          );

          // @ts-ignore
          window.snap.pay(response.data.token, {
            onSuccess: async (result: any) => {
              await axios.post(
                'http://localhost:8000/api/payment/success',
                {
                  orderId: result.order_id,
                  paymentId: result.transaction_id
                },
                {
                  withCredentials: true
                }
              );
              router.push('/orders');
            },
            onPending: () => {
              router.push('/orders');
            },
            onError: () => {
              alert('Payment failed. Please try again.');
            },
            onClose: () => {
              // Handle when customer closes the popup
            }
          });
        } catch (error) {
          console.error('Payment token error:', error);
          alert('Failed to initiate payment. Please try again.');
        }
      };

      script.onerror = () => {
        alert('Failed to load payment system. Please try again.');
      };

    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to process payment. Please try again.');
    }
  };

  const total = selectedTicket ? selectedTicket.price * quantity : 0;

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
                  disabled={quantity >= Math.min(selectedTicket.quantity, MAX_TICKETS)}
                  className="p-1 rounded-full hover:bg-zinc-700 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
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