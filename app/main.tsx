import Navbar from '~/components/navbar'
import Sidebar from '~/components/sidebar'
import { usePageStateContext } from '~/contexts/page-state'
import { useRef } from 'react'
import { Session } from '@prisma/client'
import { type ReactNode } from 'react'

export default function Main({children, data}: { children: ReactNode, data?: { sessions: Session[], isLocal: boolean } }) {
    const drawerRef = useRef<HTMLInputElement>(null);

    const {isFullScreen} = usePageStateContext()
    return (
        <main
            className={`relative min-h-screen bg-white sm:flex sm:justify-center ${isFullScreen ? 'fullscreen' : ''}`}>
            <div className="drawer md:drawer-open">
                <input id="drawer-toggle" type="checkbox" className="drawer-toggle" ref={drawerRef}/>
                <div className="drawer-content">
                    <Navbar/>
                    <div className={`p-4`}>
                        {children}
                    </div>
                </div>
                <Sidebar sessions={data?.sessions || []} isLocal={data?.isLocal || false} drawerRef={drawerRef}/>
            </div>
        </main>
    )
}
