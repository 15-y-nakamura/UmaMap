import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import SearchFilters from "./Partials/SearchFilters";
import SearchMap from "./Partials/SearchMap";
import SearchResults from "./Partials/SearchResults";
import HeaderLayout from "../../Layouts/HeaderLayout";
import Credit from "../../Components/Credit";

export default function Shop() {
    const [position, setPosition] = useState();
    const [searchRange, setSearchRange] = useState("");
    const [shops, setShops] = useState([]);
    const [selectedShop, setSelectedShop] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    // 位置情報を取得
    const getUserLocation = () => {
        try {
            if (!navigator.geolocation) {
                throw new Error("このブラウザでは位置情報が利用できません。");
            }
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
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        getUserLocation();
    }, []);

    // 店舗検索
    const searchShops = (latitude, longitude, searchRadius, shopList) => {
        setPosition([latitude, longitude]);
        setSearchRange(searchRadius);
        setShops(shopList);
        setHasSearched(true); // 検索済みフラグをtrueに設定
    };

    // 店舗選択
    const selectShop = (shop) => {
        setSelectedShop(shop);
    };

    return (
        <>
            <Head title="ホーム" />
            <HeaderLayout />
            <div className="container mx-auto p-4 flex flex-col gap-4">
                {/* 検索条件 */}
                <div className="w-full flex justify-center">
                    <SearchFilters onSearch={searchShops} />
                </div>

                {/* 検索結果リストとマップを並べる */}
                <div className="flex flex-col w-full gap-4 lg:flex-row">
                    {/* 検索結果リスト */}
                    <div
                        className={`lg:w-1/2 xl:w-3/5 ${
                            hasSearched
                                ? "bg-white"
                                : "bg-gray-300 flex items-center justify-center"
                        }`}
                    >
                        {hasSearched ? (
                            <SearchResults
                                shops={shops}
                                onSelectShop={selectShop}
                                height="full"
                            />
                        ) : (
                            <p className="p-10 text-sm text-center text-gray-600 md:text-base">
                                検索結果: 検索条件を設定してください
                            </p>
                        )}
                    </div>

                    {/* マップ */}
                    <div
                        className={`lg:w-1/2 xl:w-2/5 ${
                            hasSearched
                                ? "bg-white"
                                : "bg-gray-300 flex items-center justify-center"
                        }`}
                    >
                        {hasSearched ? (
                            <SearchMap
                                position={position}
                                radius={searchRange}
                                shops={shops}
                                selectedShop={selectedShop}
                            />
                        ) : (
                            <p className="p-10 text-sm text-center text-gray-600 md:text-base">
                                マップ: 検索条件を設定してください
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <Credit />
        </>
    );
}
