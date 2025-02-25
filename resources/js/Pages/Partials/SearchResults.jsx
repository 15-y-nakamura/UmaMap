import React from "react";
import { Link } from "@inertiajs/react";

export default function SearchResults({ shops, onSelectShop }) {
    return (
        <div className="w-full md:w-[48%] lg:w-[50%] xl:w-[60%] max-w-[700px] xl:max-w-[900px] h-[400px] md:h-[450px] lg:h-[350px] xl:h-[500px] bg-white shadow-lg rounded-2xl p-4 lg:p-2 xl:p-6 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 lg:mb-2 xl:mb-6">検索結果</h2>

            {/* 店舗リスト */}
            <div className="space-y-4 lg:space-y-2 xl:space-y-6">
                {shops.map((shop) => (
                    <div
                        key={shop.id}
                        className="bg-gray-100 p-4 lg:p-2 xl:p-5 rounded-lg shadow-md flex items-center gap-3 lg:gap-2 xl:gap-4"
                        onClick={() => onSelectShop(shop)}
                    >
                        {/* サムネイル */}
                        <img
                            src={shop.photo.pc.l}
                            alt={`サムネイル ${shop.name}`}
                            className="w-[100px] h-[100px] lg:w-[70px] lg:h-[70px] xl:w-[120px] xl:h-[120px] rounded-lg"
                        />

                        {/* 店舗情報 */}
                        <div>
                            <h3 className="text-md font-bold lg:text-xs xl:text-lg">
                                {shop.name}
                            </h3>
                            <p className="text-sm text-gray-600 lg:text-xs xl:text-base">
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
                ))}
            </div>
        </div>
    );
}
