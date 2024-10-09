export default function BridgeSkelton() {
  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <TransactionSectionSkeleton />
        <div className="flex justify-center">
          <div className="h-6 w-6 bg-zinc-800 rounded" />
        </div>
        <TransactionSectionSkeleton />
        <div className="flex justify-between">
          <div className="h-4 w-40 bg-zinc-800 rounded" />
          <div className="h-4 w-12 bg-zinc-800 rounded" />
          <div className="h-4 w-28 bg-zinc-800 rounded" />
        </div>
        <div className="flex justify-center">
          <div className="h-4 w-48 bg-zinc-800 rounded" />
        </div>
      </div>
    </div>
  )
}

function TransactionSectionSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="h-6 w-16 bg-zinc-800 rounded" />
        <div className="h-9 w-36 bg-zinc-800 rounded" />
      </div>
      <div className="bg-zinc-900 rounded-lg p-4 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-zinc-800 rounded-full" />
          <div className="flex-grow h-9 bg-zinc-800 rounded" />
        </div>
        <div className="h-9 bg-zinc-800 rounded" />
        <div className="flex justify-between items-center">
          <div className="h-9 w-3/4 bg-zinc-800 rounded" />
          <div className="h-9 w-16 bg-zinc-800 rounded" />
        </div>
      </div>
    </div>
  )
}
