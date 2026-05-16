export enum SiteType {
    COOKIES = 'Cookies',
    SOLO = 'Solo',
    TUNNEL_VISION = 'TunnelVision',
}

export function getSiteType(request: Request): SiteType {
    const hostname = new URL(request.url).hostname;
    switch (hostname) {
        case 'tunnel-vision.davwil00.co.uk':
        case 'tunnel.vision':
            return SiteType.TUNNEL_VISION;
        case 'skydiving-solo.davwil00.co.uk':
            return SiteType.SOLO;
        default:
            return SiteType.COOKIES;
    }
}
