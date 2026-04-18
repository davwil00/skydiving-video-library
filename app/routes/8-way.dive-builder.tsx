import { useState } from 'react';
import { useNavigate } from 'react-router';
import { EIGHT_WAY_BLOCKS, EIGHT_WAY_RANDOMS } from '~/data/formations';

export default function EightWayFormation() {
    const [selectedFormations, setSelectedFormations] = useState<string[]>([]);
    const navigate = useNavigate();
    const selectFormation = (id: string) => {
        setSelectedFormations((prev) => {
            if (prev.includes(id)) {
                return prev.filter((formation) => formation !== id);
            }
            return [...prev, id];
        });
    };
    return (
        <div>
            <h1 className="text-2xl mb-4">8 Way Dive Builder</h1>
            <ul className="grid grid-cols-4 gap-2 mb-4 w-[250px] mx-auto">
                {EIGHT_WAY_RANDOMS.map((random) => (
                    <li className="mx-auto" key={`random-${random.id}`}>
                        <button
                            type="button"
                            className={`kbd text-white p-4 ${selectedFormations.includes(random.id) ? 'bg-primary' : ''}`}
                            onClick={() => selectFormation(random.id)}
                        >
                            {random.id}
                        </button>
                    </li>
                ))}
            </ul>
            <ul className="grid grid-cols-4 gap-2 mb-4 w-[250px] mx-auto">
                {EIGHT_WAY_BLOCKS.map((block) => (
                    <li className="mx-auto" key={`block-${block.id}`}>
                        <button
                            type="button"
                            className={`kbd text-white p-4 ${selectedFormations.includes(block.id) ? 'bg-primary' : ''}`}
                            onClick={() => selectFormation(block.id)}
                        >
                            {block.id}
                        </button>
                    </li>
                ))}
            </ul>
            <button
                type="button"
                className="btn btn-neutral"
                onClick={() =>
                    navigate(`/8-way/dive?dive=${selectedFormations.join(',')}`)
                }
            >
                Generate
            </button>
        </div>
    );
}
