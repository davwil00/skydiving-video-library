import { ChangeEvent } from "react";

type ColourPickerInputProps = {
  label: string
  value: string
  name: string
  type: 'text' | 'color'
  onChange: (value: string, event: ChangeEvent<HTMLInputElement>) => void
}

export default function ColourPickerInput({label, value, name, onChange, type}: ColourPickerInputProps) {
  return (
    <label className={`text-black flex items-center gap-2 justify-between input-sm ${type === 'color' ? 'max-w-[250px]' : ''}`}>
      {label}
      <input type={type} value={value} autoComplete="off" className={`${type === 'text' ? 'input input-bordered input-sm bg-white w-[6em] p-2' : ''}`}
             onChange={e => onChange(name, e)} />
    </label>
  );
}
