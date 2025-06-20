export function SkeletonTable({ className }: { className?: string }) {
    // Simple Skeleton component for loading states
    return <div className={`bg-gray-200 animate-pulse ${className}`} />;
}
