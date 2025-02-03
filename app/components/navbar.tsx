import { SkydiverIcon } from "./icons";

export default function Navbar() {
  return (
    <div className="w-full navbar bg-base-200">
      <div className="flex-none md:hidden">
        <label htmlFor="drawer-toggle" className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               className="inline-block w-6 h-6 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </label>
      </div>
      <div className="flex-1 hidden lg:block">
        <div className="flex-1">
          <img src="/images/logo-text.png"
               className="h-[64px]"
               alt="the words chocolate chip cookies written in a font that looks like the letters contains chocolate chips" />
        </div>
      </div>
      <div>
        <SkydiverIcon fill={"white"}/>
      </div>
    </div>
  );
}
