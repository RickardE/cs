"use client";

import { TouchEvent, useEffect, useRef, useState } from "react";
import imageUrlBuilder from "@sanity/image-url";
import client from "@/lib/client";

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
  closeInfo: boolean;
  onTouchStart: (e: TouchEvent) => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchEnd: (e: TouchEvent) => void;
}

const CurrentImage = ({
  asset,
  name,
  description,
  open,
  close,
  closeInfo,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: CurrentImage) => {
  const element = useRef<HTMLImageElement>(null);

  return (
    <div
      className={`text-black fixed overflow-scroll min-h-full z-40 bg-white top-0 bottom-0 left-0 right-0 ${
        open ? "block" : "hidden"
      }`}
    >
      <div className="max-w-fit h-full overflow-scroll flex flex-col justify-center items-center">
        <img
          onClick={() => close()}
          src={getUrl(asset._ref).url()}
          loading="lazy"
          style={{ maxWidth: "60%" }}
          decoding="async"
          width={"auto"}
          height={"auto"}
          onTouchStart={(e) => onTouchStart(e)}
          onTouchMove={(e) => onTouchMove(e)}
          onTouchEnd={(e) => onTouchEnd(e)}
          ref={element}
        />

        <div className="text-center w-3/5 block text-2xl">{name}</div>
        <div className="text-center w-3/5 block">{description}</div>
      </div>

      <div
        className={`invisible absolute w-full h-full bg-blacktransparent top-0 bottom-0 left-0 right-0 text-white transition-all flex flex-col items-center justify-center ${
          closeInfo ? "xl:invisible" : "xl:visible"
        }`}
      >
        <div>Använd pilarna på tagentbordet för att bläddra</div>
        <div className="absolute top-0 right-10">
          <div className="bg-[url('/images/close.svg')] w-8 h-8 bg-no-repeat"></div>
        </div>

        <svg
          style={{ width: "50%", height: "50%" }}
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          x="0px"
          y="0px"
          viewBox="0 0 100 125"
        >
          <g>
            <g>
              <g>
                <g>
                  <g>
                    <path d="M93,74.61V54.7c0-1.88-1.53-3.41-3.41-3.41H69.68c-1.88,0-3.41,1.53-3.41,3.41v19.91c0,1.88,1.53,3.41,3.41,3.41h19.91       C91.48,78.02,93,76.49,93,74.61z M80.63,67.48V65.4h-7.17c-0.41,0-0.75-0.34-0.75-0.75s0.34-0.75,0.75-0.75h7.17v-2.07       c0-0.41,0.44-0.66,0.79-0.46l4.89,2.82c0.35,0.2,0.35,0.71,0,0.92l-4.89,2.82C81.07,68.14,80.63,67.88,80.63,67.48z" />
                  </g>
                </g>
              </g>
              <g>
                <g>
                  <g>
                    <path d="M7,54.7v19.91c0,1.88,1.53,3.41,3.41,3.41h19.91c1.88,0,3.41-1.53,3.41-3.41V54.7c0-1.88-1.53-3.41-3.41-3.41H10.41       C8.52,51.29,7,52.82,7,54.7z M19.37,61.83v2.07h7.17c0.41,0,0.75,0.34,0.75,0.75s-0.34,0.75-0.75,0.75h-7.17v2.07       c0,0.41-0.44,0.66-0.79,0.46l-4.89-2.82c-0.35-0.2-0.35-0.71,0-0.92l4.89-2.82C18.93,61.17,19.37,61.42,19.37,61.83z" />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

const Images = ({ images, open, currentImage }: IImages) => {
  return (
    <div className="text-white grid xl:grid-cols-3 md:grid-cols-2 gap-6 justify-stretch">
      {images.map((img, i) => (
        <div key={i} className="text-xl font-bold">
          <img
            onClick={() => {
              open();
              currentImage(i);
            }}
            src={getUrl(img.asset._ref).url()}
            width={"100%"}
            height={"auto"}
            loading="lazy"
            decoding="async"
            style={{ display: "inline" }}
          />
          {img.name}
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
  const [touch, setTouch] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [endX, setEndX] = useState<number>(0);
  const [el, setEl] = useState<HTMLImageElement>();

  const handleTouchStart = (e: TouchEvent) => {
    setTouch(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {};

  const handleTouchEnd = (e: TouchEvent) => {
    const distance = e.changedTouches[0].clientX - startX;

    if (distance > 0) {
      console.log("right");
      if (currentImage < image.length - 1) {
        setCurrentImage(currentImage + 1);
      }
    } else if (distance < 0) {
      if (currentImage > 0) {
        setCurrentImage(currentImage - 1);
      }
    }
  };

  const increaseClicks = () => {
    setClicks(clicks + 1);
  };

  const handleKeyUp = () => {
    setIsButtonPressed(false);
  };

  const handleKeyDown = (key: string) => {
    if (!isButtonPressed && open) {
      increaseClicks();

      if (clicks > 0) {
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
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", (e) => handleKeyDown(e.key));
    document.addEventListener("keyup", () => handleKeyUp());

    return () => {
      document.removeEventListener("keydown", (e) => handleKeyDown(e.key));
      document.removeEventListener("keyup", () => handleKeyUp());
    };
  }, [handleKeyDown, handleKeyUp, increaseClicks]);

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
                closeInfo={clicks > 0 ? true : false}
                close={() => setOpen(false)}
                open={open}
                key={i}
                name={img.name}
                description={img.description}
                asset={img.asset}
              ></CurrentImage>
            )
        )}
        Bild: {currentImage}
        <br />
        Clicks {clicks}
      </div>
    );
  }

  return <div>Nothing here..</div>;
};

export default Gallery;
