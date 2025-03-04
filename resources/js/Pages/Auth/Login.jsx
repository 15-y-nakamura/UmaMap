import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import HeaderLayout from "../../Layouts/HeaderLayout";
import Spinner from "../../Components/Spinner";
import PasswordInput from "../../Components/PasswordInput";

export default function Login() {
    const [data, setData] = useState({
        userId: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 入力フィールドの値を更新する
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        try {
            const response = await axios.post("/api/login", data);
            if (response.status === 200) {
                localStorage.setItem("token", response.data.token);
                window.location.href = "/";
            }
        } catch (error) {
            setErrors({ login: error.response.data.errors });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/img/login/login_bg.png')" }}
        >
            <HeaderLayout />
            <div className="flex items-center justify-center min-h-screen bg-gray-100 bg-opacity-75">
                <Head title="ログイン" />
                <div className="w-full p-6 bg-white rounded shadow-md sm:max-w-sm sm:p-6 md:max-w-md md:p-8 lg:max-w-lg lg:p-10">
                    <h1 className="mb-6 text-xl font-bold text-center sm:text-xl md:text-2xl lg:text-3xl">
                        ログイン
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700"
                                htmlFor="userId"
                            >
                                ユーザーID
                            </label>
                            <input
                                id="userId"
                                name="userId"
                                type="text"
                                value={data.userId}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded"
                            />
                            {errors.userId && (
                                <p className="mt-2 text-red-500">
                                    {errors.userId[0]}
                                </p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700"
                                htmlFor="password"
                            >
                                パスワード
                            </label>
                            <PasswordInput
                                value={data.password}
                                onChange={handleChange}
                                error={errors.password && errors.password[0]}
                            />
                        </div>
                        {errors.login && (
                            <p className="mb-4 text-red-500">{errors.login}</p>
                        )}
                        <div className="flex flex-col items-center">
                            <button
                                type="submit"
                                className="flex items-center justify-center px-4 py-2 mb-4 text-white bg-orange-500 rounded"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Spinner /> : "ログイン"}
                            </button>
                            <div className="w-full mb-4 border-t border-gray-300"></div>
                            <a href="/register" className="text-blue-500">
                                新規登録はこちら
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
