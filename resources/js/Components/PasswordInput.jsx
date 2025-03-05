import React, { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function PasswordInput({ id, name, value, onChange, error }) {
    const [passwordType, setPasswordType] = useState("password");

    return (
        <div className="relative">
            <input
                id={id}
                name={name}
                type={passwordType}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-2 border rounded"
            />
            <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() =>
                    setPasswordType((prevType) =>
                        prevType === "password" ? "text" : "password"
                    )
                }
            >
                {passwordType === "password" ? (
                    <VisibilityOffIcon />
                ) : (
                    <VisibilityIcon />
                )}
            </div>
            {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>
    );
}
