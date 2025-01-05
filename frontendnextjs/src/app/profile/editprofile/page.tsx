"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useSession } from "@/context/useSessionHook";

export default function EditProfilePage() {
  const router = useRouter();
  const { user } = useSession();
  const [formData, setFormData] = useState({
    email: user?.email || "",
    password: "",
  });
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedAvatar(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      Swal.fire({
        title: "Error!",
        text: "Email and Password are required.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const body = new FormData();
      body.append("email", formData.email);
      body.append("password", formData.password);
      if (selectedAvatar) body.append("avatar", selectedAvatar);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_BE}/users/update`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      if (response.ok) {
        Swal.fire({
          title: "Success!",
          text: "Profile updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => router.push("/profile"));
      } else {
        throw new Error(`Failed to update profile. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Update Error:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update profile. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-100 px-6">
      <div className="bg-gray-800/90 backdrop-blur-md p-8 rounded-lg shadow-2xl w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-100">
          Edit Profile
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Placeholder */}
          <div className="text-center">
            {selectedAvatar ? (
              <img
                src={URL.createObjectURL(selectedAvatar)}
                alt="Selected Avatar"
                className="w-24 h-24 rounded-full mx-auto border-4 border-orange-500 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 mx-auto rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20v-6M6 20v-4m6-12a6 6 0 016 6v3.75a9.74 9.74 0 01-6 1.94m0 0A9.74 9.74 0 016 13.75V10a6 6 0 016-6z" />
                </svg>
              </div>
            )}
            <label
              htmlFor="avatar"
              className="inline-block mt-4 text-orange-500 font-semibold cursor-pointer hover:text-orange-600"
            >
              Change Avatar
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
            {selectedAvatar && (
              <p className="text-sm text-gray-400 mt-2">
                Selected: {selectedAvatar.name}
              </p>
            )}
          </div>

          {/* Username (Read-Only) */}
          <div>
            <label htmlFor="username" className="block text-sm text-gray-400">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={user?.username || ""}
              readOnly
              className="w-full mt-2 px-4 py-2 rounded-lg bg-gray-700 text-gray-400 border border-gray-600"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm text-gray-400">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full mt-2 px-4 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm text-gray-400">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full mt-2 px-4 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 rounded-lg font-semibold text-gray-100 ${
              isSubmitting
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {isSubmitting ? "Updating..." : "Update Profile"}
          </button>
        </form>

        <button
          onClick={() => router.push("/profile")}
          className="mt-4 w-full text-center text-sm text-gray-400 hover:text-orange-500"
        >
          Back to Profile
        </button>
      </div>
    </div>
  );
}
