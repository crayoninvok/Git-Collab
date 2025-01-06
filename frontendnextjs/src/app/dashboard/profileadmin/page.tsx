"use client";

import AdminSidebar from "@/components/adminSidebarDashboard";
import { useSession } from "@/context/useSessionHook";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Event } from "@/types/event";

export default function AdminProfile() {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;
  const { promotor, logout } = useSession();
  const [lastLogin] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(6); 
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Logout
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        router.push("/login/loginpromotor");
      }
    });
  };

  // Fetch Promotor Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch(
          `${base_url}/dashboard/promotor/detailEventDashboard`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();

        setEvents(data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch events. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [base_url]);

  // Pagination Controls
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / eventsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Avatar Update
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(`${base_url}/promotors/avatar-cloud`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.status >= 200 && response.status < 300) {
        Swal.fire({
          title: "Success!",
          text: "Your profile picture has been updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => window.location.reload());
      } else {
        Swal.fire({
          title: "Error!",
          text: "Something went wrong while updating your profile. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err:unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
        console.log(errorMessage);
      Swal.fire({
        title: "Error!",
        text: "Failed to update your profile picture. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (!promotor) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">
        <h1 className="text-3xl font-bold">No Promotor Data Found</h1>
      </div>
    );
  }

  const { name, email, avatar } = promotor;

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-br bg-black text-white">
        <AdminSidebar />
        <div className="flex-1 px-6 py-6">
          <div className="bg-gradient-to-b from-gray-900 via-black to-gray-900 rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold mb-4 text-center">
              Admin Profile
            </h1>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8">
              <div className="flex-shrink-0">
                <img
                  src={avatar || "https://via.placeholder.com/150"}
                  alt="Admin Avatar"
                  className="w-[50vw] md:w-full h-60 rounded-lg border-2 border-glow shadow-lg cursor-pointer"
                  onClick={() =>
                    openModal(avatar || "https://via.placeholder.com/150")
                  }
                />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="mt-4 lg:mt-0 flex-col items-center">
                <div className="mb-4 text-center">
                  <h2 className="text-xl font-semibold text-gray-100">
                    Promotor Name
                  </h2>
                  <p className="text-gray-300">{name || "Not Available"}</p>
                </div>
                <div className="mb-4 text-center">
                  <h2 className="text-xl font-semibold text-gray-100">Email</h2>
                  <p className="text-gray-300">{email || "Not Available"}</p>
                </div>
                <div className="mb-4 text-center">
                  <h2 className="text-xl font-semibold text-gray-100">
                    Last Login
                  </h2>
                  <p className="text-gray-300">
                    {lastLogin || "Not Available"}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center space-x-4">
              <button
                onClick={triggerFileInput}
                disabled={isLoading}
                className={`px-4 py-2 rounded-md text-white font-semibold ${
                  isLoading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
                aria-label="Edit Photos"
              >
                {isLoading ? "Uploading..." : "Edit Photos"}
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white font-semibold"
                aria-label="Logout"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="rounded-lg bg-gradient-to-b from-gray-900 via-black to-gray-900 mt-5 p-6">
            <h1 className="text-2xl font-bold text-white mb-4">Your Events</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 bg-gradient-to-tl from-gray-800 to-gray-700 rounded-lg shadow-lg hover:scale-105 transition-transform"
                >
                  <img
                    src={event.thumbnail}
                    alt={event.title}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                  <h2 className="text-sm font-bold text-gray-300">
                    Category: {event.category}
                  </h2>
                  <h2 className="text-xl font-bold text-white">
                    {event.title}
                  </h2>

                  <p className="text-gray-400 mt-2">
                    <span className="font-bold">Date:</span>{" "}
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-400">
                    <span className="font-bold">Location:</span>{" "}
                    {event.location}
                  </p>
                  <p className="text-gray-400">
                    <span className="font-bold">Tickets Sold:</span>{" "}
                    {event.ticketsSold}
                  </p>
                  <p className="text-orange-500 font-bold">
                    Revenue: {event.revenue}
                  </p>
                  <p className="text-green-500 font-bold">
                    Profit: {event.profitPercentage}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-2 mt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  >
                    {number}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

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
    </>
  );
}
