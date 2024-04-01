import { SkydiverIcon } from "~/components/skydiver-icon";

export default function Test() {
  return (
    <div id="21" className="relative">
      {/*<div className="left-[100px] absolute">*/}
      {/*<SkydiverIcon id="green" colour="#55D400" className="animate-spin-b21-green top-[130px] left-[30px] absolute rotate-[45deg]"/>*/}
      {/*<SkydiverIcon id="red" colour="#D40000" className="animate-spin-b21-red top-[50px] left-[120px] absolute rotate-[145deg]"/>*/}
      {/*</div>*/}
      <div className="absolute">
      <SkydiverIcon id="blue" colour="#0066FF" className="rotate-[180deg]"/>
      <SkydiverIcon id="yellow" colour="#FFCC00" className="rotate-[270deg]"/>
      </div>
    </div>
  );
}

export function B21() {
  return (
    <div id="21" className="relative">
      <SkydiverIcon id="green" colour="#55D400" className="animate-spin-b21-green top-[130px] left-[30px] absolute rotate-[45deg]"/>
      <SkydiverIcon id="red" colour="#D40000" className="animate-spin-b21-red top-[50px] left-[120px] absolute rotate-[145deg]"/>
      <SkydiverIcon id="blue" colour="#0066FF" className="animate-spin-b21-blue top-[255px] left-[153px] absolute rotate-[225deg]"/>
      <SkydiverIcon id="yellow" colour="#FFCC00" className="animate-spin-b21-yellow left-[60px] top-[340px] absolute rotate-[315deg]"/>
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

export function B9() {
  return (
    <div id="9" className="relative">
      <SkydiverIcon id="green" colour="#55D400" className="animate-spin-b9-green top-[50px] left-[30px] absolute rotate-[90deg]"/>
      <SkydiverIcon id="red" colour="#D40000" className="animate-spin-b9-red top-[70px] left-[120px] absolute rotate-[-90deg]"/>
      <SkydiverIcon id="blue" colour="#0066FF" className="animate-spin-b9-yellow-blue top-[240px] left-[180px] absolute"/>
      <SkydiverIcon id="yellow" colour="#FFCC00" className="animate-spin-b9-yellow-blue top-[240px] absolute"/>
    </div>
  );
}
