import { Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function HeaderLayout() {
    const [isOpen, setIsOpen] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const response = await axios.post("/api/user-token", {
                        token,
                    });
                    setUserId(response.data.user_id);
                } catch (error) {
                    console.error(
                        "ユーザーIDの取得中にエラーが発生しました:",
                        error
                    );
                }
            } else {
                console.log("トークンが見つかりませんでした。");
            }
        };

        fetchUserId();
    }, []);

    // ハンバーガーメニューを開いたり閉じたりする関数
    const toggleMenu = () => setIsOpen(!isOpen);

    // ログアウト処理
    const handleLogout = async () => {
        const token = localStorage.getItem("token"); // ローカルストレージからトークン取得

        if (!token) {
            console.error("トークンが存在しません。");
            return;
        }

        try {
            await axios.post("/api/logout", { token }); // トークンをAPIに送信
            localStorage.removeItem("token"); // ローカルストレージから削除
            setUserId(null);
        } catch (error) {
            console.error("ログアウト処理中にエラーが発生しました:", error);
        }
    };

    return (
        <div className="bg-gray-100">
            <nav className="border-b border-gray-100 bg-customPeach">
                <div className="mx-auto max-w-8xl px-6 sm:px-8 lg:px-10">
                    <div className="flex h-24 justify-between items-center">
                        <Link href="/" className="text-lg text-gray-800">
                            うまマップ
                        </Link>

                        {/* PC用のナビゲーションメニュー */}
                        <div className="hidden sm:flex sm:items-center">
                            {userId ? (
                                <>
                                    <NavItem
                                        href="/"
                                        label="店舗検索"
                                        img="/img/header/home.png"
                                    />
                                    <VerticalDivider />
                                    <NavItem
                                        href="/history"
                                        label="うまー！履歴"
                                        img="/img/common/uma.png"
                                    />
                                    <VerticalDivider />
                                    <button
                                        onClick={handleLogout}
                                        className="text-lg text-gray-800 px-4 py-2 flex flex-col items-center"
                                    >
                                        <img
                                            src="/img/header/logout.png"
                                            alt="ログアウト"
                                            className="h-8"
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
                                        img="/img/header/home.png"
                                    />
                                    <VerticalDivider />
                                    <NavItem
                                        href="/history"
                                        label="うまー！履歴"
                                        img="/img/common/uma.png"
                                    />
                                </>
                            )}
                        </div>

                        {/* スマホ用のハンバーガーメニュー */}
                        <div className="sm:hidden">
                            <button onClick={toggleMenu} className="p-2">
                                {isOpen ? "✖" : "☰"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* スマホ用メニュー（開いているときだけ表示） */}
                {isOpen && (
                    <div className="sm:hidden bg-white p-4">
                        {userId ? (
                            <>
                                <NavItem
                                    href="/"
                                    label="店舗検索"
                                    img="/img/header/home.png"
                                />
                                <VerticalDivider />
                                <NavItem
                                    href="/history"
                                    label="うまー！履歴"
                                    img="/img/common/uma.png"
                                />
                                <VerticalDivider />
                                <button
                                    onClick={handleLogout}
                                    className="text-lg text-gray-800 px-4 py-2 flex flex-col items-center"
                                >
                                    <img
                                        src="/img/header/logout.png"
                                        alt="ログアウト"
                                        className="h-8"
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
                                    img="/img/header/home.png"
                                />
                                <VerticalDivider />
                                <NavItem
                                    href="/history"
                                    label="うまー！履歴"
                                    img="/img/common/uma.png"
                                />
                            </>
                        )}
                    </div>
                )}
            </nav>
        </div>
    );
}

// メニューの項目
function NavItem({ href, label, img }) {
    return (
        <Link
            href={href}
            className="text-lg text-gray-800 px-4 py-2 flex flex-col items-center"
        >
            <img src={img} alt={label} className="h-8" />
            <span>{label}</span>
        </Link>
    );
}

// メニューの間に入れる縦線
function VerticalDivider() {
    return <div className="h-8 border-2 border-white mx-2"></div>;
}
