import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import SearchFilters from "./Partials/SearchFilters";
import SearchMap from "./Partials/SearchMap";
import SearchResults from "./Partials/SearchResults";

export default function Home() {
    const [position, setPosition] = useState([35.6895, 139.6917]); // 東京都心の座標 (デフォルト)
    const [radius, setRadius] = useState();
    const [shops, setShops] = useState([]);
    const [selectedShop, setSelectedShop] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setPosition([
                        position.coords.latitude,
                        position.coords.longitude,
                    ]);
                },
                (error) => {
                    console.error("位置情報が取得できませんでした", error);
                }
            );
        } else {
            console.error("このブラウザでは位置情報が取得できません");
        }
    }, []);

    const handleSearch = (latitude, longitude, searchRadius, shops) => {
        setPosition([latitude, longitude]);
        setRadius(searchRadius);
        setShops(shops);
    };

    const handleSelectShop = (shop) => {
        setSelectedShop(shop);
    };

    return (
        <>
            <Head title="ホーム" />

            {/* 検索条件 */}
            <SearchFilters onSearch={handleSearch} />

            {/* 検索結果 & マップエリア */}
            <div className="w-full max-w-[1200px] xl:max-w-[1400px] mx-auto flex flex-col md:flex-row lg:flex-row gap-8 md:gap-6 lg:gap-4 xl:gap-6 justify-center px-4 lg:px-8 xl:px-0">
                {/* 検索結果 */}
                <SearchResults shops={shops} onSelectShop={handleSelectShop} />

                {/* マップエリア */}
                <SearchMap
                    position={position}
                    radius={radius}
                    shops={shops}
                    selectedShop={selectedShop}
                />
            </div>
        </>
    );
}
