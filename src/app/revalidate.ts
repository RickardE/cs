// import { SIGNATURE_HEADER_NAME, isValidSignature } from "@sanity/webhook";
// import { NextApiRequest, NextApiResponse } from "next";

// const token =
//   "skyaqwpRhGiIFXH7hxlJQvSKOdtugURCVvmcTTpvVLP8OM4kFIVNCgFKMUHfmDIruqDnsHkQxeOZmvlQfE3oW8kyyuHT31MMBGGoIW5dZXyfIfh7s0A1P6kJmIftzGNHLJgstJQjtpHFAoGmB8NA2b5kFmeY7UEZBMPxfyoX6oIVSK81CcVC";

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   try {
//     const signature = req.headers[SIGNATURE_HEADER_NAME]!.toString();

//     if (isValidSignature(JSON.stringify(req.body), signature, token))
//       return res.status(401).json({ msg: "Invalid request!" });

//       const {slug} = req.body;
//   } catch (error) {}

// };

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  console.log("hejsan");
  const path = request.nextUrl.searchParams.get("path");

  if (!path) {
    return NextResponse.json(
      { message: "Missing path param" },
      { status: 400 }
    );
  }

  revalidatePath(path);

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
