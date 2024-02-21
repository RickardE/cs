"use client";

import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import client from "@/lib/client";
import gsap from "gsap";
import Link from "next/link";
import { useRef, useState } from "react";
import imageUrlBuilder from "@sanity/image-url";

interface IProps {
  url: string;
  nav: {
    pageTitle: string;
    pageSlug: string;
    pageName: string;
    order: number;
  }[];
}

const imageBuilder = imageUrlBuilder(client);

const getUrl = (ref: string) => {
  return imageBuilder.image(ref);
};

const Header = ({ nav, url }: IProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const el = useRef<HTMLDivElement>(null);
  const el2 = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    open
      ? (document.body.style.overflowY = "hidden")
      : (document.body.style.overflowY = "scroll");

    const ctx = gsap.context(() => {
      gsap.to(el2.current, {
        yPercent: open ? 0 : -100,
        duration: 0.4,
      });

      gsap.to(el.current!.children[0], {
        rotation: open ? 45 : 0,
        transformOrigin: "50% 50%",
        y: open ? "10px" : 0,
        duration: 0.4,
      });
      gsap.to(el.current!.children[1], {
        opacity: open ? 0 : 1,
        duration: 0.2,
      });
      gsap.to(el.current!.children[2], {
        rotation: open ? -45 : 0,
        transformOrigin: "50% 50%",
        y: open ? "-10px" : 0,
        duration: 0.4,
      });
    });

    return () => ctx.clear();
  });

  return (
    <header className="fixed text-red w-full top-0 h-32 z-30 bg-black flex flex-col justify-center">
      <div className="grid grid-flow-col justify-stretch absolute w-10/12 mx-auto left-0 right-0 z-50 items-center">
        <div className="flex self-start">
          <a
            onClick={() => setOpen(false)}
            href={"/"}
            className="relative text-2xl"
          >
            <img
              style={{ width: "30%", height: "auto" }}
              src={getUrl(url).url()}
              loading="lazy"
              decoding="async"
              alt="Cecilia Sandman Art & Design Värmdö"
              title="Cecilia Sandman Art & Design Värmdö"
            />
          </a>
        </div>

        <div className="flex justify-end">
          <div
            className="cursor-pointer "
            onClick={() => setOpen(!open)}
            ref={el}
          >
            <div className={`w-9 h-0.5 bg-red my-2`}></div>
            <div className={`w-9 h-0.5 bg-red my-2`}></div>
            <div className={`w-9 h-0.5 bg-red  my-2`}></div>
          </div>
        </div>
      </div>

      <nav
        className={`flex flex-col items-start justify-center absolute z-40 h-screen bg-mistyrose translate-y[0%] top-0 bottom-0 right-0 left-0 ${
          open ? "visible" : "collapse"
        }`}
        ref={el2}
      >
        <div className="relative w-10/12 mx-auto">
          <div className="text-left text-2xl sm:text-3xl md:text-4xl lg:text-5xl flex flex-col items-left text-left">
            {nav &&
              nav
                .sort((a, b) => a.order - b.order)
                .map((n, i) => (
                  <Link
                    key={i}
                    onClick={() => setOpen(!open)}
                    className="hover:underline block py-3"
                    href={`/${n.pageSlug}`}
                  >
                    {n.pageName}
                  </Link>
                ))}
          </div>
          <div className="block absolute bottom-[-5vh] text-left w-full">
          <a href={"mailto:cecila@sandmans.se"}>cecilia@sandmans.se</a>
        </div>
        </div>
  
      </nav>
      <div className="clear-both"></div>
    </header>
  );
};

export default Header;
