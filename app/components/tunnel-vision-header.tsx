import { usePageStateContext } from '~/contexts/page-state';

export default function TunnelVisionHeader() {
    const { isFullScreen } = usePageStateContext();
    if (isFullScreen) {
        return null;
    }
    return (
        <div className="w-full navbar bg-linear-to-r from-base-200 to-base-300 flex justify-between">
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
                        src="/images/logos/tunnel-vision-text-only.png"
                        className="h-[64px]"
                        alt="tunnel vision"
                    />
                </div>
            </div>
            <div className="">
                <img
                    src="/images/logos/tunnel-vision-logo.png"
                    className="max-h-[64px]"
                    alt="tunnel vision logo - concentric circles"
                />
            </div>
        </div>
    );
}
