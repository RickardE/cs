"use client";

import { TouchEvent, useEffect, useRef, useState } from "react";
import imageUrlBuilder from "@sanity/image-url";
import client from "@/lib/client";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import React from "react";

gsap.registerPlugin(ScrollTrigger);

const imageBuilder = imageUrlBuilder(client);
const getUrl = (ref: string) => {
  return imageBuilder.image(ref);
};

interface IImage {
  name: string;
  asset: {
    _ref: string;
    _type: string;
  };
  description: string;
}

interface IImages {
  images: IImage[];
  open: () => void;
  currentImage: (index: number) => void;
}

interface IProps {
  image: {
    url?: string;
    name: string;
    description: string;
    asset: {
      _ref: string;
      _type: string;
    };
  }[];
}

interface CurrentImage extends IImage {
  open: boolean;
  close: () => void;
  onTouchStart: (e: TouchEvent) => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchEnd: (e: TouchEvent) => void;
  onClickNext: () => void;
  onClickPrev: () => void;
  nr: number;
  total: number;
}

const CurrentImage = ({
  asset,
  name,
  description,
  close,
  open,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  nr,
  total,
  onClickNext,
  onClickPrev,
}: CurrentImage) => {
  const [loaded, setLoaded] = useState<boolean>(true);

  return (
    <div
      className={`text-black fixed overflow-hidden h-full w-full z-40 bg-white top-0 bottom-0 left-0 right-0 flex flex-col items-center ${
        open ? "block" : "hidden"
      }`}
    >
      {loaded ? (
        <div
          className={`relative h-full w-full max-w-2/5 overflow-hidden flex flex-col justify-center items-center`}
        >
          <div className="flex flex-row items-center justify-between w-3/5 pb-3">
            <div>
              {nr} / {total}
            </div>

            <div onClick={() => close()} className={"cursor-pointer"}>
              <img src="/images/close.svg" />
            </div>
          </div>

          <div className="max-w-[70%] max-h-[70%] relative">
            <img
              className="mx-auto max-h-full max-w-full object-cover"
              src={getUrl(asset._ref).url()}
              width={"auto"}
              height={"auto"}
              onTouchStart={(e) => onTouchStart(e)}
              onTouchMove={(e) => onTouchMove(e)}
              onTouchEnd={(e) => onTouchEnd(e)}
            />
          </div>

          <div
            className={`w-full h-auto flex flex-col items-center justify-center transition-all`}
          >
            <div className="text-center pb-1 pt-4 w-10/12 xl:w-6/12 block text-2xl">
              {name}
            </div>
            <div className={`text-center pb-1 w-10/12 xl:w-6/12 block`}>
              {description}
            </div>
          </div>
          <div className="flex flex-row">
            <div>
              <img
                onClick={() => onClickPrev()}
                className="inline cursor-pointer"
                height={"100%"}
                width={"100%"}
                src="/images/left-arrow.svg"
              />
            </div>
            <div>
              <img
                onClick={() => onClickNext()}
                className="inline cursor-pointer"
                height={"100%"}
                width={"100%"}
                src="/images/right-arrow.svg"
              />
            </div>
          </div>
        </div>
      ) : (
        <div
          hidden={loaded ? true : false}
          className="absolute w-full h-full bg-whitetransparent z-30 flex flex-col justify-center items-center"
        >
          <img src={"/images/spinner.svg"} />
        </div>
      )}

      <img
        hidden
        alt="test"
        src={getUrl(asset._ref).url()}
        onLoadStart={() => setLoaded(false)}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

const Images = ({ images, open, currentImage }: IImages) => {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [nrOfImages, setnrOfImages] = useState<number>(0);

  const loadImages = () => {
    setnrOfImages((nrOfImages) => nrOfImages + 1);

    if (nrOfImages === images.length) {
      setImageLoaded(true);
    }
  };

  // useEffect(() => {
  //   images.map((img, i) => {
  //     const ctx = gsap.context(() => {
  //       const tl = gsap.timeline().from(`#item-${i}`, {
  //         yPercent: 1,
  //         delay: 0,
  //       });

  //       ScrollTrigger.create({
  //         trigger: `#item-${i}`,
  //         start: "top 140%",
  //         animation: tl,
  //       });
  //     });

  //     return () => ctx.revert();
  //   });
  // }, []);

  return (
    <div
      hidden={!imageLoaded}
      className="text-white grid xl:grid-cols-3 md:grid-cols-2 gap-6 justify-stretch"
    >
      {images.map((img, i) => (
        <div
          id={`item-${i}`}
          key={i}
          className="relative max-h-full w-auto relative group/image cursor-pointer"
        >
          <div className="h-auto max-h-full w-100 relative">
            <img
              className="relative h-auto w-auto max-h-full relative"
              onClick={() => {
                currentImage(i);
                open();
              }}
              src={getUrl(img.asset._ref).url()}
              width={"100%"}
              height={"auto"}
              loading="lazy"
              decoding="async"
              style={{ display: "inline" }}
              onLoad={() => {
                loadImages();
              }}
            />

            <div
              onClick={() => {
                currentImage(i);
                open();
              }}
              className="text-xl font-bold opacity-0 absolute left-0 right-0 top-0 bottom-0 w-full h-full bg-blacktransparent group-hover/image:opacity-100 transition-all flex flex-col items-center justify-center"
            >
              <img
                loading="lazy"
                decoding="async"
                src="/images/resize.svg"
              ></img>
            </div>

            <div className="clear-both"></div>
          </div>
          <p className="px-1 py-2 text-xl">{img.name}</p>
        </div>
      ))}
    </div>
  );
};

const Gallery = ({ image }: IProps) => {
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [isButtonPressed, setIsButtonPressed] = useState<boolean>(false);
  const [clicks, setClicks] = useState<number>(0);
  const [startX, setStartX] = useState<number>(0);
  const [isPin, setIsPin] = useState<boolean>(false);

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length > 1) {
      setIsPin(true);
    } else {
      setIsPin(false);
    }

    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {};

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isPin) {
      const distance = e.changedTouches[0].clientX - startX;

      if (distance > 75) {
        if (currentImage > 0) {
          setCurrentImage(currentImage - 1);
        }
      } else if (distance < -75) {
        if (currentImage < image.length - 1) {
          setCurrentImage(currentImage + 1);
        }
      }
    }
  };

  const handleKeyUp = () => {
    setIsButtonPressed(false);
  };

  const handleKeyDown = (key: string) => {
    if (!isButtonPressed && open) {
      switch (key) {
        case "Escape":
          setOpen(false);
          setIsButtonPressed(true);
          break;

        case "ArrowRight":
          if (currentImage < image.length - 1) {
            setCurrentImage(currentImage + 1);
            setIsButtonPressed(true);
          }
          break;

        case "ArrowLeft":
          if (currentImage > 0) {
            setCurrentImage(currentImage - 1);
            setIsButtonPressed(true);
          }
          break;

        default:
          break;
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", (e) => handleKeyDown(e.key));
    document.addEventListener("keyup", () => handleKeyUp());

    return () => {
      document.removeEventListener("keydown", (e) => handleKeyDown(e.key));
      document.removeEventListener("keyup", () => handleKeyUp());
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    open
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "scroll");
  });

  if (image.length > 0) {
    return (
      <div>
        <Images
          currentImage={(i) => {
            setCurrentImage(i);
          }}
          open={() => setOpen(!open)}
          images={image}
        ></Images>
        {image.map(
          (img, i) =>
            i === currentImage && (
              <CurrentImage
                onTouchStart={(e) => handleTouchStart(e)}
                onTouchEnd={(e) => handleTouchEnd(e)}
                onTouchMove={(e) => handleTouchMove(e)}
                onClickNext={() =>
                  currentImage < image.length - 1
                    ? setCurrentImage(currentImage + 1)
                    : ""
                }
                onClickPrev={() =>
                  currentImage > 0 ? setCurrentImage(currentImage - 1) : ""
                }
                close={() => setOpen(false)}
                open={open}
                key={i}
                name={img.name}
                description={img.description}
                asset={img.asset}
                nr={i + 1}
                total={image.length}
              ></CurrentImage>
            )
        )}
      </div>
    );
  }

  return <div>Nothing here..</div>;
};

export default Gallery;
