import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import SearchFilters from "./Partials/SearchFilters";
import SearchMap from "./Partials/SearchMap";
import SearchResults from "./Partials/SearchResults";

export default function Home() {
    // ユーザーの現在地
    const [position, setPosition] = useState();
    // 検索範囲
    const [searchRange, setSearchRange] = useState("");
    // 検索結果の店舗リスト
    const [shops, setShops] = useState([]);
    // ユーザーが選択した店舗
    const [selectedShop, setSelectedShop] = useState(null);
    // 検索済みかどうかを判定するフラグ
    const [hasSearched, setHasSearched] = useState(false);

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

    // 初回マウント時に位置情報を取得
    useEffect(() => {
        getUserLocation();
    }, []);

    //searchRadius - 検索範囲、shopList - 取得した店舗データ
    const searchShops = (latitude, longitude, searchRadius, shopList) => {
        setPosition([latitude, longitude]);
        setSearchRange(searchRadius);
        setShops(shopList);
        setHasSearched(true); //検索済みフラグをtrueに設定
    };

    //shop - 選択された店舗
    const selectShop = (shop) => {
        setSelectedShop(shop);
    };

    return (
        <>
            <Head title="ホーム" />
            <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-4">
                {/* 左側：検索結果リスト */}
                <div
                    className={`w-full lg:w-1/2 h-[calc(180vh-100px)] p-4 rounded-lg ${
                        hasSearched
                            ? "bg-white"
                            : "bg-gray-300 flex items-center justify-center"
                    }`}
                >
                    {hasSearched ? (
                        <SearchResults
                            shops={shops}
                            onSelectShop={selectShop}
                        />
                    ) : (
                        <p className="text-gray-600">
                            検索結果:検索条件を設定してください
                        </p>
                    )}
                </div>

                {/* 右側：検索条件 + マップ */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                    {/* 検索条件 */}
                    <div className="w-full">
                        <SearchFilters onSearch={searchShops} />
                    </div>

                    {/* マップ */}
                    <div
                        className={`w-full flex-grow p-4 rounded-lg ${
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
                            <p className="text-gray-600">
                                マップ:検索条件を設定してください
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <div className="text-right mt-4 mr-4">
                <p>
                    Powered by{" "}
                    <a href="http://webservice.recruit.co.jp/">
                        ホットペッパーグルメ Webサービス
                    </a>
                </p>
                <p>【画像提供：ホットペッパー グルメ】</p>
            </div>
        </>
    );
}
