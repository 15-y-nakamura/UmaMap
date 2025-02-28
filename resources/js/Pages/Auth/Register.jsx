import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";

export default function Register() {
    // フォームの状態管理
    const [data, setData] = useState({
        userId: "",
        nickname: "",
        email: "",
        password: "",
        password_confirmation: "",
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
        setErrors({}); // 既存のエラーをクリア
        setIsSubmitting(true);

        try {
            const response = await axios.post("/api/register", data);
            // 新規登録成功時にトークンをローカルストレージに保存
            localStorage.setItem("token", response.data.token);
            window.location.href = "/"; // 登録成功後リダイレクト
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // 入力フィールドの設定
    const fields = [
        { name: "userId", label: "ユーザーID", type: "text" },
        { name: "nickname", label: "ニックネーム", type: "text" },
        { name: "email", label: "メールアドレス", type: "email" },
        { name: "password", label: "パスワード", type: "password" },
        {
            name: "password_confirmation",
            label: "パスワード確認",
            type: "password",
        },
    ];

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Head title="新規登録" />
            <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    新規登録
                </h1>
                <form onSubmit={handleSubmit}>
                    {fields.map(({ name, label, type }) => (
                        <div className="mb-4" key={name}>
                            <label
                                className="block text-gray-700"
                                htmlFor={name}
                            >
                                {label}
                            </label>
                            <input
                                id={name}
                                name={name}
                                type={type}
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
                                "新規登録"
                            )}
                        </button>
                        <a href="/login" className="text-blue-500">
                            ログインはこちら
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
