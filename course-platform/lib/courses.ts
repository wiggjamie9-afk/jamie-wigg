import { supabase } from "./supabase-client";

export interface Course {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  price_cents: number;
  video_count: number;
  enrolled_count: number;
  created_at: string;
}

export interface CourseVideo {
  id: string;
  course_id: string;
  title: string;
  video_url: string;
  duration: number;
  order: number;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  stripe_payment_intent_id?: string;
  enrolled_at: string;
}

export async function getCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching courses:", error);
    return [];
  }

  return data || [];
}

export async function getCourseById(id: string): Promise<Course | null> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching course:", error);
    return null;
  }

  return data;
}

export async function getCourseVideos(courseId: string): Promise<CourseVideo[]> {
  const { data, error } = await supabase
    .from("course_videos")
    .select("*")
    .eq("course_id", courseId)
    .order("order", { ascending: true });

  if (error) {
    console.error("Error fetching course videos:", error);
    return [];
  }

  return data || [];
}

export async function getUserCourses(userId: string): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("creator_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user courses:", error);
    return [];
  }

  return data || [];
}

export async function getUserEnrollments(userId: string): Promise<Enrollment[]> {
  const { data, error } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_id", userId)
    .order("enrolled_at", { ascending: false });

  if (error) {
    console.error("Error fetching enrollments:", error);
    return [];
  }

  return data || [];
}

export async function isUserEnrolled(
  userId: string,
  courseId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();

  if (error) {
    return false;
  }

  return !!data;
}

export async function createEnrollment(
  userId: string,
  courseId: string,
  stripPaymentIntentId?: string
): Promise<Enrollment | null> {
  const { data, error } = await (supabase as any)
    .from("enrollments")
    .insert([
      {
        user_id: userId,
        course_id: courseId,
        stripe_payment_intent_id: stripPaymentIntentId,
        enrolled_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating enrollment:", error);
    return null;
  }

  return data;
}

export async function getEnrollmentCount(courseId: string): Promise<number> {
  const { count, error } = await supabase
    .from("enrollments")
    .select("id", { count: "exact", head: true })
    .eq("course_id", courseId);

  if (error) {
    console.error("Error fetching enrollment count:", error);
    return 0;
  }

  return count || 0;
}

export async function getCreatorRevenue(creatorId: string): Promise<number> {
  const { data, error } = await supabase
    .from("courses")
    .select("price_cents, enrolled_count")
    .eq("creator_id", creatorId);

  if (error) {
    console.error("Error calculating revenue:", error);
    return 0;
  }

  return (
    data?.reduce((sum: number, course: any) => sum + (course.price_cents / 100) * course.enrolled_count, 0) ||
    0
  );
}
