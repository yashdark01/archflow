export default function EditorLoading() {
  return (
    <div className="flex h-full min-h-[50vh] flex-col gap-4 p-4">
      <div className="h-14 animate-pulse rounded-md bg-surface-muted" />
      <div className="flex flex-1 gap-4 min-h-0">
        <div className="hidden w-72 animate-pulse rounded-md bg-surface-muted lg:block" />
        <div className="flex-1 animate-pulse rounded-md bg-surface-muted" />
        <div className="hidden w-80 animate-pulse rounded-md bg-surface-muted lg:block" />
      </div>
    </div>
  );
}
