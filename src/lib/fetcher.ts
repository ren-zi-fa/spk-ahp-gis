export async function fetcher<T>(
  ...args: Parameters<typeof fetch>
): Promise<T> {
  const res = await fetch(...args);

  if (!res.ok) {
    throw new Error("Failed to fetch");
  }

  const json = await res.json();

  if (!json.data) {
    throw new Error("Response does not contain data field");
  }

  return json.data as T;
}