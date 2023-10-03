"use client";

import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import client from "@/lib/client";
import { useState } from "react";

const imageBuilder = imageUrlBuilder(client);

const getUrl = (ref: string) => {
  return imageBuilder.image(ref);
};

type IProps = {
  url: string;
  name: string;
  description: string;
};

const CustomImage = ({ url, name, description }: IProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div

      className={`${
        open
          ? "w-full h-auto z-40 fixed top-0 bottom-0 left-0 right-0 m-auto bg-white flex flex-col justify-center items-center"
          : "h-auto w-auto relative"
      }  cursor-pointer`}
    >
      <div
        style={{ right: "20%" }}
        className={`absolute top-3 ${open ? "visible" : "hidden"} `}
      >
        X Stäng
      </div>
      <img
        alt={description}
        src={getUrl(url).url()}
        loading="lazy"
        decoding="async"
        height={"auto"}
        width={open ? "60%" : "100%"}
        title={name}
      />
      <div style={{ width: "60%" }}>
        <h2 className={`text-2xl ${open ? "text-black py-2" : "text-red"}`}>
          {name}
        </h2>
        <span className={open ? "visible" : "hidden"}>{description}</span>
      </div>
    </div>
  );
};

export default CustomImage;
