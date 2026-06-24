"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { getCourseById, isUserEnrolled } from "@/lib/courses";
import { getCurrentUser } from "@/lib/supabase-client";
import { createCheckoutSession } from "@/lib/stripe";
import type { Course } from "@/lib/courses";
import type { User } from "@/lib/supabase-client";

export default function CoursePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const id = params["id"] as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingout, setIsCheckingout] = useState(false);

  // Handle Stripe success redirect
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setIsEnrolled(true);
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadData() {
      const [courseData, userData] = await Promise.all([
        getCourseById(id),
        getCurrentUser(),
      ]);

      setCourse(courseData);
      setUser(userData);

      if (userData && courseData) {
        const enrolled = await isUserEnrolled(userData.id, courseData.id);
        setIsEnrolled(enrolled);
      }

      setIsLoading(false);
    }

    loadData();
  }, [id]);

  const handleEnroll = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (!course) return;

    setIsCheckingout(true);

    const successUrl = `${window.location.origin}/course/${course.id}?success=true`;
    const cancelUrl = `${window.location.origin}/course/${course.id}?canceled=true`;

    const { url, error } = await createCheckoutSession(
      user.id,
      course.id,
      course.title,
      course.price_cents,
      successUrl,
      cancelUrl
    );

    if (error) {
      alert(`Error: ${error}`);
      setIsCheckingout(false);
      return;
    }

    if (url) {
      window.location.href = url;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <p className="text-slate-400">Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
          <nav className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-2xl font-bold text-white">
              CourseHub
            </Link>
          </nav>
        </header>
        <main className="mx-auto max-w-2xl px-4 py-12">
          <p className="text-slate-400">Course not found</p>
          <Link href="/" className="text-blue-400 hover:text-blue-300 mt-4 block">
            Back to courses
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <nav className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-2xl font-bold text-white">
            CourseHub
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300 mb-4 block">
            ← Back to courses
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2">
            {/* Video preview */}
            <div className="rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 aspect-video flex items-center justify-center mb-8">
              <div className="text-center">
                <p className="text-6xl text-white mb-4">▶</p>
                <p className="text-white text-lg">Video Preview</p>
                <p className="text-slate-200 text-sm mt-2">
                  Enroll to watch full course
                </p>
              </div>
            </div>

            {/* Course info */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-slate-300 mb-6">
                {course.description}
              </p>

              <div className="grid grid-cols-2 gap-4 text-slate-300">
                <div>
                  <p className="text-sm text-slate-400">Videos</p>
                  <p className="text-2xl font-bold text-white">
                    {course.video_count}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Enrolled</p>
                  <p className="text-2xl font-bold text-white">
                    {course.enrolled_count}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 sticky top-4">
              <div className="mb-6">
                <p className="text-slate-400 text-sm mb-2">Course Price</p>
                <p className="text-4xl font-bold text-white">
                  ${(course.price_cents / 100).toFixed(2)}
                </p>
              </div>

              {isEnrolled ? (
                <div className="space-y-4">
                  <div className="bg-green-900/30 border border-green-700 rounded p-3">
                    <p className="text-green-400 font-semibold">
                      ✓ Access Granted
                    </p>
                    <p className="text-green-300 text-sm mt-1">
                      You&apos;re enrolled in this course
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      // TODO: Implement video player redirect
                      alert("Video player coming soon!");
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded transition"
                  >
                    Watch Course
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={isCheckingout}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded transition"
                >
                  {isCheckingout ? "Redirecting to payment..." : "Enroll Now"}
                </button>
              )}

              {!user && !isEnrolled && (
                <p className="text-slate-400 text-xs mt-4">
                  <Link href="/auth/login" className="text-blue-400 hover:text-blue-300">
                    Sign in
                  </Link>{" "}
                  to enroll
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-700 bg-slate-900 py-8 mt-20">
        <div className="mx-auto max-w-6xl px-4 text-center text-slate-400">
          <p>&copy; 2025 CourseHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
