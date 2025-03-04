import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import Pagination from "../../../Components/Pagination";

export default function SearchResults({ shops: allShops, onSelectShop }) {
    const [visibleShops, setVisibleShops] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedShopId, setSelectedShopId] = useState(null);
    const itemsPerPage = 5;

    const updateVisibleShops = (pageShops, page) => {
        setVisibleShops(pageShops);
        setCurrentPage(page);
    };

    useEffect(() => {
        // allShops配列の最初のitemsPerPage（5）件を取得し、visibleShopsに設定
        setVisibleShops(allShops.slice(0, itemsPerPage));
    }, [allShops]);

    // 総ページ数を計算
    const totalPages = Math.ceil(allShops.length / itemsPerPage);
    // (currentPage - 1) は現在のページが1の場合、0から始めるため
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    // Math.minを使用して、現在のページの最後のアイテムが全体のアイテム数を超えないようにする
    const endItem = Math.min(currentPage * itemsPerPage, allShops.length);

    const handleSelectShop = (shop) => {
        setSelectedShopId(shop.id);
        onSelectShop(shop);
    };

    return (
        <div className="w-full h-full p-3 bg-white shadow-lg rounded-2xl sm:p-4 md:p-5">
            {/* ヘッダー */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg font-bold sm:text-xl md:text-2xl">
                    検索結果
                </h2>
                <div className="flex items-center gap-2 text-xs text-gray-600 sm:text-sm md:text-base">
                    検索結果 {allShops.length} 件 {startItem}～{endItem}{" "}
                    件を表示
                    <span>
                        {currentPage}/{totalPages} ページ
                    </span>
                </div>
            </div>

            {/* 店舗リスト */}
            <div className="space-y-3 sm:space-y-4">
                {visibleShops.length > 0 ? (
                    visibleShops.map((shop) => (
                        <div
                            key={shop.id}
                            className={`flex items-center gap-3 p-3 bg-gray-100 rounded-lg shadow-md sm:gap-4 sm:p-4 md:gap-5 md:p-5 ${
                                selectedShopId === shop.id
                                    ? "border-2 border-orange-500"
                                    : ""
                            }`}
                            onClick={() => handleSelectShop(shop)}
                        >
                            {/* サムネイル画像 */}
                            <img
                                src={shop.photo.pc.l}
                                alt={`サムネイル ${shop.name}`}
                                className="w-[60px] h-[60px] rounded-lg sm:w-[70px] sm:h-[70px] md:w-[80px] md:h-[80px]"
                            />

                            {/* 店舗情報 */}
                            <div>
                                <h3 className="text-sm font-bold sm:text-base md:text-lg">
                                    {shop.name}
                                </h3>
                                <p className="text-xs text-gray-600 sm:text-sm md:text-base">
                                    {shop.access}
                                </p>
                                <Link
                                    href={`/shop/${shop.id}`}
                                    className="text-xs text-blue-500 sm:text-sm md:text-base"
                                >
                                    もっと見る
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-40 text-center text-sm text-gray-600 sm:h-48 sm:text-base md:h-56">
                        該当する店舗がありません
                    </div>
                )}
            </div>

            {/* ページネーション */}
            {allShops.length > 0 && (
                <Pagination
                    data={allShops}
                    itemsPerPage={itemsPerPage}
                    onPageChange={(pageShops) =>
                        updateVisibleShops(pageShops, currentPage)
                    }
                />
            )}
        </div>
    );
}
