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
    showTooltip: boolean;
}

function getFormationImage(props: Props): ReactNode {
    const { formation, showTooltip, ...rest } = props;
    if (props.formation.discipline === Discipline.EIGHT_WAY) {
        switch (props.formation.id) {
            case 'A':
                return <A {...rest} />;
            case 'B':
                return <B {...rest} />;
            case 'C':
                return <C {...rest} />;
            case 'D':
                return <D {...rest} />;
            case 'E':
                return <E {...rest} />;
            case 'F':
                return <F {...rest} />;
            case 'G':
                return <G {...rest} />;
            case 'H':
                return <H {...rest} />;
            case 'J':
                return <J {...rest} />;
            case 'K':
                return <K {...rest} />;
            case 'L':
                return <L {...rest} />;
            case 'M':
                return <M {...rest} />;
            case 'N':
                return <N {...rest} />;
            case 'O':
                return <O {...rest} />;
            case 'P':
                return <P {...rest} />;
            case 'Q':
                return <Q {...rest} />;
            case '1':
                return <Svg1 {...rest} />;
            case '2':
                return <Svg2 {...rest} />;
            case '3':
                return <Svg3 {...rest} />;
            case '4':
                return <Svg4 {...rest} />;
            case '5':
                return <Svg5 {...rest} />;
            case '6':
                return <Svg6 {...rest} />;
            case '7':
                return <Svg7 {...rest} />;
            case '8':
                return <Svg8 {...rest} />;
            case '9':
                return <Svg9 {...rest} />;
            case '10':
                return <Svg10 {...rest} />;
            case '11':
                return <Svg11 {...rest} />;
            case '12':
                return <Svg12 {...rest} />;
            case '13':
                return <Svg13 {...rest} />;
            case '14':
                return <Svg14 {...rest} />;
            case '15':
                return <Svg15 {...rest} />;
            case '16':
                return <Svg16 {...rest} />;
            case '17':
                return <Svg17 {...rest} />;
            case '18':
                return <Svg18 {...rest} />;
            case '19':
                return <Svg19 {...rest} />;
            case '20':
                return <Svg20 {...rest} />;
            case '21':
                return <Svg21 {...rest} />;
            case '22':
                return <Svg22 {...rest} />;
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
            {props.showTooltip ? <div className="h-1">{tooltip}</div> : null}
            <div onClick={(e) => showTooltip(e)}>{image}</div>
        </>
    );
}
