const Skeleton = () => {
    return (
        <div className="animate-pulse">
            <div className="bg-dark h-6 w-1/2 mb-4 rounded"></div>
            <div className="bg-dark h-4 w-1/3 mb-2 rounded"></div>
            <div className="bg-gray-700 h-4 w-1/4 mb-2 rounded"></div>
            <div className="bg-gray-700 h-4 w-1/2 mb-4 rounded"></div>
            <div className="bg-gray-700 h-6 w-full mb-4 rounded"></div>
            <div className="bg-gray-700 h-4 w-1/3 mb-2 rounded"></div>
            <div className="bg-gray-700 h-4 w-1/4 mb-2 rounded"></div>
            <div className="bg-gray-700 h-4 w-1/2 mb-4 rounded"></div>
        </div>
    );
};

export default Skeleton; 