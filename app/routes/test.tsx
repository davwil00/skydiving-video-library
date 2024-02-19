import { SkydiverIcon } from "~/components/skydiver-icon";

export default function Test() {
  return (
    <div id="7" className="relative">
      <SkydiverIcon id="green" colour="#55D400" className="animate-spin-b7-green top-[130px] absolute rotate-[45deg]"/>
      <SkydiverIcon id="red" colour="#D40000" className="animate-spin-b7-red top-[50px] left-[100px] absolute rotate-[135deg]"/>
      <SkydiverIcon id="blue" colour="#0066FF" className="animate-spin-b7-blue top-[200px] left-[220px] absolute rotate-[-135deg]"/>
      <SkydiverIcon id="yellow" colour="#FFCC00" className="animate-spin-b7-yellow top-[290px] left-[120px] absolute rotate-[-45deg]"/>
    </div>
  );
}


export function B7() {
  return (
    <div id="7" className="relative">
      <SkydiverIcon id="green" colour="#55D400" className="animate-spin-b7-green top-[130px] absolute rotate-[45deg]"/>
      <SkydiverIcon id="red" colour="#D40000" className="animate-spin-b7-red top-[50px] left-[100px] absolute rotate-[135deg]"/>
      <SkydiverIcon id="blue" colour="#0066FF" className="animate-spin-b7-blue top-[200px] left-[220px] absolute rotate-[-135deg]"/>
      <SkydiverIcon id="yellow" colour="#FFCC00" className="animate-spin-b7-yellow top-[290px] left-[120px] absolute rotate-[-45deg]"/>
    </div>
  );
}
