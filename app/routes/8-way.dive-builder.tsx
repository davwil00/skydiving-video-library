import { useState } from 'react';
import { useNavigate } from 'react-router';
import { EIGHT_WAY_BLOCKS, EIGHT_WAY_RANDOMS } from '~/data/formations';

export default function EightWayFormation() {
    const [selectedFormations, setSelectedFormations] = useState<string[]>([]);
    const navigate = useNavigate();
    return (
        <div>
            <h1 className="text-2xl mb-4">8 Way Dive Builder</h1>
            <form>
                <ul className="grid grid-cols-4 gap-2 mb-4 w-fit">
                    {EIGHT_WAY_RANDOMS.map((random) => (
                        <li key={`random-${random.id}`}>
                            <button
                                type="button"
                                className={`kbd text-white p-4 ${selectedFormations.includes(random.id) ? 'bg-primary' : ''}`}
                                onClick={() =>
                                    setSelectedFormations((prev) => [
                                        ...prev,
                                        random.id,
                                    ])
                                }
                            >
                                {random.id}
                            </button>
                        </li>
                    ))}
                </ul>
                <ul className="grid grid-cols-4 gap-2 mb-4 w-fit">
                    {EIGHT_WAY_BLOCKS.map((block) => (
                        <li key={`block-${block.id}`}>
                            <button
                                type="button"
                                className={`kbd text-white p-4 ${selectedFormations.includes(block.id) ? 'bg-primary' : ''}`}
                                onClick={() =>
                                    setSelectedFormations((prev) => [
                                        ...prev,
                                        block.id,
                                    ])
                                }
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
                        navigate(
                            `/8-way/dive?dive=${selectedFormations.join(',')}`,
                        )
                    }
                >
                    Generate
                </button>
            </form>
        </div>
    );
}
