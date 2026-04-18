import { type ReactNode, useRef } from 'react';
import CookieHeader from '~/components/cookie-header';
import Sidebar, { type SidebarSession } from '~/components/sidebar';
import TunnelVisionHeader from '~/components/tunnel-vision-header';
import { usePageStateContext } from '~/contexts/page-state';
import { useSiteStateContext } from '~/contexts/site-state';
import { SiteType } from '~/utils/site-utils';
import type { Competition } from '../prisma/generated/client';

export default function Main({
    children,
    data,
}: {
    children: ReactNode;
    data?: {
        sessions: SidebarSession[];
        competitions: Competition[];
        isLocal: boolean;
    };
}) {
    const drawerRef = useRef<HTMLInputElement>(null);
    const { siteType, theme } = useSiteStateContext();
    const { isFullScreen } = usePageStateContext();

    return (
        <main
            data-theme={theme}
            className={`relative min-h-screen bg-white sm:flex sm:justify-center ${isFullScreen ? 'fullscreen' : ''}`}
        >
            <div className="drawer md:drawer-open">
                <input
                    id="drawer-toggle"
                    type="checkbox"
                    className="drawer-toggle"
                    ref={drawerRef}
                />
                <div className="drawer-content">
                    {siteType === SiteType.TUNNEL_VISION ? (
                        <TunnelVisionHeader />
                    ) : (
                        <CookieHeader isLocal={data?.isLocal || false} />
                    )}
                    <div className={`p-4`}>{children}</div>
                </div>
                <Sidebar
                    sessions={data?.sessions || []}
                    competitions={data?.competitions || []}
                    isLocal={data?.isLocal || false}
                    drawerRef={drawerRef}
                />
            </div>
        </main>
    );
}
