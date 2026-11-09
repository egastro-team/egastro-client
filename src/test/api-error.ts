import { AxiosError, AxiosHeaders } from 'axios'

/** Builds the AxiosError the api client throws for a backend error response. */
export function apiError(
  status: number,
  message: string,
  fieldErrors?: { field: string; message: string }[],
  url = '/test',
) {
  const config = { url, headers: new AxiosHeaders() }
  return new AxiosError('Request failed', String(status), config, null, {
    status,
    statusText: '',
    headers: {},
    config,
    data: { timestamp: '2026-10-25T10:00:00Z', status, message, path: url, fieldErrors },
  })
}
