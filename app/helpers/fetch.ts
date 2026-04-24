import { iconUrls } from "~/stores/framacarte";
import DOMPurify from "dompurify";

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
  const text = await res.text();

  const clean = DOMPurify.sanitize(text, {
    USE_PROFILES: { svg: true, svgFilters: true },
  });

  const parser = new DOMParser();
  return parser.parseFromString(clean, "image/svg+xml")
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
