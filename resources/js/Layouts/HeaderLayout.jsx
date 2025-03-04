import { Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { fetchUserId } from "../Components/UserToken";
import axios from "axios";

export default function HeaderLayout() {
    const [isOpen, setIsOpen] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        fetchUserId(setUserId);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLogout = async () => {
        if (!window.confirm("ログアウトしてもよろしいですか？")) {
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            console.error("トークンが存在しません。");
            return;
        }

        try {
            await axios.post("/api/logout", { token });
            localStorage.removeItem("token");
            setUserId(null);
        } catch (error) {
            console.error("ログアウト処理中にエラーが発生しました:", error);
        }
    };

    return (
        <div className="bg-gray-100">
            <nav className="bg-customPeach border-b border-gray-100">
                <div className="mx-auto max-w-8xl px-3 sm:px-3 md:px-5 lg:px-6">
                    <div className="flex justify-between items-center sm:h-16 md:h-20 lg:h-24">
                        <Link
                            href="/"
                            className="text-gray-800 text-sm sm:text-sm md:text-base lg:text-lg"
                        >
                            うまマップ
                        </Link>

                        <div className="hidden sm:flex sm:items-center">
                            {userId ? (
                                <>
                                    <NavItem
                                        href="/"
                                        label="店舗検索"
                                        img="/img/header/shop.png"
                                    />
                                    <VerticalDivider />
                                    <NavItem
                                        href="/history"
                                        label="うまー！履歴"
                                        img="/img/header/uma.png"
                                    />
                                    <VerticalDivider />
                                    <button
                                        onClick={handleLogout}
                                        className="flex flex-col items-center text-gray-800 text-sm sm:text-sm md:text-base lg:text-lg px-3 py-1.5"
                                    >
                                        <img
                                            src="/img/header/logout.png"
                                            alt="ログアウト"
                                            className="h-5 sm:h-5 md:h-6 lg:h-8"
                                        />
                                        <span>ログアウト</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <NavItem
                                        href="/login"
                                        label="ログイン"
                                        img="/img/header/login.png"
                                    />
                                    <VerticalDivider />
                                    <NavItem
                                        href="/register"
                                        label="新規登録"
                                        img="/img/header/register.png"
                                    />
                                    <VerticalDivider />
                                    <NavItem
                                        href="/"
                                        label="店舗検索"
                                        img="/img/header/shop.png"
                                    />
                                    <VerticalDivider />
                                    <NavItem
                                        href="/history"
                                        label="うまー！履歴"
                                        img="/img/header/uma.png"
                                    />
                                </>
                            )}
                        </div>

                        <div className="sm:hidden">
                            <button onClick={toggleMenu} className="p-1.5">
                                {isOpen ? "✖" : "☰"}
                            </button>
                        </div>
                    </div>
                </div>

                {isOpen && (
                    <div className="bg-white sm:hidden p-2 sm:p-2 md:p-3 lg:p-4">
                        {userId ? (
                            <>
                                <NavItem
                                    href="/"
                                    label="店舗検索"
                                    img="/img/header/shop.png"
                                />
                                <HorizontalDivider />
                                <NavItem
                                    href="/history"
                                    label="うまー！履歴"
                                    img="/img/header/uma.png"
                                />
                                <HorizontalDivider />
                                <button
                                    onClick={handleLogout}
                                    className="flex flex-col items-center justify-center w-full text-center text-gray-800 text-sm sm:text-sm md:text-base lg:text-lg px-3 py-1.5"
                                >
                                    <img
                                        src="/img/header/logout.png"
                                        alt="ログアウト"
                                        className="h-5 sm:h-5 md:h-6 lg:h-8"
                                    />
                                    <span>ログアウト</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <NavItem
                                    href="/login"
                                    label="ログイン"
                                    img="/img/header/login.png"
                                />
                                <HorizontalDivider />
                                <NavItem
                                    href="/register"
                                    label="新規登録"
                                    img="/img/header/register.png"
                                />
                                <HorizontalDivider />
                                <NavItem
                                    href="/"
                                    label="店舗検索"
                                    img="/img/header/shop.png"
                                />
                                <HorizontalDivider />
                                <NavItem
                                    href="/history"
                                    label="うまー！履歴"
                                    img="/img/header/uma.png"
                                />
                            </>
                        )}
                    </div>
                )}
            </nav>
        </div>
    );
}

function NavItem({ href, label, img }) {
    return (
        <Link
            href={href}
            className="flex flex-col items-center text-gray-800 text-sm sm:text-sm md:text-base lg:text-lg px-3 py-1.5"
        >
            <img src={img} alt={label} className="h-5 sm:h-5 md:h-6 lg:h-8" />
            <span>{label}</span>
        </Link>
    );
}

function VerticalDivider() {
    return (
        <div className="h-5 sm:h-5 md:h-6 lg:h-8 border-2 border-white mx-1.5"></div>
    );
}

function HorizontalDivider() {
    return <div className="w-full border-t-2 border-gray-200 my-1.5"></div>;
}
