import "./globals.css";
import Header from "./components/header";
import client from "@/lib/client";
import Footer from "./components/footer";

type Logo = {
  logotype: {
    asset: {
      _ref: string;
    };
  };
};

type Page = {
  pageTitle: string;
  pageSlug: string;
  order: number;
};

const getHeader = async () => {
  return await client.fetch(`*[_type == "header"]`, {});
};

const getNav = async () => {
  return await client.fetch(`*[_type == "page"]`, {});
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const logo: Logo[] = await getHeader();

  const nav: Page[] = await getNav();

  return (
    <html lang="en">
      <body className="bg-black">
        <Header nav={nav} url={logo[0].logotype.asset._ref} />

        <div className="relative pt-40">{children}</div>

        <Footer />
      </body>
    </html>
  );
}
