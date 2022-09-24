import { Reducer, useReducer } from 'react'

type State<T> = {
  pending: boolean,
  error: null | Error,
  data: T | null
}

type Action<T> = {
  type: 'request' | 'error' | 'success',
  payload?: T,
  error?: Error
}

function reducer<T> (state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'request':
      return { data: state.data, pending: true, error: null }
    case 'error':
      return { data: state.data, pending: false, error: action.error ?? null }
    case 'success':
      return { data: action.payload ?? null, pending: false, error: null }
    default:
      throw new Error(`Invalid action type: ${action.type}`)
  }
}

async function _retrieve<T> (url: string, query?: Record<string, any>): Promise<T> {
  const params = new URLSearchParams(query)
  const response = await fetch(`${url}?${params.toString()}`)
  const data = await response.json() as T
  return data
}

async function _create<T> (url: string, data: any): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (res.status >= 500) throw new Error(res.statusText)
  const resource = await res.json() as T
  return resource
}

async function _update<T> (url: string, data: any): Promise<T> {
  const res = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (res.status >= 500) throw new Error(res.statusText)
  const resource = await res.json() as T
  return resource
}

async function _delete<T> (url: string): Promise<T> {
  const res = await fetch(url, {
    method: 'DELETE'
  })
  if (res.status >= 500) throw new Error(res.statusText)
  const resource = await res.json() as T
  return resource
}

export function useEndpoint<T> (url: string, initialState?: Partial<State<T>>) {
  const initial: State<T> = {
    data: null,
    pending: false,
    error: null,
    ...initialState
  }
  const [state, dispatch] = useReducer<Reducer<State<T>, Action<T>>>(reducer, initial)

  async function workflow (promise: Promise<T>): Promise<void> {
    dispatch({ type: 'request' })
    try {
      const payload = await promise
      dispatch({ type: 'success', payload })
    } catch (error) {
      dispatch({ type: 'error', error: error as Error })
    }
  }
  return {
    state,
    retrieve: (query?: Record<string, any>) => workflow(_retrieve<T>(url, query)),
    create: (data: any) => workflow(_create<T>(url, data)),
    update: (data: any) => workflow(_update<T>(url, data)),
    delete: () => workflow(_delete<T>(url))
  }
}

export function withEndpoint<T> (url: string) {
  const endpoint = url.startsWith('/api') ? `http://localhost:3000${url}` : url
  return {
    retrieve: (query?: Record<string, any>) => _retrieve<T>(endpoint, query),
    create: (data: any) => _create<T>(url, data),
    update: (data: any) => _update<T>(url, data),
    delete: () => _delete<T>(url)
  }
}
