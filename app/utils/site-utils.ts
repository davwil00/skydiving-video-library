export enum SiteType {
    COOKIES = 'Team',
    SOLO = 'Solo',
    TUNNEL_VISION = 'TunnelVision',
}

export function getSiteType(hostname?: string): SiteType {
    switch (hostname) {
        case 'tunnel-vision.davwil00.co.uk':
            return SiteType.TUNNEL_VISION;
        case 'solo.davwil00.co.uk':
            return SiteType.SOLO;
        default:
            return SiteType.COOKIES;
    }
}
