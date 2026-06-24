"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, signOut } from "@/lib/supabase-client";
import { getUserCourses, getCreatorRevenue } from "@/lib/courses";
import type { User } from "@/lib/supabase-client";
import type { Course } from "@/lib/courses";

export default function CreatorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [revenue, setRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const userData = await getCurrentUser();

      if (!userData) {
        router.push("/auth/login");
        return;
      }

      setUser(userData);

      const [coursesData, revenueData] = await Promise.all([
        getUserCourses(userData.id),
        getCreatorRevenue(userData.id),
      ]);

      setCourses(coursesData);
      setRevenue(revenueData);
      setIsLoading(false);
    }

    loadData();
  }, [router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <p className="text-slate-400">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <nav className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              CourseHub
            </Link>
            <div className="space-x-4">
              <Link
                href="/"
                className="text-slate-300 hover:text-white transition"
              >
                Browse Courses
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded bg-slate-700 text-white hover:bg-slate-600 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Welcome section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Creator Dashboard
          </h1>
          <p className="text-xl text-slate-300">
            Welcome back, {user?.email || "Creator"}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
            <p className="text-slate-400 text-sm mb-2">Total Courses</p>
            <p className="text-4xl font-bold text-white">{courses.length}</p>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
            <p className="text-slate-400 text-sm mb-2">Total Students</p>
            <p className="text-4xl font-bold text-white">
              {courses.reduce((sum, course) => sum + course.enrolled_count, 0)}
            </p>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
            <p className="text-slate-400 text-sm mb-2">Total Revenue</p>
            <p className="text-4xl font-bold text-white">
              ${revenue.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Courses section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your Courses</h2>
            <button
              disabled
              className="px-4 py-2 rounded bg-blue-600 text-white opacity-50 cursor-not-allowed"
              title="Upload video feature coming in Week 2"
            >
                + Upload Video (Week 2)
            </button>
          </div>

          {courses.length === 0 ? (
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-12 text-center">
              <p className="text-slate-400 mb-4">No courses yet</p>
              <p className="text-slate-500 text-sm">
                Week 2: Upload your first course video
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/course/${course.id}`}
                  className="group"
                >
                  <div className="rounded-lg border border-slate-700 bg-slate-800 overflow-hidden hover:border-slate-500 transition">
                    <div className="h-40 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                      <div className="text-white text-center">
                        <p className="text-4xl">▶</p>
                        <p className="text-sm mt-2">Video Course</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-white text-lg mb-2">
                        {course.title}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>{course.video_count} videos</span>
                        <span>{course.enrolled_count} students</span>
                      </div>
                      <div className="mt-4 text-lg font-bold text-white">
                        ${(course.price_cents / 100).toFixed(2)} × {course.enrolled_count} ={" "}
                        ${((course.price_cents / 100) * course.enrolled_count).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
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
