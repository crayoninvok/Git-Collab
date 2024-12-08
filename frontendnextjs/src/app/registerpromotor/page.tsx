"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { Pagination, EffectCoverflow, Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function PromoterRegister() {
  const slides = [
    { src: "/entertaiment/ISMAYA.png", alt: "Ismaya logo", label: "Ismaya" },
    {
      src: "/entertaiment/PKENT.png",
      alt: "PK logo",
      label: "PK ENTERTAIMENT",
    },
    {
      src: "/entertaiment/AKSELERASI.png",
      alt: "Aksel logo",
      label: "AKSELERASI",
    },
    {
      src: "/entertaiment/IME.jpg",
      alt: "Ime logo",
      label: "IME KOREAN ENTERTAIMENT",
    },
  ];

  // Yup Validation Schema
  const validationSchema = Yup.object({
    promotorName: Yup.string().required("Promotor name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    agreeToTerms: Yup.boolean().oneOf([true], "You must agree to the terms"),
  });

  const handleSubmit = (values: any, { setSubmitting }: any) => {
    console.log("Form Data Submitted:", values);
    setTimeout(() => {
      setSubmitting(false);
    }, 2000);
  };

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/concert1.jpg')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Left Description Section */}
      <div className="relative z-10 flex flex-col items-center lg:items-start justify-center w-full lg:w-1/2 p-6 lg:p-20 text-center lg:text-left">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Find Amazing Events Happening With
          <span className="text-orange-400"> TIKO</span>
        </h2>
        <p className="text-gray-200 text-sm md:text-base mb-5">
          Discover the best events in town and get exclusive access to tickets
          and updates!
        </p>
      </div>

      {/* Right Form Section */}
      <div className="relative z-10 bg-transparent shadow-xl rounded-xl flex flex-col lg:flex-row w-full max-w-6xl overflow-hidden lg:h-[65vh]">
        {/* Left Swiper Section */}
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

        {/* Right Form Section */}
        <div className="flex flex-col justify-center w-full lg:w-1/2 bg-gradient-to-r from-black/80 to-black/50 backdrop-blur-lg p-6 lg:p-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            Create a Promotor Account
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Already have an account?{" "}
            <Link href="/loginpromotor" className="text-orange-500 hover:underline">
              Log in
            </Link>
          </p>

          <Formik
            initialValues={{
              promotorName: "",
              email: "",
              password: "",
              agreeToTerms: false,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <Field
                    type="text"
                    name="promotorName"
                    placeholder="Promotor Name"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-md"
                  />
                  <ErrorMessage
                    name="promotorName"
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating account..." : "Create account"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
