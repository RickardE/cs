import client from "@/lib/client";
import { notFound } from "next/navigation";
import type { ResolvingMetadata, Metadata } from "next";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import CustomImage from "../components/image";
import { revalidatePath } from "next/cache";
import Gallery from "../components/gallery";

import imageUrlBuilder from "@sanity/image-url";
const imageBuilder = imageUrlBuilder(client);

const getUrl = (ref: string) => {
  return imageBuilder.image(ref);
};

type IImage = {
  _ref: string;
};

type Block = {
  _type: string;
  children: { _type: string; marks: string[]; text: string }[];
  markDefs: { _key: string; _type: string; extraData: string }[];
  style: string;
  asset: IImage[];
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
  pageName: string;
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
  revalidatePath("/");
  const Page: Page[] = await client.fetch(
    `*[_type == "page" && pageSlug == "${params.slug}"]`
  );

  const page = Page[0];

  if (page) {
    return {
      title: page.pageTitle + " -  Cecilia Sandman Art & Design Värmdö",
    };
  }

  return notFound();
}

export default async function Page({ params }: Props) {
  revalidatePath("/");
  const Page: Page[] = await client.fetch(
    `*[_type == "page" && pageSlug == "${params.slug}"]`
  );

  if (Page.length === 0) {
    return notFound();
  }

  const page = Page[0];

  const portableTextComponents: PortableTextComponents = {
    block: {
      h1: ({ children }) => (
        <h1 className="text-5xl  xl:text-7xl 2xl:text-7xl text-red py-4">{children}</h1>
      ),
      h2: ({ children }) => <h2 className="text-4xl text-red">{children}</h2>,
      h3: ({ children }) => <h3 className="text-2xl text-red">{children}</h3>,
      h4: ({ children }) => <h4 className="text-xl text-red">{children}</h4>,
      normal: ({ children }) => (
        <p className="leading-6 xl:w-6/12 sm:w-10/12 md:w-10/12 block text-sm md:text-lg lg:text-lg xl:text-lg sm:text-sm text-mistyrose pr-6 py-3">
          {children}
        </p>
      ),
    },
    types: {
      image: ({ value }) => (
        <div className="w-2/5">
          <img
            width={"auto"}
            height={"auto"}
            className="max-h-full max-h-full h-auto w-auto"
            src={getUrl(value.asset._ref).url()}
          />
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
            <div className="h-auto min-h-full py-8 w-full flex flex-column items-center even:border-t even:border-red">
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
              className="h-auto min-h-full w-full flex flex-column items-center border-b border-red text-mistyrose"
            >
              <p>{c.link}</p>
            </div>
          );

        case "gallery":
          return (
            <div className="h-auto block" key={i}>
              <Gallery image={c.images}></Gallery>
            </div>
          );
        default:
          return null;
      }
    });
  };

  if (page.pageBuilder && page.pageBuilder.length > 0) {
    return (
      <div className="relative flex flex-col min-h-full relative w-10/12 mx-auto justify-center">
        {buildPage(page)}
      </div>
    );
  }

  return null;
}
