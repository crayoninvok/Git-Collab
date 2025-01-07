"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { Pagination, EffectCoverflow, Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import Swal from "sweetalert2";

const slides = [
  { src: "/entertaiment/ISMAYA.png", alt: "Ismaya logo", label: "Ismaya" },
  { src: "/entertaiment/PKENT.png", alt: "PK logo", label: "PK ENTERTAINMENT" },
  { src: "/entertaiment/AKSELERASI.png", alt: "Aksel logo", label: "AKSELERASI" },
  { src: "/entertaiment/IME.jpg", alt: "Ime logo", label: "IME KOREAN ENTERTAINMENT" },
];

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Promotor name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match!")
    .required("Confirm password is required"),
  agreeToTerms: Yup.boolean().oneOf([true], "You must agree to the terms"),
});

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export default function PromoterRegister() {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    values: RegisterFormValues,
    actions: FormikHelpers<RegisterFormValues>
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${base_url}/auth/promotorRegister`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Please check the username and email its has been used");

      Swal.fire({
        title: "Success!",
        text: "Welcome to TIKO! Please check your email for verification.",
        icon: "success",
        confirmButtonText: "Great!",
      });
      actions.resetForm();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
        console.log(errorMessage);
        
      Swal.fire({
        title: "Error!",
        text: "Please check the username and password its has been used",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Registration failed:", err);
    } finally {
      setIsLoading(false);
      actions.setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/concert1.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 flex flex-col items-center lg:items-start justify-center w-full lg:w-1/2 p-6 lg:p-20 text-center lg:text-left">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Register to be an Event Creator here With
          <span className="text-orange-400"> TIKO</span>
        </h2>
        <p className="text-gray-200 text-sm md:text-base mb-5">
          Discover the best events in town and get exclusive access to tickets and updates!
        </p>
      </div>

      <div className="relative z-10 bg-transparent shadow-xl rounded-xl flex flex-col lg:flex-row w-full max-w-6xl overflow-hidden lg:h-[65vh]">
        <div className="hidden md:flex w-full lg:w-1/2 bg-gradient-to-r from-orange-400 to-black/80 backdrop-blur-lg items-center justify-center text-white p-6 lg:p-10">
          <Swiper
            modules={[Pagination, EffectCoverflow, Autoplay]}
            pagination={{ clickable: true }}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            className="w-full h-full"
          >
            {slides.map((slide, index) => (
              <SwiperSlide
                key={index}
                className="flex flex-col justify-center items-center"
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  width={500}
                  height={500}
                  className="rounded-lg"
                />
                <h2 className="absolute bottom-10 text-5xl font-bold text-white">
                  {slide.label}
                </h2>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="flex flex-col justify-center w-full lg:w-1/2 bg-gradient-to-r from-black/80 to-black/50 backdrop-blur-lg p-6 lg:p-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            Create a Promotor Account
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Already have an account?{" "}
            <Link
              href="/login/loginpromotor"
              className="text-orange-500 hover:underline"
            >
              Log in
            </Link>
          </p>

          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
              agreeToTerms: false,
            }}
            validationSchema={RegisterSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Promotor Name"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <Field
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Field
                    type="checkbox"
                    name="agreeToTerms"
                    className="form-checkbox h-5 w-5 text-orange-500"
                  />
                  <span className="text-gray-400">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-orange-500 hover:underline"
                    >
                      Terms & Conditions
                    </Link>
                  </span>
                </div>
                <ErrorMessage
                  name="agreeToTerms"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-md transition"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting || isLoading ? "Creating account..." : "Create account"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
