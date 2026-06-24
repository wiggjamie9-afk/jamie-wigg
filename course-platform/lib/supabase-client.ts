import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"] || "http://localhost:54321";
const supabaseKey = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] || "anon-key";

let supabase: ReturnType<typeof createClient>;

try {
  supabase = createClient(supabaseUrl, supabaseKey);
} catch (error) {
  console.warn("Failed to initialize Supabase:", error);
  // Create a dummy client that won't be used
  supabase = createClient("http://localhost:54321", "anon-key");
}

export { supabase };

export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.session.user.id)
    .single();

  return profile as User | null;
}

export async function signUp(
  email: string,
  password: string
): Promise<{ user: any; error: any }> {
  const result = await supabase.auth.signUp({ email, password });
  return { user: result.data.user, error: result.error };
}

export async function signIn(
  email: string,
  password: string
): Promise<{ user: any; error: any }> {
  const result = await supabase.auth.signInWithPassword({ email, password });
  return { user: result.data.user, error: result.error };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}
