export default function Error ({ error } : { error?: any }) {
  return (error)
    ? <div className="error">{error?.message ?? error}</div>
    : null
}
