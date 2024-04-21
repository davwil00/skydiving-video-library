export function isLocalRequest(request: Request): boolean {
  console.log("headers", request.headers)
  return process.env.NODE_ENV === "development"
}
