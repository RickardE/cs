import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sidan finns ej",
};

export default function NotFoundPage() {
  return (
    <div className="bg-blag h-screen w-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl text-red">404 - Not found</h1>
      <Link className="text-white mt-4 hover:underline" href={"/"}>Tillbaka till startsidan</Link>
    </div>
  );
}
