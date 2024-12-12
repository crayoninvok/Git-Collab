"use client";

import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import AdminSidebar from "@/components/AdminSidebar";

const AdminProfileSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  avatar: Yup.string().url("Invalid URL"),
});

interface AdminProfile {
  name: string;
  email: string;
  avatar: string;
}

export default function AdminProfile() {
  const [profile, setProfile] = useState<AdminProfile>({
    name: "John Doe",
    email: "admin@example.com",
    avatar: "https://via.placeholder.com/150",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpdate = async (values: AdminProfile) => {
    try {
      // Simulate an API call
      const response = await fetch("http://localhost:8000/api/admin/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      setProfile(values);
      setMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <AdminSidebar />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-xl">
          <h1 className="text-3xl font-bold mb-4 text-center">Admin Profile</h1>

          {message && (
            <div
              className={`text-center py-2 px-4 rounded mb-4 ${
                message.includes("success") ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {message}
            </div>
          )}

          <Formik
            initialValues={profile}
            validationSchema={AdminProfileSchema}
            onSubmit={handleUpdate}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Field
                    name="name"
                    type="text"
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 rounded-md bg-gray-700 text-white border ${
                      isEditing
                        ? "border-gray-500"
                        : "border-gray-600 cursor-not-allowed"
                    }`}
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-400 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Field
                    name="email"
                    type="email"
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 rounded-md bg-gray-700 text-white border ${
                      isEditing
                        ? "border-gray-500"
                        : "border-gray-600 cursor-not-allowed"
                    }`}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-400 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Avatar URL
                  </label>
                  <Field
                    name="avatar"
                    type="text"
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 rounded-md bg-gray-700 text-white border ${
                      isEditing
                        ? "border-gray-500"
                        : "border-gray-600 cursor-not-allowed"
                    }`}
                  />
                  <ErrorMessage
                    name="avatar"
                    component="div"
                    className="text-red-400 text-sm mt-1"
                  />
                </div>

                <div className="flex items-center justify-between mt-4">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md ${
                        isSubmitting ? "cursor-not-allowed bg-green-400" : ""
                      }`}
                    >
                      {isSubmitting ? "Updating..." : "Save Changes"}
                    </button>
                  )}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </Form>
            )}
          </Formik>

          <div className="mt-6 text-center">
            <img
              src={profile.avatar}
              alt="Admin Avatar"
              className="w-24 h-24 mx-auto rounded-full border-4 border-gray-600"
            />
            <p className="text-sm text-gray-400 mt-2">
              {profile.name} - {profile.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
