import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://zoekgfqooakfylyzfwvy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZWtnZnFvb2FrZnlseXpmd3Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NTExMTMsImV4cCI6MjA5NTEyNzExM30.G3Ghjm08EE-_br_kRQqOVNLWc1u5aBSmYtUNTej6FmU"
);