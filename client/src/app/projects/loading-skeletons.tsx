import { Skeleton } from "@/app/(components)/ui/skeleton";

const LoadingRegion = ({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={className}
    role="status"
    aria-busy="true"
    aria-label={label}
  >
    {children}
    <span className="sr-only">{label}</span>
  </div>
);

const ViewHeaderSkeleton = () => (
  <div className="flex items-center justify-between py-5">
    <Skeleton className="h-6 w-32" />
    <Skeleton className="h-9 w-28" />
  </div>
);

export const BoardViewSkeleton = () => (
  <LoadingRegion
    label="Loading board tasks"
    className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4"
  >
    {Array.from({ length: 4 }).map((_, columnIndex) => (
      <div
        key={columnIndex}
        className="rounded-md bg-gray-50 p-3 dark:bg-dark-secondary"
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-6 rounded-full" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: columnIndex === 1 ? 3 : 2 }).map(
            (_, cardIndex) => (
              <div
                key={cardIndex}
                className="rounded-md border border-gray-200 bg-white p-4 shadow-sm dark:border-stroke-dark dark:bg-dark-bg"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-6 w-6" />
                </div>
                <Skeleton className="mt-4 h-4 w-4/5" />
                <Skeleton className="mt-2 h-3 w-full" />
                <Skeleton className="mt-1.5 h-3 w-2/3" />
                <Skeleton className="mt-4 h-3 w-32" />
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-stroke-dark">
                  <Skeleton className="h-7 w-7 rounded-full" />
                  <Skeleton className="h-4 w-14" />
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    ))}
  </LoadingRegion>
);

export const ListViewSkeleton = () => (
  <LoadingRegion
    label="Loading task list"
    className="px-4 pb-8 xl:px-6"
  >
    <ViewHeaderSkeleton />
    <div className="overflow-hidden rounded-md border border-gray-200 bg-white dark:border-stroke-dark dark:bg-dark-secondary">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 border-b border-gray-100 p-4 last:border-b-0 dark:border-stroke-dark"
        >
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="mt-2 h-3 w-3/4" />
          </div>
          <Skeleton className="hidden h-6 w-20 sm:block" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  </LoadingRegion>
);

export const TableViewSkeleton = () => (
  <LoadingRegion
    label="Loading task table"
    className="w-full px-4 pb-8 xl:px-6"
  >
    <ViewHeaderSkeleton />
    <div className="overflow-hidden rounded-md border border-gray-200 bg-white dark:border-stroke-dark dark:bg-dark-secondary">
      <div className="grid h-12 grid-cols-5 items-center gap-5 border-b border-gray-200 bg-gray-50 px-4 dark:border-stroke-dark dark:bg-dark-tertiary">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-3 w-16" />
        ))}
      </div>
      {Array.from({ length: 6 }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid h-[52px] grid-cols-5 items-center gap-5 border-b border-gray-100 px-4 last:border-b-0 dark:border-stroke-dark"
        >
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  </LoadingRegion>
);

export const TimelineViewSkeleton = () => (
  <LoadingRegion
    label="Loading task timeline"
    className="px-4 pb-8 xl:px-6"
  >
    <div className="flex items-center justify-between py-5">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-10 w-64" />
    </div>
    <div className="overflow-hidden rounded-md border border-blue-100 bg-white shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
      <div className="flex h-12 items-center gap-6 border-b border-blue-100 bg-blue-50/60 px-4 dark:border-stroke-dark dark:bg-dark-tertiary">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="grid grid-cols-[140px_1fr]">
        <div className="border-r border-blue-100 dark:border-stroke-dark">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex h-12 items-center border-b border-blue-100 px-3 last:border-b-0 dark:border-stroke-dark"
            >
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
        <div className="space-y-6 px-6 py-5">
          {["w-2/5", "ml-[12%] w-1/2", "ml-[4%] w-1/3", "ml-[25%] w-2/5", "ml-[8%] w-3/5"].map(
            (width, index) => (
              <Skeleton
                key={index}
                className={`h-5 rounded-full bg-blue-200 dark:bg-blue-500/40 ${width}`}
              />
            ),
          )}
        </div>
      </div>
      <div className="px-4 py-4">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  </LoadingRegion>
);
