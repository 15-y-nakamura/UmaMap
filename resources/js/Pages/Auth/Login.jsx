import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import HeaderLayout from "../../Layouts/HeaderLayout";

export default function Login() {
    // フォームの状態管理
    const [data, setData] = useState({
        userId: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 入力変更時の処理
    const handleChange = (e) => {
        setData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    // フォーム送信時の処理
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        try {
            const response = await axios.post("/api/login", data);
            if (response.status == 200) {
                // ログイン成功時にトークンをローカルストレージに保存
                localStorage.setItem("token", response.data.token);
                window.location.href = "/"; // ログイン成功後のリダイレクト
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
            <div className="flex justify-center items-center min-h-screen bg-gray-100 bg-opacity-75">
                <Head title="ログイン" />
                <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
                    <h1 className="text-2xl font-bold mb-6 text-center">
                        ログイン
                    </h1>
                    <form onSubmit={handleSubmit}>
                        {["userId", "password"].map((name) => (
                            <div className="mb-4" key={name}>
                                <label
                                    className="block text-gray-700"
                                    htmlFor={name}
                                >
                                    {name == "userId"
                                        ? "ユーザーID"
                                        : "パスワード"}
                                </label>
                                <input
                                    id={name}
                                    name={name}
                                    type={
                                        name == "password" ? "password" : "text"
                                    }
                                    value={data[name]}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded"
                                />
                                {errors[name] && (
                                    <p className="text-red-500 mt-2">
                                        {errors[name][0]}
                                    </p>
                                )}
                            </div>
                        ))}
                        {errors.login && (
                            <p className="text-red-500 mb-4">{errors.login}</p>
                        )}
                        <div className="flex flex-col items-center">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-orange-500 text-white rounded mb-4 flex justify-center items-center"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <div
                                        className="animate-spin h-6 w-6 border-4 border-white rounded-full border-t-transparent"
                                        aria-label="読み込み中"
                                    ></div>
                                ) : (
                                    "ログイン"
                                )}
                            </button>
                            <div className="w-full border-t border-gray-300 mb-4"></div>
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
