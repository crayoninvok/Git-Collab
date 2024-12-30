"use client";

import AdminSidebar from "@/components/adminSidebarDashboard";
import { useSession } from "@/context/useSessionHook";
import { useEffect, useRef, useState } from "react";
import { formatDate } from "@/helpers/formatDate";
import { useRouter } from "next/navigation";
import { dummyDataForPromotor } from "@/components/dummydata/dummyDataPromotor";
import Swal from "sweetalert2";

export default function AdminProfile() {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;
  const { promotor, checkSession, logout } = useSession();
  const [lastLogin, setLastLogin] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  // Ganti Avatar
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      console.log("Uploading file...");
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      if (tokenPayload.exp * 1000 < Date.now())
        throw new Error("Token expired");

      const response = await fetch(`${base_url}/promotors/avatar-cloud`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        // credentials: "include", buat kukis takutnya mau ganti lagi
      });

      console.log("Response Status:", response.status);

      if (response.status >= 200 && response.status < 300) {
        Swal.fire({
          title: "Success!",
          text: "Your profile picture has been updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => window.location.reload());
      } else {
        console.error("Unexpected response status:", response.status);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong while updating your profile. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
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
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // Login nemu dari konsulting mas mas chatGPT
  useEffect(() => {
    const fetchData = async () => {
      try {
        await checkSession();
        const now = new Date();
        const formattedNow = now.toISOString();
        localStorage.setItem("lastLogin", formattedNow);
        setLastLogin(formatDate(now));
      } catch (err) {
        console.error("Failed to fetch promotor session or last login:", err);
      }
    };

    fetchData();
  }, []);

  if (!promotor) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">
        <h1 className="text-3xl font-bold">No Promotor Data Found</h1>
      </div>
    );
  }

  const { name, email, avatar } = promotor;

  // Modal usaha 2 miliar
  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  // Modal nya bangkrut
  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <AdminSidebar />
        <div className="flex-1 px-6 py-6">
          <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold mb-4 text-center">
              Admin Profile
            </h1>

            <div className="flex items-center lg:gap-8 justify-center">
              {/* Profile Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={avatar || "https://via.placeholder.com/150"}
                  alt="Admin Avatar"
                  className="w-[20vw] h-60 rounded-lg border-2 border-glow shadow-lg cursor-pointer"
                  onClick={() =>
                    openModal(avatar || "https://via.placeholder.com/150")
                  }
                />
              </div>

              {/* Input foto */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Profil */}
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

            {/*  Buttons */}
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
          <div className="rounded-lg bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 mt-5 p-6">
            <h1 className="text-2xl font-bold text-white mb-4">Your Events</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dummyDataForPromotor.map((event) => (
                <div
                  key={event.id}
                  className="p-4 bg-gradient-to-tl from-gray-800 to-gray-700 rounded-lg shadow-lg hover:scale-105 transition-transform"
                >
                  <img
                    src={event.bannerImage}
                    alt={event.title}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                  <h2 className="text-sm font-bold text-gray-300">
                    Category: {event.category}
                  </h2>
                  <h2 className="text-xl font-bold text-white">
                    {event.title}
                  </h2>
                  <p className="text-gray-400 text-sm">{event.description}</p>
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
                    {event.ticketSold}
                  </p>
                  <p className="text-orange-500 font-bold">
                    Revenue:{" "}
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(event.totalRevenue)}
                  </p>
                  <p className="text-green-500 font-bold">
                    Profit: {event.profit}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal gambar ajah */}
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
