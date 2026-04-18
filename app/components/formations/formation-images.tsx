import {
    type MouseEvent,
    type ReactNode,
    type SVGProps,
    useState,
} from 'react';
import Svg1 from '~/components/formations/8-way/blocks/1';
import Svg2 from '~/components/formations/8-way/blocks/2';
import Svg3 from '~/components/formations/8-way/blocks/3';
import Svg4 from '~/components/formations/8-way/blocks/4';
import Svg5 from '~/components/formations/8-way/blocks/5';
import Svg6 from '~/components/formations/8-way/blocks/6';
import Svg7 from '~/components/formations/8-way/blocks/7';
import Svg8 from '~/components/formations/8-way/blocks/8';
import Svg9 from '~/components/formations/8-way/blocks/9';
import Svg10 from '~/components/formations/8-way/blocks/10';
import Svg11 from '~/components/formations/8-way/blocks/11';
import Svg12 from '~/components/formations/8-way/blocks/12';
import Svg13 from '~/components/formations/8-way/blocks/13';
import Svg14 from '~/components/formations/8-way/blocks/14';
import Svg15 from '~/components/formations/8-way/blocks/15';
import Svg16 from '~/components/formations/8-way/blocks/16';
import Svg17 from '~/components/formations/8-way/blocks/17';
import Svg18 from '~/components/formations/8-way/blocks/18';
import Svg19 from '~/components/formations/8-way/blocks/19';
import Svg20 from '~/components/formations/8-way/blocks/20';
import Svg21 from '~/components/formations/8-way/blocks/21';
import Svg22 from '~/components/formations/8-way/blocks/22';
import A from '~/components/formations/8-way/randoms/A';
import B from '~/components/formations/8-way/randoms/B';
import C from '~/components/formations/8-way/randoms/C';
import D from '~/components/formations/8-way/randoms/D';
import E from '~/components/formations/8-way/randoms/E';
import F from '~/components/formations/8-way/randoms/F';
import G from '~/components/formations/8-way/randoms/G';
import H from '~/components/formations/8-way/randoms/H';
import J from '~/components/formations/8-way/randoms/J';
import K from '~/components/formations/8-way/randoms/K';
import L from '~/components/formations/8-way/randoms/L';
import M from '~/components/formations/8-way/randoms/M';
import N from '~/components/formations/8-way/randoms/N';
import O from '~/components/formations/8-way/randoms/O';
import P from '~/components/formations/8-way/randoms/P';
import Q from '~/components/formations/8-way/randoms/Q';
import { Discipline, type Formation } from '~/data/formations';
import { getFormationImageUrl } from '~/utils/utils';

interface Props extends SVGProps<SVGSVGElement> {
    formation: Formation;
}

function getFormationImage(props: Props): ReactNode {
    if (props.formation.discipline === Discipline.EIGHT_WAY) {
        switch (props.formation.id) {
            case 'A':
                return <A {...props} />;
            case 'B':
                return <B {...props} />;
            case 'C':
                return <C {...props} />;
            case 'D':
                return <D {...props} />;
            case 'E':
                return <E {...props} />;
            case 'F':
                return <F {...props} />;
            case 'G':
                return <G {...props} />;
            case 'H':
                return <H {...props} />;
            case 'J':
                return <J {...props} />;
            case 'K':
                return <K {...props} />;
            case 'L':
                return <L {...props} />;
            case 'M':
                return <M {...props} />;
            case 'N':
                return <N {...props} />;
            case 'O':
                return <O {...props} />;
            case 'P':
                return <P {...props} />;
            case 'Q':
                return <Q {...props} />;
            case '1':
                return <Svg1 {...props} />;
            case '2':
                return <Svg2 {...props} />;
            case '3':
                return <Svg3 {...props} />;
            case '4':
                return <Svg4 {...props} />;
            case '5':
                return <Svg5 {...props} />;
            case '6':
                return <Svg6 {...props} />;
            case '7':
                return <Svg7 {...props} />;
            case '8':
                return <Svg8 {...props} />;
            case '9':
                return <Svg9 {...props} />;
            case '10':
                return <Svg10 {...props} />;
            case '11':
                return <Svg11 {...props} />;
            case '12':
                return <Svg12 {...props} />;
            case '13':
                return <Svg13 {...props} />;
            case '14':
                return <Svg14 {...props} />;
            case '15':
                return <Svg15 {...props} />;
            case '16':
                return <Svg16 {...props} />;
            case '17':
                return <Svg17 {...props} />;
            case '18':
                return <Svg18 {...props} />;
            case '19':
                return <Svg19 {...props} />;
            case '20':
                return <Svg20 {...props} />;
            case '21':
                return <Svg21 {...props} />;
            case '22':
                return <Svg22 {...props} />;
        }
    } else if (props.formation.discipline === Discipline.FOUR_WAY) {
        return (
            <img
                className={props.className}
                alt="skydiving formation"
                src={getFormationImageUrl(props.formation)}
            />
        );
    }
}

const ROLE_TOOLTIPS: Record<string, string> = {
    P: 'Point',
    T: 'Tail',
    OF: 'Outside Front',
    IC: 'Inside Centre',
    OC: 'Outside Centre',
    IF: 'Inside Front',
    IR: 'Inside Rear',
    OR: 'Outside Rear',
};

export default function FormationImage(props: Props) {
    const [tooltip, setTooltip] = useState<string>();

    const showTooltip = (e: MouseEvent<HTMLDivElement>) => {
        if (!(e.target instanceof SVGPathElement)) {
            setTooltip(undefined);
            return;
        }

        const className = e.target.getAttribute('class')?.trim();
        const role = className
            ?.split(/\s+/)
            .find((token: string) => token in ROLE_TOOLTIPS);

        setTooltip(role ? ROLE_TOOLTIPS[role] : undefined);
    };

    const image = getFormationImage(props);

    return (
        <>
            <div className="h-1">{tooltip}</div>
            <div onClick={(e) => showTooltip(e)}>{image}</div>
        </>
    );
}
