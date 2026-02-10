import { supabase } from "./supabase.js";

(async () => {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    location.href = "login.html";
  }
})();
