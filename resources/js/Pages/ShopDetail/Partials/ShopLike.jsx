import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../../Components/Spinner";
import { fetchUserId } from "../../../Components/UserToken";

export default function ShopLike({ shopId }) {
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    // 店舗の「うまー！」数を取得する
    const checkShopLike = async () => {
        try {
            const response = await axios.get(`/api/shops/${shopId}/like`);
            setLikeCount(response.data.like_count);
        } catch (error) {
            if (error.response?.status === 404) {
                setLikeCount(0);
            } else {
                console.error(
                    "うまー！情報の取得中にエラーが発生しました:",
                    error
                );
            }
        }
    };

    // ログイン中のユーザーが店舗を「うまー！」しているか確認する
    const checkUserLike = async (userId) => {
        if (!userId) return;

        try {
            const response = await axios.get(`/api/users/${userId}/likes`);
            const likedShops = response.data;
            const isShopLiked = likedShops.some((shop) => shop.id === shopId);
            setIsLiked(isShopLiked);
        } catch (error) {
            console.error(
                "ユーザーのうまー！情報の取得中にエラーが発生しました:",
                error
            );
        }
    };

    useEffect(() => {
        const initialize = async () => {
            await fetchUserId(setUserId);
            await checkShopLike();
            if (userId) {
                await checkUserLike(userId);
            }
            setLoading(false);
        };
        initialize();
    }, [shopId, userId]);

    // 「うまー！」ボタンのクリック処理
    const handleLike = async () => {
        setLoading(true);

        try {
            if (isLiked) {
                await axios.delete(`/api/shops/${shopId}/like`);
                await axios.delete(`/api/users/${userId}/likes/${shopId}`);
                setLikeCount((prev) => prev - 1);
                setIsLiked(false);
            } else {
                await axios.put(`/api/shops/${shopId}/like`);
                await axios.post(`/api/users/${userId}/likes`, {
                    user_id: userId,
                    shop_id: shopId,
                });
                setLikeCount((prev) => prev + 1);
                setIsLiked(true);
            }
        } catch (error) {
            console.error("うまー！処理中にエラーが発生しました:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center mb-3 sm:mb-4">
            {loading ? (
                <Spinner color="border-orange-500" />
            ) : userId ? (
                <button
                    onClick={handleLike}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 rounded flex items-center justify-center text-xs sm:text-sm md:text-base ${
                        loading
                            ? "bg-orange-500 text-white"
                            : isLiked
                            ? "bg-gray-300 text-black"
                            : "bg-orange-500 text-white"
                    }`}
                    disabled={loading}
                >
                    {loading ? (
                        <Spinner color="border-orange-500" />
                    ) : isLiked ? (
                        <span className="text-black">取り消す</span>
                    ) : (
                        <span className="text-white">うまー！</span>
                    )}
                </button>
            ) : (
                <span className="text-gray-500">
                    うまー！ボタンを押すためにはログインが必要です。
                </span>
            )}
            <span className="ml-3 sm:ml-4 md:ml-5 text-sm sm:text-base md:text-lg">
                {likeCount} うまー！
            </span>
        </div>
    );
}
