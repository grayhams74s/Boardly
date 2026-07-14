import type { HTMLAttributes } from "react";

const Skeleton = ({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="skeleton"
    className={`animate-pulse rounded-md bg-gray-200 dark:bg-dark-tertiary ${className}`}
    {...props}
  />
);

export { Skeleton };
