"use client";

import { useSession } from "@/context/useSession";
import { formatPrice } from "@/helpers/formatPrice";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProfilePage() {
  const { isAuth, type, user } = useSession(); // Access user session directly
  const [uploading, setUploading] = useState(false);

  const tickets = [
    {
      id: 1,
      logo: "/WTFLOGOPROFILE.png",
      eventName: "We The Fest",
      date: "2024-12-25",
      venue: "GBK Sport Complex Senayan",
      seat: "A12",
      price: 1000000,
      status: "ON-GOING",
    },
    {
      id: 2,
      logo: "/DWPLOGOPROFILE.png",
      eventName: "Djakarta Warehouse Project",
      venue: "GBK Sport Complex Senayan",
      date: "2024-12-30",
      seat: "B22",
      price: 1500000,
      status: "SUCCEED",
    },
    {
      id: 3,
      logo: "/AM.png",
      eventName: "Arctic Monkeys World Tour",
      date: "2024-12-30",
      venue: "Jakarta International Expo",
      seat: "B22",
      price: 960000,
      status: "SUCCEED",
    },
    {
      id: 4,
      logo: "/CAS.png",
      eventName: "Cigarette After Sex Tour",
      date: "2024-12-30",
      venue: "GBK Sport Complex Senayan",
      seat: "B22",
      price: 950000,
      status: "SUCCEED",
    },
  ];

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await fetch(
        "http://localhost:8000/api/users/avatar-cloud",
        {
          method: "PATCH",
          body: formData,
          credentials: "include", // Include authentication cookies
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload avatar");
      }

      const data = await response.json();

      if (data.avatar) {
        toast.success("Your profile picture has been updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });

        // Reload the page to fetch the updated user information
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error(
        "Failed to update your profile picture. Please try again later.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } finally {
      setUploading(false);
    }
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

  return (
    <>
      <ToastContainer />
      <div
        className="min-h-screen flex flex-col lg:flex-row py-10 px-6"
        style={{
          backgroundImage: "url('/stage.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "filter 0.3s ease",
        }}
      >
        {/* Left Column: Ticket List */}
        <div className="flex flex-col w-full lg:w-1/2 bg-gray-800 bg-opacity-90 p-8 rounded-xl shadow-lg mt-[9vh]">
          <h2 className="text-2xl font-bold mb-6 text-gray-100">
            Your Tickets
          </h2>
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="p-4 bg-gray-700 rounded-lg shadow">
                <div className="flex items-center justify-between space-x-4">
                  {/* Logo */}
                  <img
                    src={ticket.logo}
                    alt={`${ticket.eventName} Logo`}
                    className="w-16 h-16 rounded-md"
                  />

                  {/* Event Details */}
                  <div className="flex-1">
                    <p className="font-semibold text-white">{ticket.eventName}</p>
                    <p className="text-gray-400 text-sm">Date: {ticket.date}</p>
                    <p className="text-gray-400 text-sm">Venue: {ticket.venue}</p>
                    <p className="text-gray-400 text-sm">Seat: {ticket.seat}</p>
                    <p className="text-gray-400 text-sm">
                      Price: {formatPrice(ticket.price)}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="flex flex-col items-end">
                    <p className="text-white mb-2">{ticket.status}</p>
                    <button className="text-black bg-orange-500 hover:bg-orange-600 rounded-md px-4 py-2">
                      Look
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Profile */}
        <div className="flex flex-col w-full lg:w-1/2 bg-gray-800 bg-opacity-90 p-8 lg:ml-8 rounded-xl shadow-lg mt-[9vh]">
          <div className="flex flex-col items-center w-full mb-8">
            <img
              src={user?.avatar || "https://via.placeholder.com/150"}
              alt="User Avatar"
              className="w-24 h-24 rounded-full border-4 border-green-500 shadow-md mb-4"
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
            <h2 className="text-2xl font-bold text-white mt-10">
              {user?.username || "Guest"}
            </h2>
            <p className="text-sm text-gray-400">
              {user?.email || "No Email Available"}
            </p>
          </div>

          <div className="space-y-6 bg-gray-900 bg-opacity-30 rounded-lg p-6">
            <div className="flex justify-between items-center">
              <p className="text-gray-400">User ID:</p>
              <p className="font-semibold text-white">{user?.id}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-400">Your RefCode:</p>
              <p className="font-semibold text-white">{user?.refCode}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-400">Your Points:</p>
              <div className="inline-block px-4 py-2 bg-gray-800 text-orange-500 font-bold rounded-lg border border-orange-500">
                {user?.points !== undefined
                  ? `${user.points} pts`
                  : "No points available"}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-400">Your Coupon:</p>
              <p className="font-semibold text-white">
                {user?.percentage !== undefined
                  ? `${user.percentage} %`
                  : "You don’t have any coupon"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
