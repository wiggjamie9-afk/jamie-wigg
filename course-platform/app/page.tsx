"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCourses } from "@/lib/courses";
import type { Course } from "@/lib/courses";

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      const data = await getCourses();
      setCourses(data);
      setIsLoading(false);
    }
    fetchCourses();
  }, []);

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
                href="/creator/dashboard"
                className="px-4 py-2 rounded bg-slate-700 text-white hover:bg-slate-600 transition"
              >
                Creator Dashboard
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Learn from AI Masters
          </h1>
          <p className="text-xl text-slate-300">
            Discover courses built by top AI practitioners
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No courses available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/course/${course.id}`}
                className="group"
              >
                <div className="rounded-lg border border-slate-700 bg-slate-800 overflow-hidden hover:border-slate-500 transition h-full flex flex-col">
                  <div className="h-40 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <div className="text-white text-center">
                      <p className="text-4xl">▶</p>
                      <p className="text-sm mt-2">Video Course</p>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-white text-lg mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4 flex-1 line-clamp-3">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                      <span>{course.video_count} videos</span>
                      <span>{course.enrolled_count} enrolled</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      ${(course.price_cents / 100).toFixed(2)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-700 bg-slate-900 py-8 mt-20">
        <div className="mx-auto max-w-6xl px-4 text-center text-slate-400">
          <p>&copy; 2025 CourseHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
