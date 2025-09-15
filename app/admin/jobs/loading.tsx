export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-64 bg-muted animate-pulse rounded"></div>
          <div className="h-4 w-48 bg-muted animate-pulse rounded mt-2"></div>
        </div>
        <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <div className="space-y-4">
          <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
          <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
          <div className="h-10 w-full bg-muted animate-pulse rounded"></div>

          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-48 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
                  <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
                  <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
                  <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
