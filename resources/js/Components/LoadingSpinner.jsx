import React from "react";
import Spinner from "./Spinner";

export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center h-screen">
            <Spinner size="h-12 w-12" color="border-orange-400" />
        </div>
    );
}
