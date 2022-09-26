export default function OfflineView () {
  return (
    <div className="offline-view grid h-full place-content-center p-8 gap-1">
      <h1 className="text-2xl">You are <strong>offline</strong></h1>
      <p>This page is not cached. Refresh once connection is restored.</p>
    </div>
  )
}
