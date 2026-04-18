import { type ReactNode, useRef } from 'react';
import CookieHeader from '~/components/cookie-header';
import Sidebar, { type SidebarSession } from '~/components/sidebar';
import TunnelVisionHeader from '~/components/tunnel-vision-header';
import { usePageStateContext } from '~/contexts/page-state';
import { SiteType } from '~/utils/site-utils';
import type { Competition } from '../prisma/generated/client';
import { LibraryStateProvider } from './contexts/library-state';

export default function Main({
    children,
    data,
}: {
    children: ReactNode;
    data?: {
        sessions: SidebarSession[];
        competitions: Competition[];
        isLocal: boolean;
        siteType: SiteType;
    };
}) {
    const drawerRef = useRef<HTMLInputElement>(null);

    const { isFullScreen } = usePageStateContext();
    return (
        <main
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
                    {data?.siteType === SiteType.TUNNEL_VISION ? (
                        <TunnelVisionHeader />
                    ) : (
                        <CookieHeader />
                    )}
                    <div className={`p-4`}>{children}</div>
                </div>
                <LibraryStateProvider siteType={data?.siteType}>
                    <Sidebar
                        sessions={data?.sessions || []}
                        competitions={data?.competitions || []}
                        isLocal={data?.isLocal || false}
                        drawerRef={drawerRef}
                    />
                </LibraryStateProvider>
            </div>
        </main>
    );
}
