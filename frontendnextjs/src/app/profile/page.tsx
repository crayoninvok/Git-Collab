// The imports and interfaces remain the same as in the original code
"use client";

import { useSession } from "@/context/useSessionHook";
import { formatPrice } from "@/helpers/formatPrice";
import { useEffect, useState } from "react";
import { FaStar, FaTicketAlt, FaUser } from "react-icons/fa";
import Swal from "sweetalert2";
import { RiDiscountPercentFill } from "react-icons/ri";
import { formatDate } from "@/helpers/formatDate";
import ReviewModal from "@/components/review/showReview";
import Link from "next/link";

interface UserTicket {
  id: number;
  eventId: number;
  event: {
    title: string;
    thumbnail: string;
    date: string;
    venue: string;
  };
  status: "PENDING" | "PAID" | "CANCELED";
  details: {
    tickets: {
      category: string;
      price: number;
    }[];
    quantity: number;
  }[];
  totalPrice: number;
  finalPrice: number;
  createdAt: string;
}

interface Review {
  id: number;
  userId: string;
}

export default function ProfilePage() {
  const { isAuth, type, user } = useSession();
  const [tickets, setTickets] = useState<UserTicket[]>([]);
  const [reviewedTickets, setReviewedTickets] = useState<{
    [key: number]: boolean;
  }>({});
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null);

  const background =
    "https://res.cloudinary.com/dxpeofir6/video/upload/v1734510609/Blue_Dark_Blue_Gradient_Color_and_Style_Video_Background_d9g5ts.mp4";
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(`${base_url}/orders/history/user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        // Filter only PAID tickets
        const paidTickets = data.orders.filter((ticket: UserTicket) => ticket.status === "PAID");
        setTickets(paidTickets);

        // Check for reviews for each paid ticket
        const reviewStatuses: { [key: number]: boolean } = {};
        await Promise.all(
          paidTickets.map(async (ticket: UserTicket) => {
            const reviewResponse = await fetch(
              `${base_url}/reviews/event/${ticket.eventId}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            const reviews = await reviewResponse.json();
            reviewStatuses[ticket.eventId] = reviews.some(
              (review: Review) => review.userId === user?.id
            );
          })
        );
        setReviewedTickets(reviewStatuses);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoadingTickets(false);
      }
    };

    if (isAuth && user) {
      fetchTickets();
    }
  }, [isAuth, user, base_url]);

  // Rest of the component functionality remains the same
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      Swal.fire({
        title: "Error!",
        text: "No file selected. Please choose a file to upload.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    try {
      setUploading(true);
      const response = await fetch(`${base_url}/users/avatar-cloud`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        Swal.fire({
          title: "Success!",
          text: "Your profile picture has been updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => window.location.reload());
      } else {
        throw new Error(`Failed to upload. Status: ${response.status}`);
      }
    } catch {
      Swal.fire({
        title: "Error!",
        text: "Failed to update your profile picture. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setUploading(false);
    }
  };

  const openModal = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  if (type !== "user") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  const filteredTickets = tickets.filter(
    (ticket) => !reviewedTickets[ticket.eventId]
  );

  return (
    <>
      <video
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
        src={background}
        autoPlay
        loop
        muted
      />

      <div className="min-h-screen py-10 mt-5 flex flex-col lg:flex-row px-6 relative">
        {/* Left Section - Tickets */}
        <div className="flex flex-col w-full lg:w-1/2 bg-black/50 bg-opacity-90 p-5 rounded-xl shadow-lg mt-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-100">
            Your Paid Tickets
          </h2>
          <div className="space-y-4">
            {loadingTickets ? (
              <div className="text-center text-white">Loading tickets...</div>
            ) : filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 bg-gray-700 rounded-lg shadow"
                >
                  <div className="flex flex-col md:flex-row items-center justify-between space-x-4">
                    <img
                      src={ticket.event.thumbnail || "/concert1.jpg"}
                      alt={`${ticket.event.title} Thumbnail`}
                      className="w-16 h-16 object-cover rounded-md cursor-pointer"
                      onClick={() =>
                        openModal(ticket.event.thumbnail || "/concert1.jpg")
                      }
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-white">
                        {ticket.event.title}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Date: {formatDate(ticket.event.date)}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Venue: {ticket.event.venue}
                      </p>
                      {ticket.details[0]?.tickets.map((t, index) => (
                        <p key={index} className="text-gray-400 text-sm">
                          {t.category}: {ticket.details[0].quantity}x
                        </p>
                      ))}
                      <p className="text-gray-400 text-sm">
                        Price: {formatPrice(ticket.finalPrice)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="mb-2 px-2 py-1 rounded text-xs bg-green-500 text-white">
                        {ticket.status}
                      </span>
                      <button
                        onClick={() => {
                          const eventDate = new Date(ticket.event.date);
                          const isFinished = eventDate < new Date();
                          if (!isFinished) {
                            Swal.fire({
                              title: "Cannot Review Yet",
                              text: "You can only review events after they have concluded.",
                              icon: "warning",
                              confirmButtonText: "OK",
                            });
                            return;
                          }
                          setSelectedTicket(ticket);
                          setReviewModalOpen(true);
                        }}
                        className="text-black bg-orange-500 hover:bg-orange-600 rounded-md px-4 py-2 transition-colors"
                      >
                        Rate Us
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400">
                No paid tickets available for review.
              </div>
            )}
          </div>
        </div>

        {/* Right Section - User Profile */}
        <div className="flex flex-col w-full lg:w-1/2 bg-black/50 bg-opacity-90 p-8 lg:ml-8 rounded-xl shadow-lg mt-10">
          <div className="flex flex-col items-center w-full mb-8">
            <img
              src={user?.avatar || "https://via.placeholder.com/150"}
              alt="User Avatar"
              className="w-24 h-24 rounded-full border-4 border-orange-500 shadow-md mb-4 cursor-pointer"
              onClick={() =>
                openModal(user?.avatar || "https://via.placeholder.com/150")
              }
            />
            <label className="text-white text-[10px] bg-slate-500 p-1 rounded-3xl hover:bg-yellow-500 hover:text-orange-600 cursor-pointer">
              {uploading ? "Uploading..." : "Change profile picture"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
            <Link href={"/profile/editprofile"}>
              <button className="p-1 mt-3 text-white bg-slate-800 rounded-xl hover:bg-yellow-500 hover:text-orange-600">
                Edit Profile
              </button>
            </Link>
            <h2 className="text-2xl font-bold text-white mt-4">
              {user?.username || "Guest"}
            </h2>
            <p className="text-sm text-gray-400">
              {user?.email || "No Email Available"}
            </p>
          </div>

          {/* User Info */}
          <div className="space-y-6 bg-gray-900 bg-opacity-30 rounded-lg p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <FaUser className="text-yellow-700 text-3xl mr-3" />
                <p className="text-gray-400">Your ID:</p>
              </div>
              <p className="font-semibold text-white">{user?.id || "N/A"}</p>
            </div>

            <div className="flex items-center justify-between bg-yellow-400 rounded-lg p-4 shadow-lg">
              <div className="flex items-center">
                <FaTicketAlt className="text-yellow-700 text-3xl mr-3" />
                <div>
                  <p className="text-gray-800 font-semibold">Your Ref Code:</p>
                  <p className="text-gray-600 text-lg font-bold">
                    {user?.refCode || "No coupon available"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-green-500 rounded-lg p-4 shadow-lg">
              <div className="flex items-center">
                <FaStar className="text-white text-3xl mr-3" />
                <div>
                  <p className="text-white font-semibold">Your Points:</p>
                  <p className="text-white text-lg font-bold">
                    {user?.points !== undefined
                      ? `${formatPrice(user.points)} pts`
                      : "No points"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-blue-500 rounded-lg p-4 shadow-lg">
              <div className="flex items-center">
                <RiDiscountPercentFill className="text-white text-3xl mr-3" />
                {user?.percentage ? (
                  <div className="flex flex-col">
                    <p className="text-white font-semibold">Your Coupon:</p>
                    <p className="text-white text-lg font-bold">
                      {`${user.percentage}% off`}
                    </p>
                  </div>
                ) : (
                  <p className="text-white font-semibold">
                    You have no coupon yet.
                  </p>
                )}
              </div>
              {user?.percentage && (
                <div className="flex text-end space-x-3">
                  <p className="text-white">Expired At:</p>
                  <p className="text-white">{formatDate(user.expiredAt)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative">
            <img
              src={selectedImage!}
              alt="Full View"
              className="max-w-full max-h-screen rounded-lg"
            />
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-3xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedTicket && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedTicket(null);
          }}
          eventId={selectedTicket.eventId}
          userId={user?.id || ""}
          isEventFinished={new Date(selectedTicket.event.date) < new Date()}
        />
      )}
    </>
  );
}
