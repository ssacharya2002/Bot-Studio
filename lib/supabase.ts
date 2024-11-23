import { createClient } from "@supabase/supabase-js";

const sbApiKey = process.env.SUPABASE_API_KEY!;
const sbUrl = process.env.SUPABASE_URL!;

if (!sbApiKey || !sbUrl) {
    throw new Error("Missing environment variable for Supabase  API key");
}

const SupabaseClient = createClient(sbUrl, sbApiKey);


export default SupabaseClient