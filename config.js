// config.js - Supabase Configuration
// TODO: Replace these placeholders with your actual Supabase URL and Anon Key
const SUPABASE_URL = 'https://cwwslrjddpmbtvlhgeoc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3d3NscmpkZHBtYnR2bGhnZW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MjkyNzAsImV4cCI6MjA5NTMwNTI3MH0.cAg7SK_RV5OrOnG4XZ4v6CrhwLUR8F8q5VtaopXtA2Y';

// Initialize Supabase Client
// We use the global supabase object loaded from the CDN in index.html and admin.html
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
