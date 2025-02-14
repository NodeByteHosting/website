const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="p-6 relative shadow bg-dark_gray rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between animate-pulse">
                <div className="h-6 bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded"></div>
            </div>
        ))}
    </div>
);

export default LoadingSkeleton;