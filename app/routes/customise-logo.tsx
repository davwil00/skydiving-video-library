import { CSkydiver, CustomisableSkydiverIconColours } from "~/components/icons";
import { ChangeEvent, useState } from "react";
import ColourPickerInput from "~/components/colour-picker-input";

const dataHeader = "data:image/svg+xml;charset=utf-8";

export default function CustomiseLogo() {
  const loadImage = async (url: string): Promise<HTMLImageElement> => {
    const img = document.createElement("img");
    img.src = url;
    return new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  };

  const convertSVGtoImg = async () => {
    const svg = document.getElementById("image")!;
    const svgData = `${dataHeader},${encodeURIComponent(new XMLSerializer().serializeToString(svg))}`;
    const img = await loadImage(svgData);
    const scale = 3;
    const canvas = document.createElement("canvas")!;
    canvas.width = svg.clientWidth * scale;
    canvas.height = svg.clientHeight * scale;
    canvas.getContext("2d")?.drawImage(img, 0, 0, svg.clientWidth * scale, svg.clientHeight * scale);

    canvas.toBlob((blob) => {
      const imageUrl = URL.createObjectURL(blob!);
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "logo.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, "image/png", 1);
  };

  const defaultState: CustomisableSkydiverIconColours & { useColourPicker: boolean } = {
    wind1Colour: "#000000",
    wind2Colour: "#000000",
    wind3Colour: "#000000",
    wind4Colour: "#000000",
    wind5Colour: "#000000",
    wind6Colour: "#000000",
    helmetColour: "#FFFFFF",
    visorColour: "#FFFFFF",
    bodyColour: "#FFFFFF",
    leftArmColour: "#FFFFFF",
    rightArmColour: "#FFFFFF",
    leftLegColour: "#FFFFFF",
    rightLegColour: "#FFFFFF",
    chestColour: "#FFFFFF",
    outlineColour: "#000000",
    showWind: true,
    useColourPicker: true
  };
  const [state, setState] = useState(defaultState);
  const updateColour = (label: string, event: ChangeEvent<HTMLInputElement>) => {
    const colour = event.currentTarget.value;
    setState((prev) => ({ ...prev, [label]: colour }));
  };
  const setWind = (checked: boolean) => setState(prev => ({ ...prev, showWind: checked }));

  return (
    <>
      <div className="flex flex-wrap justify-around gap-8">
        <div>
          <CSkydiver svgProps={{ id: "image", width: 150 }}
                     colourProps={{ ...state }}
          />
        </div>
        <div className="flex-grow">
          <label className="label text-black cursor-pointer justify-start ml-2 mb-4">
            Use colour picker
            <input type="checkbox" defaultChecked={state.useColourPicker} className="checkbox checkbox-sm ml-4"
                   onChange={e => setState(prev => ({ ...prev, useColourPicker: e.target.checked }))} />
          </label>
          <div className="flex flex-wrap grow gap-2">
            <div className="flex flex-col grow gap-2">
              <ColourPickerInput label="Helmet colour" type={state.useColourPicker ? "color" : "text"}
                                 value={state.helmetColour} name={"helmetColour"}
                                 onChange={updateColour} />
              <ColourPickerInput label="Visor colour" type={state.useColourPicker ? "color" : "text"}
                                 value={state.visorColour} name={"visorColour"}
                                 onChange={updateColour} />
              <ColourPickerInput label="Body colour" type={state.useColourPicker ? "color" : "text"}
                                 value={state.bodyColour} name={"bodyColour"}
                                 onChange={updateColour} />
              <ColourPickerInput label="Chest colour" type={state.useColourPicker ? "color" : "text"}
                                 value={state.chestColour} name={"chestColour"}
                                 onChange={updateColour} />
              <ColourPickerInput label="Left arm colour" type={state.useColourPicker ? "color" : "text"}
                                 value={state.leftArmColour} name={"leftArmColour"}
                                 onChange={updateColour} />
              <ColourPickerInput label="Right arm colour" type={state.useColourPicker ? "color" : "text"}
                                 value={state.rightArmColour} name={"rightArmColour"}
                                 onChange={updateColour} />
              <ColourPickerInput label="Left leg colour" type={state.useColourPicker ? "color" : "text"}
                                 value={state.visorColour} name={"visorColour"}
                                 onChange={updateColour} />
              <ColourPickerInput label="Right leg colour" type={state.useColourPicker ? "color" : "text"}
                                 value={state.visorColour} name={"visorColour"}
                                 onChange={updateColour} />

            </div>
            <div className="flex flex-col grow gap-2">
              <label
                className="text-black flex items-center gap-2 cursor-pointer justify-between input-sm max-w-[250px]">
                Show wind
                <input type="checkbox" className="checkbox checkbox-sm" autoComplete="off"
                       defaultChecked={state.showWind}
                       onChange={e => setWind(e.target.checked)} />
              </label>
              <ColourPickerInput label="Wind 1 colour" type={state.useColourPicker ? "color" : "text"}
                                 value={state.wind1Colour} name={"wind1Colour"}
                                 onChange={updateColour} />
              <ColourPickerInput label="Wind 2 colour" type={state.useColourPicker ? "color" : "text"}
                                 value={state.wind2Colour} name={"wind2Colour"}
                                 onChange={updateColour} />
              <ColourPickerInput label="Wind 3 colour" type={state.useColourPicker ? "color" : "text"}
                                 value={state.wind3Colour} name={"wind3Colour"}
                                 onChange={updateColour} />
              <ColourPickerInput label="Wind 4 colour" type={state.useColourPicker ? "color" : "text"}
                                 value={state.wind4Colour} name={"wind4Colour"}
                                 onChange={updateColour} />
              <ColourPickerInput label="Wind 5 colour" type={state.useColourPicker ? "color" : "text"}
                                 value={state.wind5Colour} name={"wind5Colour"}
                                 onChange={updateColour} />
              <ColourPickerInput label="Wind 6 colour" type={state.useColourPicker ? "color" : "text"}
                                 value={state.wind6Colour} name={"wind6Colour"}
                                 onChange={updateColour} />

              <ColourPickerInput label="Outline colour" type={state.useColourPicker ? "color" : "text"}
                                 value={state.outlineColour} name={"outlineColour"}
                                 onChange={updateColour} />

            </div>
          </div>
        </div>
      </div>
      <div id="img-container"></div>
      <button className="btn" onClick={convertSVGtoImg}>Download</button>
    </>
  );
}
