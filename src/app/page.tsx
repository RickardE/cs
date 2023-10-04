import client from "@/lib/client";
import { notFound } from "next/navigation";
import type { ResolvingMetadata, Metadata } from "next";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { revalidatePath } from "next/cache";
import Gallery from "./components/gallery";

type Block = {
  _type: string;
  children: { _type: string; marks: string[]; text: string }[];
  markDefs: { _key: string; _type: string; extraData: string }[];
  style: string;
};

type Page = {
  pageTitle: string;
  pageBuilder: {
    _type: string;
    link: string;
    content: Block[];
  }[];
  pageSlug: string;
};

type Props = {
  params: {
    slug?: string;
  };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  revalidatePath("/");
  const Page: Page[] = await client.fetch(
    `*[_type == "page" && pageSlug == "/"]`
  );

  const page = Page[0];

  if (page) {
    return {
      title: page.pageTitle,
    };
  }

  return {
    title: "404",
  };
}

export default async function Page({ params }: Props) {
  revalidatePath("/");
  const Page: Page[] = await client.fetch(
    `*[_type == "page" && pageSlug == "/"]`
  );

  if (Page.length === 0) {
    console.log(404);
    return notFound();
  }

  const page = Page[0];

  const portableTextComponents: PortableTextComponents = {
    block: {
      h1: ({ children }) => (
        <h1 className="text-5xl xl:text-7xl text-red py-4">{children}</h1>
      ),
      h2: ({ children }) => <h2 className="text-5xl text-red">{children}</h2>,
      h3: ({ children }) => <h3 className="text-3xl text-red">{children}</h3>,
      h4: ({ children }) => <h4 className="text-xl text-red">{children}</h4>,
      normal: ({ children }) => (
        <div className="xl:w-6/12 sm:w-10/12 md:w-10/12 block text-sm lg:text-lg xl:text-lg sm:text-xs leading-7 xl:leading-10 text-mistyrose pr-6">
          {children}
        </div>
      ),
    },
  };

  const buildPage = (page: Page) => {
    const pb = page.pageBuilder;

    return pb.map((c, i) => {
      switch (c._type) {
        case "container":
          return (
            <div
              key={i}
              className="h-auto min-h-screen py-8 w-full flex flex-column items-center border-b border-red"
            >
              <div style={{ minHeight: "auto" }}>
                <PortableText
                  value={c.content}
                  components={portableTextComponents}
                ></PortableText>
              </div>
            </div>
          );
        case "background":
          return (
            <div
              key={i}
              className="h-auto min-h-screen w-full flex flex-column items-center border-b border-red text-mistyrose"
            >
              <p>{c.link}</p>
            </div>
          );
        default:
          return null;
          break;
      }
    });
  };

  if (page.pageBuilder && page.pageBuilder.length > 0) {
    return (
      <div className="relative flex flex-col min-h-screen relative w-10/12 mx-auto">
        {buildPage(page)}
      </div>
    );
  }

  return null;
}
