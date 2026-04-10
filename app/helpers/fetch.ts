import { iconUrls } from "~/stores/framacarte";

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

export async function fetchSvg(url: string): Promise<SVGElement> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch SVG: ${res.status}`);
  const text = await res.text();
  const parser = new DOMParser();
  return parser.parseFromString(text, "image/svg+xml")
    .documentElement as unknown as SVGElement;
}

export async function fetchIcons() {
  const [assosiations, breeding] = await Promise.all([
    fetchSvg(iconUrls.assosiations),
    fetchSvg(iconUrls.breeding),
  ]);

  return {
    assosiations,
    breeding,
  };
}
