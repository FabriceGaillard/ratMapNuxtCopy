export default async function fetch(
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> {
  const response = await globalThis.fetch(input, init);
  if (!response.ok) {
    throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
  }
  return response;
}
