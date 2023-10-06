"use client";

import { TouchEvent, useEffect, useRef, useState } from "react";
import imageUrlBuilder from "@sanity/image-url";
import client from "@/lib/client";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

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
  closeInfo: boolean;
  onTouchStart: (e: TouchEvent) => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchEnd: (e: TouchEvent) => void;
}

const CurrentImage = ({
  asset,
  name,
  description,
  close,
  open,
  closeInfo,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: CurrentImage) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [hideDesc, setHideDesc] = useState<boolean>(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div
      className={`text-black fixed overflow-scroll h-full w-full z-40 bg-white top-0 bottom-0 left-0 right-0 flex flex-col items-center ${
        open ? "block" : "hidden"
      }`}
    >
      <div className="relative h-full w-full overflow-hidden flex flex-col justify-center items-center">
        <div
          onClick={() => close()}
          className="absolute right-8 top-8 xl:invisible"
        >
          <svg
            fill="#000000"
            height="50px"
            width="50px"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-143.36 -143.36 798.72 798.72"
            stroke="#000000"
          >
            <g>
              <rect
                x="-143.36"
                y="-143.36"
                width="798.72"
                height="798.72"
                rx="399.36"
                fill="#ffffff"
              ></rect>
            </g>
            <g></g>
            <g>
              <g>
                <g>
                  <polygon points="512,59.076 452.922,0 256,196.922 59.076,0 0,59.076 196.922,256 0,452.922 59.076,512 256,315.076 452.922,512 512,452.922 315.076,256 "></polygon>{" "}
                </g>
              </g>
            </g>
          </svg>
        </div>
        <img
          hidden={loading}
          className="w-full h-full mx-auto object-cover"
          src={getUrl(asset._ref).url()}
          loading="lazy"
          decoding="async"
          width={"100%"}
          height={"100%"}
          onTouchStart={(e) => onTouchStart(e)}
          onTouchMove={(e) => onTouchMove(e)}
          onTouchEnd={(e) => onTouchEnd(e)}
          onLoad={() => setLoading(false)}
        />

        <div hidden={!loading} className="absolute">
          <img src={"/images/spinner.svg"} />
        </div>

        <div
          onClick={() => setHideDesc(!hideDesc)}
          className={`absolute bottom-0 bg-whitetransparent w-full flex flex-col items-center justify-center transition-all ${
            hideDesc ? "-bottom-[4%]" : "bottom-0"
          }`}
        >
          <div
            className={`absolute top-0 bottom-0 h-auto right-24 block flex flex-col ${
              hideDesc ? "justify-top" : "justify-center"
            } `}
          >
            <img
              className={`${hideDesc ? "block" : "hidden"}`}
              src="/images/up-arrow.svg"
            />
            <img
              className={`${hideDesc ? "hidden" : "block"}`}
              src="/images/down-arrow.svg"
            />
          </div>
          <div className="text-center w-10/12 xl:w-6/12 block text-2xl">
            {name}
          </div>
          <div className={`text-center w-10/12 xl:w-6/12 block`}>
            {description}
          </div>
        </div>
      </div>

      <div
        className={`invisible absolute w-full h-full bg-blacktransparent top-0 bottom-0 left-0 right-0 text-white transition-all flex flex-col items-center justify-center ${
          closeInfo ? "xl:invisible" : "xl:visible"
        }`}
      >
        <div className="text-xl bg-blacktransparent p-4">
          Använd pilarna på tagentbordet för att bläddra och [ESC] för att gå
          tillbaka.
        </div>
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
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    images.map((img, i) => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline().from(`#item-${i}`, {
          yPercent: 100,
          delay: 0.2,
        });

        ScrollTrigger.create({
          trigger: `#item-${i}`,
          start: "top 140%",
          animation: tl,
        });
      });

      return () => ctx.kill();
    });
  }, []);

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
              className="relative h-auto  w-auto  max-h-fullrelative"
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
              onLoad={() => setImageLoaded(true)}
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
          <p>{img.name}</p>
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
  const [isPin, setIsPin] = useState<boolean>(false);

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length > 1) {
      setIsPin(true);
    } else {
      setIsPin(false);
    }

    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    console.log(e.touches);
  };

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

    setTouch(false);
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
      </div>
    );
  }

  return <div>Nothing here..</div>;
};

export default Gallery;
