import { ReactNode } from "react";
import { InkscapeIcon, PdfIcon } from "~/components/icons";

{/* eslint-disable jsx-a11y/alt-text */
}
export default function logos() {
  return (
    <>
      <h1 className="text-2xl mb-4 text-black">Logos</h1>
      <h2 className="text-xl mt-4 mb-2 text-black">Colours</h2>
      <ul className="flex flex-wrap gap-2">
        <Img src="images/logos/colours/blue.png" />
        <Img src="images/logos/colours/green.png" />
        <Img src="images/logos/colours/purple.png" />
        <Img src="images/logos/colours/red.png" />
        <Img src="images/logos/colours/turquoise.png" />
        <Img src="images/logos/colours/yellow.png" />
        <Img src="images/logos/colours/yellow-full.png" />
      </ul>

      <h2 className="text-xl mt-4 mb-2 text-black">Plain</h2>
      <ul className="flex flex-wrap gap-2">
        <Img src="images/logos/image-only.png" imgClass="bg-black" />
        <Img src="images/logos/logo.png" />
        <Img src="images/logos/logo-black.png" />
        <Img src="images/logos/logo-black-transparent.png" />
        <Img src="images/logos/logo-white.png" />
        <Img src="images/logos/logo-white-transparent.png" />
        <Img src="images/logos/text-only.png" />
      </ul>

      <h2 className="text-xl mt-4 mb-2 text-black">Vector</h2>
      <ul className="flex flex-wrap gap-2">
        <ImgObject href=" images/logos/logo-with-text.pdf" label="Logo with text">
          <PdfIcon className={`max-w-[95%] absolute m-[1px]`} />
        </ImgObject>
        <ImgObject href="images/logos/logo-with-text-plain.svg" label="Logo with text" bordered={true}>
          <object data="images/logos/logo-with-text-plain.svg" className={`max-w-[95%] absolute m-[1px]`}
                  type="image/svg+xml" />
        </ImgObject>
        <ImgObject href=" images/logos/logo-with-text-white.pdf" label="Logo with text (white background)">
          <PdfIcon className={`max-w-[95%] absolute m-[1px]`} />
        </ImgObject>
      </ul>

      <h2 className=" text-xl mt-4 mb-2 text-black">Editable Versions</h2>
      <ul className=" flex flex-wrap gap-2">
        <ImgObject href="images/logos/logo-editable.svg" label="Colourable SVG" bordered={true}>
          <object data="images/logos/logo-editable.svg" className={`max-w-[95%] absolute m-[1px]`}
                  type="image/svg+xml" />
        </ImgObject>
        <ImgObject href="images/logos/logo.svg" label="Inkscape" bordered={true}>
          <object data="images/logos/logo.svg" className={`max-w-[95%] absolute m-[1px]`} type="image/svg+xml" />
        </ImgObject>
        <ImgObject href="images/logos/logo-with-text.svg" label="Logo with text (inkscape)">
          <InkscapeIcon className={`scale-[0.3] origin-top-left absolute m-[1px]`} />
        </ImgObject>
      </ul>
    </>
  );
}

function Img({ src, imgClass = "" }: { src: string, imgClass?: string }) {
  return (
    <li className="w-1/4">
      <a href={src} className="cursor-pointer"download target="_blank" rel="noopener noreferrer">
        <img src={src} className={`border border-black ${imgClass}`} />
      </a>
    </li>
  );
}

function ImgObject({ href, children, label, bordered = false }: {
  href: string,
  children: ReactNode,
  label?: string,
  bordered?: boolean
}) {
  return (
    <li className="w-1/4 relative flex flex-col">
      {children}
      <a href={href}
         className={`cursor-pointer ${bordered ? "border border-black " : ""} w-full h-full min-h-[175px] block p-2 relative`}
         download target="_blank" rel="noopener noreferrer">
      </a>
      <span className="text-black text-center">{label}</span>
    </li>
  );
}
