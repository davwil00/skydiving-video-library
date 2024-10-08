import { SVGProps } from "react";

interface SkydiverImgProps {
  svgProps?: SVGProps<SVGSVGElement>
  colour: string,
  className?: string
  id?: string
}

export function SkydiverImg(props: SkydiverImgProps) {
  const { colour, svgProps, className, id } = props;
  return (
    <div className={className} id={id}>
      <svg width="51mm" height="30mm" version="1.1" xmlns="http://www.w3.org/2000/svg" {...svgProps}>
        <g transform="translate(-42.897 -205.33)">
          <g id="FigureNCadre" transform="translate(211.04 35.593)">
            <g transform="matrix(-.009675 -2.5933 2.5233 -.0099436 -516.34 187.22)">
              <g stroke="#000">
                <path
                  d="m-14.87 166.26 4.8752 8.7398c-4.1781-0.016-8.3562-0.032-12.534-0.048l4.942-8.7021c0.90577-0.0119 1.8114-1e-5 2.7171 0.0104z"
                  fill={colour} strokeWidth=".71635px" />
                <path d="m-15.681 165.62 6.0577 9.2882 2.3141-3.3459-6.016-7.8278" strokeWidth=".9024" />
                <g>
                  <path transform="matrix(-.99997 -.0076684 -.0076684 .99997 -31.744 -.17339)"
                        d="m-20.004 164.49-5.6303-7.8254s-3.6896-2.6616-2.4021-7.7045c1.0541-4.1286-9.5715-14.155-9.6596-7.9201-0.13144 9.2975 0.20917 7.7174 3.3539 14.983s8.8104 15.604 8.8104 15.604z"
                        fill={colour} strokeWidth=".9024" />
                  <ellipse transform="matrix(3.1222 3.4582 -1.5357 1.6176 -112.82 -1004.2)" cx="187.86" cy="308.34"
                           rx=".49643" ry="2.835" strokeLinecap="round" strokeWidth=".31845" />
                </g>
                <path transform="translate(.54964 -.13517)"
                      d="m-17.321 165.75-6.1287 9.2415-2.2884-3.3636 6.0758-7.7815"
                      strokeWidth=".9024" />
                <g>
                  <path transform="translate(.54964 -.13517)"
                        d="m-20.004 164.49-5.6303-7.8254s-3.6896-2.6616-2.4021-7.7045c1.0541-4.1286-9.5715-14.155-9.6596-7.9201-0.13144 9.2975 0.20917 7.7174 3.3539 14.983s8.8104 15.604 8.8104 15.604z"
                        fill={colour} strokeWidth=".9024" />
                  <ellipse transform="matrix(-3.1486 3.4341 1.5232 1.6294 89.322 -1003.5)" cx="187.86" cy="308.34"
                           rx=".49643" ry="2.835" strokeLinecap="round" strokeWidth=".31845" />
                </g>
                <g transform="translate(-.030472 -.085734)">
                  <path transform="matrix(-.99997 -.0076684 -.0076684 .99997 -30.944 .035581)"
                        d="m-23.549 185.2 5.1907 8.3422s-9.4178 2.8788-10.086 3.8636-4.3082 12.665-4.3082 12.665l-2.0671 0.14405s1.4441-12.606 1.3016-14.969 9.9687-10.045 9.9687-10.045z"
                        fill={colour} strokeWidth="1.0263" />
                  <ellipse transform="matrix(3.8437 -1.1911 .8296 1.3119 -975.62 30.609)" cx="187.86" cy="308.34"
                           rx=".54044" ry="1.558" strokeLinecap="round" strokeWidth=".31845" />
                </g>
                <g>
                  <path transform="translate(-.25126 .067672)"
                        d="m-23.549 185.2 5.1907 8.3422s-9.4178 2.8788-10.086 3.8636-4.3082 12.665-4.3082 12.665l-2.0671 0.14405s1.4441-12.606 1.3016-14.969 9.9687-10.045 9.9687-10.045z"
                        fill={colour} strokeWidth="1.0263" />
                  <ellipse transform="matrix(-3.8345 -1.2206 -.83964 1.3055 944.17 37.885)" cx="187.86" cy="308.34"
                           rx=".54044" ry="1.558" strokeLinecap="round" strokeWidth=".31845" />
                </g>
                <path
                  d="m-19.237 173.69h5.6406c2.6785 0 4.9367 1.3807 4.9367 3.845v11.12c0 2.4642-4.433 8.896-7.5745 8.896-3.1415 0-7.5963-4.6493-7.7357-8.896v-11.12c0-2.4642 2.0544-3.845 4.7329-3.845z"
                  fill={colour} fillRule="evenodd" strokeLinecap="round" strokeWidth=".96433" />
                <path
                  d="m-16.326 190.61c11.215 0.0785 4.5331 14.296-0.10289 14.245-4.636-0.0509-11.112-14.323 0.10289-14.245z"
                  fillRule="evenodd" strokeLinecap="round" strokeWidth=".51304" />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
