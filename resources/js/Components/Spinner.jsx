function Spinner() {
    const spinnerSize = "h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6";
    const spinnerBorder = "border-4 border-white";
    const className = `animate-spin ${spinnerSize} ${spinnerBorder} rounded-full border-t-transparent`;
    return (
        <div className="flex items-center justify-center h-full">
            <div className={className}></div>
        </div>
    );
}

export default Spinner;
