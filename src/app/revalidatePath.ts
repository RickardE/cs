import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function Revalidate(path: string) {
  revalidatePath(path);
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
