// src/supabase.js
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://hbxselxacjteuycmonuy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhieHNlbHhhY2p0ZXV5Y21vbnV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MzM0MTcsImV4cCI6MjA2NDEwOTQxN30.6OA4weElRta1Nv4tlrkFb17t4sWNqp0Y_7JhzywjsP0';
export const supabase = createClient(supabaseUrl, supabaseKey);