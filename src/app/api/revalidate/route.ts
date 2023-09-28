import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const signature = req.headers[SIGNATURE_HEADER_NAME];
console.log('hejsan')
  console.log(signature);
  const isValid = isValidSignature(
    JSON.stringify(req.body),
    signature!.toString(),
    "12345678910"
  );

  console.log(`===== Is the webhook request valid? ${isValid}`);

  // Validate signature

  if (!isValid) {
    res.status(401).json({ success: false, message: "Invalid signature" });

    return;
  }

  try {
    const pathToRevalidate = req.body.slug.current;

    console.log(`===== Revalidating: ${pathToRevalidate}`);

    await res.revalidate(pathToRevalidate);

    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send("Error while revalidating");
  }
}
