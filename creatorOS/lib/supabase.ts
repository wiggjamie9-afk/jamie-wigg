import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth functions
export const auth = {
  signUp: async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    return { data: data?.user, error };
  },

  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  },
};

// Database functions
export const db = {
  // Users
  getUser: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  updateUser: async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  // Content
  getContent: async (userId: string, limit = 20, offset = 0) => {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1);
    return { data, error };
  },

  createContent: async (content: any) => {
    const { data, error } = await supabase
      .from('content')
      .insert([content])
      .select()
      .single();
    return { data, error };
  },

  // Posts
  getScheduledPosts: async (userId: string) => {
    const { data, error } = await supabase
      .from('scheduled_posts')
      .select('*')
      .eq('userId', userId)
      .order('scheduleTime', { ascending: true });
    return { data, error };
  },

  createScheduledPost: async (post: any) => {
    const { data, error } = await supabase
      .from('scheduled_posts')
      .insert([post])
      .select()
      .single();
    return { data, error };
  },

  updateScheduledPost: async (postId: string, updates: any) => {
    const { data, error } = await supabase
      .from('scheduled_posts')
      .update(updates)
      .eq('id', postId)
      .select()
      .single();
    return { data, error };
  },

  deleteScheduledPost: async (postId: string) => {
    const { error } = await supabase
      .from('scheduled_posts')
      .delete()
      .eq('id', postId);
    return { error };
  },

  // Analytics
  getAnalytics: async (userId: string, period = 'month') => {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('userId', userId)
      .eq('period', period)
      .single();
    return { data, error };
  },
};

// Storage functions
export const storage = {
  uploadContent: async (userId: string, file: File, bucket = 'content') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) return { url: null, error };

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return { url: publicUrl, error: null };
  },

  deleteContent: async (filePath: string, bucket = 'content') => {
    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    return { error };
  },
};
