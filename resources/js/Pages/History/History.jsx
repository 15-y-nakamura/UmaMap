import React, { useEffect, useState } from "react";
import axios from "axios";
import { Head, Link } from "@inertiajs/react";
import HeaderLayout from "../../Layouts/HeaderLayout";
import Spinner from "../../Components/Spinner";
import LoadingSpinner from "../../Components/LoadingSpinner";
import { fetchUserId } from "../../Components/UserToken";

export default function History() {
    const [shops, setShops] = useState([]);
    const [userId, setUserId] = useState(null);
    const [selectedShops, setSelectedShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingDeleteSelected, setLoadingDeleteSelected] = useState(false);

    //useEffectが2つあるのは、
    //useIdが更新される前にfetchUserLikesが呼ばれるのを防ぐため
    useEffect(() => {
        fetchUserId(setUserId);
    }, []);

    useEffect(() => {
        if (userId) {
            fetchUserLikes(userId);
        }
    }, [userId]);

    const fetchUserLikes = async (userId) => {
        try {
            const response = await axios.get(`/api/users/${userId}/likes`);
            setShops(response.data);
        } catch (error) {
            console.error("うまー！履歴取得エラー:", error);
        } finally {
            setLoading(false);
        }
    };

    // 店舗を日付ごとにグループ化する
    const groupShopsByDate = (shops) => {
        const groupedShops = {};
        shops.forEach((shop) => {
            const date = new Date(shop.timestamps).toLocaleDateString();
            if (!groupedShops[date]) {
                groupedShops[date] = [];
            }
            groupedShops[date].push(shop);
        });
        return groupedShops;
    };

    // 店舗を削除する
    const handleDelete = async (shopId) => {
        if (!window.confirm("この店舗のうまー！を削除しますか？")) return;
        setLoading(true);
        try {
            await axios.delete(`/api/shops/${shopId}/like`);
            await axios.delete(`/api/users/${userId}/likes/${shopId}`);
            setShops(shops.filter((shop) => shop.id !== shopId));
        } catch (error) {
            console.error("削除エラー:", error);
        } finally {
            setLoading(false);
        }
    };

    // 選択した店舗を削除する
    const handleDeleteSelected = async () => {
        if (!window.confirm("選択した店舗のうまー！を削除しますか？")) return;
        setLoadingDeleteSelected(true);
        try {
            for (const shopId of selectedShops) {
                await axios.delete(`/api/shops/${shopId}/like`);
                await axios.delete(`/api/users/${userId}/likes/${shopId}`);
            }
            setShops(shops.filter((shop) => !selectedShops.includes(shop.id)));
            setSelectedShops([]);
        } catch (error) {
            console.error("選択削除エラー:", error);
        } finally {
            setLoadingDeleteSelected(false);
        }
    };

    // 店舗を選択
    const handleSelectShop = (shopId) => {
        setSelectedShops((prev) => {
            if (prev.includes(shopId)) {
                // 既に選択されている場合は選択を解除
                return prev.filter((id) => id !== shopId);
            } else {
                // 選択されていない場合は選択
                return [...prev, shopId];
            }
        });
    };

    // 店舗リストをレンダリングする
    const renderShops = () => {
        const groupedShops = groupShopsByDate(shops);

        return Object.keys(groupedShops).map((date) => (
            <div key={date}>
                <div className="mb-3 text-gray-500 border-b border-gray-300 sm:mb-4">
                    {date}
                </div>
                {groupedShops[date].map((shop) => (
                    <div
                        key={shop.id}
                        className="flex items-center p-3 mb-3 border rounded shadow sm:p-4 sm:mb-4 md:p-5"
                    >
                        <input
                            type="checkbox"
                            className="mr-3 sm:mr-4"
                            checked={selectedShops.includes(shop.id)}
                            onChange={() => handleSelectShop(shop.id)}
                        />
                        <img
                            src={shop.photo}
                            alt={shop.name}
                            className="object-cover w-20 h-20 mr-3 sm:w-24 sm:h-24 sm:mr-4 md:w-28 md:h-28"
                        />
                        <div className="flex-1">
                            <h2 className="text-lg font-bold sm:text-lg md:text-xl">
                                {shop.name}
                            </h2>
                            <p className="text-sm text-gray-700 sm:text-base">
                                {shop.address}
                            </p>
                            <p className="text-sm text-gray-700 sm:text-base">
                                {shop.open}
                            </p>
                            <Link
                                href={`/shop/${shop.id}`}
                                className="text-blue-500"
                            >
                                もっと見る
                            </Link>
                        </div>
                        <button
                            onClick={() => handleDelete(shop.id)}
                            className="px-3 py-1.5 ml-3 text-sm text-white bg-red-500 rounded sm:px-4 sm:py-2 sm:text-base"
                        >
                            {loading ? <Spinner /> : "削除"}
                        </button>
                    </div>
                ))}
            </div>
        ));
    };

    return (
        <>
            <Head title="うまー！履歴" />
            <HeaderLayout />
            <div className="p-3 sm:p-4 md:p-6">
                <h1 className="mb-3 text-xl font-bold sm:mb-4 sm:text-xl md:text-2xl lg:text-3xl">
                    履歴
                </h1>
                <button
                    onClick={handleDeleteSelected}
                    className={`px-3 py-1.5 rounded text-sm sm:px-4 sm:py-2 sm:text-base ${
                        selectedShops.length > 0
                            ? "bg-red-500 text-white"
                            : "bg-gray-500 text-gray-300 cursor-not-allowed"
                    }`}
                    disabled={!selectedShops.length || loadingDeleteSelected}
                >
                    {loadingDeleteSelected ? <Spinner /> : "選択して削除"}
                </button>
                <div className="my-3 border-b-2 border-orange-500 sm:my-4"></div>
                <div className="overflow-y-auto max-h-[70vh]">
                    {loading ? (
                        <div className="flex items-center justify-center w-full h-full">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        renderShops()
                    )}
                </div>
            </div>
        </>
    );
}
