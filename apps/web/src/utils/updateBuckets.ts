// src/utils/updateBuckets.ts
export const updateBuckets = async ({
  user_id,
  access_token,
}: {
  user_id: string;
  access_token: string;
}): Promise<boolean> => {
  try {
    const response = await fetch(
      "https://gcqginwrpavxjorltppn.supabase.co/functions/v1/bucketManager",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ user_id }),
      }
    );

    if (!response.ok) {
      console.error("Bucket update failed:", await response.text());
      return false;
    }

    console.log("✅ Buckets updated");
    return true;
  } catch (err) {
    console.error("❌ Error updating buckets:", err);
    return false;
  }
};
