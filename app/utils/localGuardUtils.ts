export function isLocalRequest(request: Request): boolean {
  const cfConnectingIp = request.headers.get('CF-Connecting-IP')
  return process.env.NODE_ENV === "development" || cfConnectingIp === null
}
