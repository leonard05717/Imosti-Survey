import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://ppplvgibvloalxknegjt.supabase.co";
const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwcGx2Z2lidmxvYWx4a25lZ2p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjk2NTcsImV4cCI6MjA2NjkwNTY1N30.cre2CuWbYnEpjgta3KUShw4qMNae1h7xjL2rPLX1VKw";
const supabase = createClient(supabaseUrl, key);

/**
 * Retrieves the account data from localStorage.
 *
 * @returns {Object|null} The account object if found, otherwise null.
 */
export function getAccount() {
  const json = localStorage.getItem("data");
  if (!json) return null;
  const obj = JSON.parse(json);
  delete obj.Password;
  return obj;
}

export async function autoCancelAppointment() {}

export default supabase;
