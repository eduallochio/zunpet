import { supabaseAdmin } from "@/lib/supabase-admin";
import DeletionsClient from "./DeletionsClient";

async function getDeletionRequests() {
  const { data } = await supabaseAdmin
    .from("deletion_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function DeletionsPage() {
  const requests = await getDeletionRequests();
  return <DeletionsClient requests={requests} />;
}
