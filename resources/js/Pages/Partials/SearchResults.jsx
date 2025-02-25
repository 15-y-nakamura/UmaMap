import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import Pagination from "../../Components/Pagination";

export default function SearchResults({ shops: allShops, onSelectShop }) {
    // 表示するお店のリスト
    const [visibleShops, setVisibleShops] = useState([]);
    // 現在のページ番号（1ページ目からスタート）
    const [currentPage, setCurrentPage] = useState(1);
    // 1ページに表示する件数
    const itemsPerPage = 10;

    // 初回レンダリング時と、shops が変更された時に実行
    useEffect(() => {
        setVisibleShops(allShops.slice(0, itemsPerPage));
    }, [allShops]);

    // ページが変更された時に呼ばれる関数
    const updateVisibleShops = (pageShops, page) => {
        setVisibleShops(pageShops);
        setCurrentPage(page);
    };

    // 総ページ数を計算（例：25件なら3ページ）
    const totalPages = Math.ceil(allShops.length / itemsPerPage);
    // 今表示している範囲（例：1～10件）
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, allShops.length);

    return (
        <div className="w-full h-full bg-white shadow-lg rounded-2xl p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">検索結果</h2>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                    {/* 検索結果の件数と現在の表示範囲 */}
                    検索結果 {allShops.length} 件 {startItem}～{endItem}{" "}
                    件を表示
                    <span>
                        {currentPage}/{totalPages} ページ
                    </span>
                </div>
            </div>

            {/* 店舗リスト */}
            <div className="space-y-4">
                {visibleShops.length > 0 ? (
                    visibleShops.map((shop) => (
                        <div
                            key={shop.id}
                            className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center gap-3"
                            onClick={() => onSelectShop(shop)}
                        >
                            {/* サムネイル画像 */}
                            <img
                                src={shop.photo.pc.l}
                                alt={`サムネイル ${shop.name}`}
                                className="w-[70px] h-[70px] rounded-lg"
                            />

                            {/* 店舗情報 */}
                            <div>
                                <h3 className="text-md font-bold">
                                    {shop.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {shop.access}
                                </p>
                                <Link
                                    href={`/shop/${shop.id}`}
                                    className="text-blue-500"
                                >
                                    もっと見る
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex justify-center items-center h-64 text-center text-gray-600">
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
