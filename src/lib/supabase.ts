import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zxsgozfwvmcwpssxchnx.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4c2dvemZ3dm1jd3Bzc3hjaG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MTUwNzQsImV4cCI6MjA5NzM5MTA3NH0.s0p3Ij8d3znILjMPvXmCRPTmiyR_xWY50L0RU4NqB8Q";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
