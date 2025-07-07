// supabase/functions/bucketManager/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const { user_id } = await req.json();
  if (!user_id) return new Response("Missing user_id", { status: 400 });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: user, error: userErr } = await supabase
    .from("users")
    .select("id, interests, zip_code, radius_miles, politics")
    .eq("id", user_id)
    .single();

  if (userErr || !user) return new Response("User not found", { status: 404 });

  const traits: { type: string; value: string }[] = [];

  if (Array.isArray(user.interests)) {
    for (const interest of user.interests) {
      traits.push({ type: "interest", value: interest });
    }
  }

  if (user.zip_code && user.radius_miles) {
    traits.push({
      type: "proximity",
      value: `${user.zip_code}-${user.radius_miles}mi`,
    });
  }

  if (user.politics) {
    traits.push({ type: "politics", value: user.politics });
  }

  // Join or create each bucket
  for (const trait of traits) {
    const { data: existing } = await supabase
      .from("buckets")
      .select("id")
      .eq("type", trait.type)
      .eq("value", trait.value)
      .single();

    const bucket_id = existing?.id ?? (
      await supabase
        .from("buckets")
        .insert(trait)
        .select("id")
        .single()
    ).data?.id;

    if (bucket_id) {
      await supabase
        .from("bucket_members")
        .upsert({
          user_id: user.id,
          bucket_id,
          last_active: new Date().toISOString(),
        }, { onConflict: "user_id,bucket_id" });
    }
  }

  // Add buckets based on recent interaction tags
  const { data: tagRows } = await supabase.rpc("get_recent_interaction_tags", { uid: user.id });

  for (const tag of tagRows ?? []) {
    const { data: bucket } = await supabase
      .from("buckets")
      .select("id")
      .eq("type", "interest")
      .eq("value", tag)
      .single();

    const bucket_id = bucket?.id ?? (
      await supabase
        .from("buckets")
        .insert({ type: "interest", value: tag })
        .select("id")
        .single()
    ).data?.id;

    if (bucket_id) {
      await supabase
        .from("bucket_members")
        .upsert({
          user_id: user.id,
          bucket_id,
          last_active: new Date().toISOString(),
        }, { onConflict: "user_id,bucket_id" });
    }
  }

  // Remove old/inactive interest-based memberships
  const { data: interestBuckets } = await supabase
    .from("buckets")
    .select("id")
    .eq("type", "interest");

  const bucketIds = interestBuckets?.map((b) => b.id) ?? [];

  if (bucketIds.length > 0) {
    await supabase
      .from("bucket_members")
      .delete()
      .in("bucket_id", bucketIds)
      .eq("user_id", user.id)
      .lt("last_active", new Date(Date.now() - 7 * 86400000).toISOString());
  }

  return new Response("Buckets updated", { status: 200 });
});
