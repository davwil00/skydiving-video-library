import { usePageStateContext } from '~/contexts/page-state';
import { useSiteStateDispatchContext } from '~/contexts/site-state';
import { SiteType } from '~/utils/site-utils';
import { SkydiverIcon } from './icons';

export default function CookieHeader(props: { isLocal: boolean }) {
    const { isFullScreen } = usePageStateContext();
    const dispatch = useSiteStateDispatchContext();
    const switchSite = () => {
        if (props.isLocal) {
            dispatch({
                type: 'setSiteState',
                value: SiteType.TUNNEL_VISION,
            });
        }
    };
    if (isFullScreen) {
        return null;
    }
    return (
        <div className="w-full navbar bg-base-200 flex justify-between">
            <div className="flex-none md:hidden">
                <label htmlFor="drawer-toggle" className="btn btn-square">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline-block w-6 h-6 stroke-current"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        ></path>
                    </svg>
                </label>
            </div>
            <div className="flex-1 hidden lg:block">
                <div className="flex-1">
                    <img
                        src="/images/logo-text.png"
                        className="h-[64px]"
                        alt="the words chocolate chip cookies written in a font that looks like the letters contains chocolate chips"
                    />
                </div>
            </div>
            <div onClick={switchSite}>
                <SkydiverIcon fill={'white'} />
            </div>
        </div>
    );
}
