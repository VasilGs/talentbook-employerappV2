export const BASE = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '/') // напр. "/company/"

export function url(path: string = '') {
  const clean = String(path).replace(/^\/+/, '') // маха водещите "/"
  return BASE + clean
}

// Удобни шорткъти
export const toDashboard = () => url('dashboard')
export const toJobs = (id: string | number) => url(`jobs/${id}`)

// Програмни пренасочвания
export function go(path: string) {
  window.location.assign(url(path))
}
export function replace(path: string) {
  window.location.replace(url(path))
}
