export function isLocalRequest(request: Request): boolean {
  const forwardedForHeader = request.headers.get('x-forwarded-for')
  return process.env.NODE_ENV === "development" || forwardedForHeader === null
}
