export function createUrl(baseUrl: string, path: string) {
  return new URL(path, baseUrl).toString();
}
