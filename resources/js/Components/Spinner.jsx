import React from "react";

function Spinner({
    size = "h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6",
    color = "border-white",
}) {
    const spinnerBorder = "border-4";
    const className = `animate-spin ${size} ${spinnerBorder} ${color} rounded-full border-t-transparent`;
    return (
        <div className="flex items-center justify-center h-full">
            <div className={className}></div>
        </div>
    );
}

export default Spinner;
