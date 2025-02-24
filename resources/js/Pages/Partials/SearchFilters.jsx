import React, { useState } from "react";

export default function SearchFilters({ onSearch }) {
    const [radius, setRadius] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("current");

    const handleSearch = async () => {
        let latitude, longitude;

        if (selectedLocation === "current") {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        latitude = position.coords.latitude;
                        longitude = position.coords.longitude;

                        const response = await fetch(
                            `/api/hotpepper?lat=${latitude}&lng=${longitude}&range=${radius}`
                        );
                        const data = await response.json();
                        onSearch(
                            latitude,
                            longitude,
                            radius,
                            data.results.shop
                        );
                    },
                    (error) => {
                        alert("位置情報が取得できませんでした");
                    }
                );
            } else {
                alert("このブラウザでは位置情報が取得できません");
            }
        } else {
            switch (selectedLocation) {
                case "tokyo":
                    latitude = 35.6895;
                    longitude = 139.6917;
                    break;
                case "osaka":
                    latitude = 34.6937;
                    longitude = 135.5023;
                    break;
                case "nagoya":
                    latitude = 35.1815;
                    longitude = 136.9066;
                    break;
                case "fukuoka":
                    latitude = 33.5902;
                    longitude = 130.4017;
                    break;
                default:
                    return;
            }

            const response = await fetch(
                `/api/hotpepper?lat=${latitude}&lng=${longitude}&range=${radius}`
            );
            const data = await response.json();
            onSearch(latitude, longitude, radius, data.results.shop);
        }
    };

    return (
        <div className="w-full max-w-[1200px] xl:max-w-[1400px] mx-auto bg-gray-100 p-4 md:p-6 lg:p-4 xl:p-8 shadow-lg rounded-2xl mt-6 md:mt-8 mb-8 md:mb-10">
            <h2 className="text-lg font-bold text-center mb-4 md:mb-6 lg:mb-4 xl:mb-8">
                検索条件
            </h2>

            <div className="flex flex-wrap md:flex-col lg:flex-row lg:justify-center items-center gap-4 md:gap-6 lg:gap-4 xl:gap-8 justify-center md:justify-start px-4 lg:px-8 xl:px-0">
                {/* エリア選択 */}
                <div className="relative border rounded-lg p-3 md:p-4 lg:p-3 xl:p-5 bg-white shadow-md flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-4 lg:gap-3 xl:gap-5 w-full md:w-[80%] lg:w-auto">
                    <span className="absolute top-[-8px] md:top-[-10px] lg:top-[-8px] xl:top-[-12px] left-4 bg-white px-2 text-xs text-gray-500">
                        エリア
                    </span>

                    <div className="w-full md:w-auto">
                        <label className="block text-sm font-semibold lg:text-xs xl:text-base">
                            場所
                        </label>
                        <select
                            className="w-full md:w-[160px] lg:w-[120px] xl:w-[180px] p-2 border rounded"
                            value={selectedLocation}
                            onChange={(e) =>
                                setSelectedLocation(e.target.value)
                            }
                        >
                            <option value="current">現在位置</option>
                            <option value="tokyo">東京</option>
                            <option value="osaka">大阪</option>
                            <option value="nagoya">名古屋</option>
                            <option value="fukuoka">福岡</option>
                        </select>
                    </div>

                    <div className="w-full md:w-auto">
                        <label className="block text-sm font-semibold lg:text-xs xl:text-base">
                            検索範囲 (m)
                        </label>
                        <select
                            className="w-full md:w-[120px] lg:w-[80px] xl:w-[140px] p-2 border rounded"
                            value={radius}
                            onChange={(e) =>
                                setRadius(parseInt(e.target.value))
                            }
                        >
                            <option value="">選択してください</option>
                            <option value={1}>300</option>
                            <option value={2}>500</option>
                            <option value={3}>1000</option>
                            <option value={4}>2000</option>
                            <option value={5}>3000</option>
                        </select>
                    </div>
                </div>

                {/* 予算選択 */}
                <div className="w-full md:w-[80%] lg:w-auto">
                    <label className="block text-sm font-semibold lg:text-xs xl:text-base">
                        予算
                    </label>
                    <select className="w-full md:w-[160px] lg:w-[120px] xl:w-[180px] p-2 border rounded">
                        <option>〜1000円</option>
                        <option>1000円〜3000円</option>
                        <option>3000円〜5000円</option>
                        <option>5000円以上</option>
                    </select>
                </div>

                {/* タグ検索 */}
                <div className="w-full md:w-[80%] lg:w-auto">
                    <label className="block text-sm font-semibold lg:text-xs xl:text-base">
                        タグ
                    </label>
                    <input
                        type="text"
                        placeholder="例: 焼肉, カフェ"
                        className="w-full md:w-[240px] lg:w-[200px] xl:w-[260px] p-2 border rounded"
                    />
                </div>

                {/* 検索ボタン */}
                <button
                    className="bg-orange-500 text-white py-2 px-4 lg:py-1 lg:px-3 xl:py-3 xl:px-6 rounded hover:bg-orange-600 h-10 md:h-12 lg:h-8 xl:h-14 w-full md:w-[80%] lg:w-auto whitespace-nowrap"
                    onClick={handleSearch}
                >
                    検索
                </button>
            </div>
        </div>
    );
}
