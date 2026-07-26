import { useState } from 'react';
import { useOuterClick } from '~/hooks/useOuterClick';

type AutoSuggestInputParams = {
    allowedValues: string[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
};

export default function SuggestInputTags({
    allowedValues,
    selectedValues,
    onChange,
}: AutoSuggestInputParams) {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestions = allowedValues.filter(
        (value) => !selectedValues.includes(value),
    );
    function remove(valueToRemove: string) {
        onChange(selectedValues.filter((value) => value !== valueToRemove));
    }
    function add(valueToAdd: string) {
        onChange([...selectedValues, valueToAdd]);
    }
    const innerRef = useOuterClick(() => setShowSuggestions(false));

    return (
        <div ref={innerRef}>
            <div
                className="bg-base-content border-1 rounded-lg border-black p-2 flex gap-2 flex-wrap"
                onClick={() => setShowSuggestions(true)}
            >
                {selectedValues.map((value) => (
                    <div
                        key={value}
                        className="border-1 rounded-md w-fit text-nowrap h-full"
                    >
                        <span className="p-2">{value}</span>
                        <button
                            type="button"
                            className="border-l px-1.5 bg-base-100 text-white h-full"
                            onClick={() => remove(value)}
                        >
                            x
                        </button>
                    </div>
                ))}
            </div>
            {showSuggestions ? (
                <div className="border-1 absolute bg-white z-1">
                    {suggestions.map((suggestion) => (
                        <div
                            key={suggestion}
                            className="cursor-pointer hover:bg-[var(--color-hover)] p-2 pr-10"
                            onClick={() => add(suggestion)}
                        >
                            {suggestion}
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
