import { Discipline, Formation } from '~/data/formations'
import A from '~/components/formations/8-way/randoms/A'
import B from '~/components/formations/8-way/randoms/B'
import C from '~/components/formations/8-way/randoms/C'
import D from '~/components/formations/8-way/randoms/D'
import E from '~/components/formations/8-way/randoms/E'
import F from '~/components/formations/8-way/randoms/F'
import G from '~/components/formations/8-way/randoms/G'
import H from '~/components/formations/8-way/randoms/H'
import J from '~/components/formations/8-way/randoms/J'
import K from '~/components/formations/8-way/randoms/K'
import L from '~/components/formations/8-way/randoms/L'
import M from '~/components/formations/8-way/randoms/M'
import N from '~/components/formations/8-way/randoms/N'
import O from '~/components/formations/8-way/randoms/O'
import P from '~/components/formations/8-way/randoms/P'
import Q from '~/components/formations/8-way/randoms/Q'
import { SVGProps } from 'react'

interface Props extends SVGProps<SVGSVGElement> {
    formation: Formation
}
export default function FormationImage (props: Props) {
    if (props.formation.discipline === Discipline.EIGHT_WAY) {
        switch (props.formation.id) {
            case 'A':
                return <A {...props} />
            case 'B':
                return <B {...props} />
            case 'C':
                return <C {...props} />
            case 'D':
                return <D {...props} />
            case 'E':
                return <E {...props} />
            case 'F':
                return <F {...props} />
            case 'G':
                return <G {...props} />
            case 'H':
                return <H {...props} />
            case 'J':
                return <J {...props} />
            case 'K':
                return <K {...props} />
            case 'L':
                return <L {...props} />
            case 'M':
                return <M {...props} />
            case 'N':
                return <N {...props} />
            case 'O':
                return <O {...props} />
            case 'P':
                return <P {...props} />
            case 'Q':
                return <Q {...props} />
        }
    }
    return null
}