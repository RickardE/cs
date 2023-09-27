import client from "@/lib/client";
import { notFound } from "next/navigation";
import type { ResolvingMetadata, Metadata } from "next";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import CustomImage from "../components/image";

type Block = {
  _type: string;
  children: { _type: string; marks: string[]; text: string }[];
  markDefs: { _key: string; _type: string; extraData: string }[];
  style: string;
};

type Image = {
  name: string;
  description: string;
  asset: {
    _ref: string;
    _type: string;
  };
};

type Page = {
  pageTitle: string;
  pageBuilder: {
    _type: string;
    link: string;
    content: Block[];
    images: Image[];
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
  const Page: Page[] = await client.fetch(
    `*[_type == "page" && pageSlug == "${params.slug}"]`,
    { next: 0.5 }
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
  const Page: Page[] = await client.fetch(
    `*[_type == "page" && pageSlug == "${params.slug}"]`,
    { next: 1 }
  );

  if (Page.length === 0) {
    console.log(404);
    return notFound();
  }

  const page = Page[0];

  const portableTextComponents: PortableTextComponents = {
    block: {
      h1: ({ children }) => (
        <h1 className="text-7xl text-red py-4">{children}</h1>
      ),
      h2: ({ children }) => <h2 className="text-5xl text-red">{children}</h2>,
      h3: ({ children }) => <h3 className="text-3xl text-red">{children}</h3>,
      h4: ({ children }) => <h4 className="text-xl text-red">{children}</h4>,
      normal: ({ children }) => (
        <span className="w-6/12 block leading-9 text-xl text-mistyrose">
          {children}
        </span>
      ),
    },
  };

  const buildPage = (page: Page) => {
    const pb = page.pageBuilder;

    return pb.map((c, i) => {
      switch (c._type) {
        case "container":
          return (
            <div className="h-screen w-full flex flex-column items-center border-b border-red">
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
            <div className="h-screen w-full flex flex-column items-center border-b border-red text-mistyrose">
              <p key={i}>{c.link}</p>
            </div>
          );

        case "gallery":
          return (
            <div className="h-screen w-full pt-32 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {c.images.map((img, i) => (
                <div className="w-full h-auto" key={i}>
                  <CustomImage
                    url={img.asset._ref}
                    name={img.name}
                    description={img.description}
                  ></CustomImage>
                </div>
              ))}
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
      <div className="flex-1 flex-col relative w-10/12 mx-auto">
        {buildPage(page)}
      </div>
    );
  }

  return null;
}
