import React, { useState } from "react";
import Spinner from "../../../Components/Spinner";

export default function SearchFilters({ onSearch }) {
    const [locationChoice, setLocationChoice] = useState("current");
    const [searchRange, setSearchRange] = useState("");
    const [budget, setBudget] = useState("");
    const [genre, setGenre] = useState("");
    const [loading, setLoading] = useState(false);

    // 検索ボタンがクリックされたときの処理
    const handleSearch = async () => {
        setLoading(true); // ローディング状態を開始
        let latitude, longitude;

        if (locationChoice === "current") {
            // 現在位置を使用する場合
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        latitude = position.coords.latitude;
                        longitude = position.coords.longitude;
                        await fetchShopData(latitude, longitude); // 店舗データを取得
                        setLoading(false); // ローディング状態を終了
                    },
                    () => {
                        alert(
                            "位置情報が取得できませんでした。設定を確認してください。"
                        );
                        setLoading(false); // ローディング状態を終了
                    }
                );
            } else {
                alert("このブラウザでは位置情報が利用できません。");
                setLoading(false); // ローディング状態を終了
            }
        } else {
            // 選択された都市の位置情報を使用する場合
            const locationMap = {
                tokyo: { lat: 35.6895, lng: 139.6917 },
                osaka: { lat: 34.6937, lng: 135.5023 },
                nagoya: { lat: 35.1815, lng: 136.9066 },
                fukuoka: { lat: 33.5902, lng: 130.4017 },
            };

            if (locationMap[locationChoice]) {
                latitude = locationMap[locationChoice].lat;
                longitude = locationMap[locationChoice].lng;
                await fetchShopData(latitude, longitude); // 店舗データを取得
                setLoading(false); // ローディング状態を終了
            } else {
                alert("無効なエリアが選択されました。");
                setLoading(false); // ローディング状態を終了
            }
        }
    };

    // 店舗データをAPIから取得する
    const fetchShopData = async (lat, lng) => {
        const response = await fetch(
            `/api/shop?lat=${lat}&lng=${lng}&range=${searchRange}&budget=${budget}&genre=${genre}`
        );
        const data = await response.json();
        onSearch(lat, lng, searchRange, data.results.shop); // 取得したデータを親コンポーネントに渡す
    };

    return (
        <div className="w-full p-3 bg-orange-100 shadow-md rounded-lg sm:max-w-sm sm:p-4 md:max-w-md md:p-5 lg:max-w-lg lg:p-6">
            <h2 className="mb-3 text-base font-bold text-center sm:mb-4 sm:text-lg md:text-xl lg:text-2xl">
                検索条件
            </h2>

            <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex flex-col gap-1">
                    <label className="block text-xs font-semibold sm:text-sm md:text-base">
                        場所
                    </label>
                    <select
                        className="p-1.5 border rounded sm:p-2 md:p-3"
                        value={locationChoice}
                        onChange={(e) => setLocationChoice(e.target.value)}
                    >
                        <option value="current">現在位置</option>
                        <option value="tokyo">東京</option>
                        <option value="osaka">大阪</option>
                        <option value="nagoya">名古屋</option>
                        <option value="fukuoka">福岡</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="block text-xs font-semibold sm:text-sm md:text-base">
                        検索範囲 (m)
                    </label>
                    <select
                        className="p-1.5 border rounded sm:p-2 md:p-3"
                        value={searchRange}
                        onChange={(e) => setSearchRange(e.target.value)}
                    >
                        <option value="">選択してください(必須)</option>
                        <option value="1">300</option>
                        <option value="2">500</option>
                        <option value="3">1000</option>
                        <option value="4">2000</option>
                        <option value="5">3000</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="block text-xs font-semibold sm:text-sm md:text-base">
                        予算
                    </label>
                    <select
                        className="p-1.5 border rounded sm:p-2 md:p-3"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                    >
                        <option value="">こだわらない</option>
                        <option value="~500">～500円</option>
                        <option value="501~1000">501～1000円</option>
                        <option value="1001~1500">1001～1500円</option>
                        <option value="1501~2000">1501～2000円</option>
                        <option value="2001~3000">2001～3000円</option>
                        <option value="3001~4000">3001～4000円</option>
                        <option value="4001~5000">4001～5000円</option>
                        <option value="5001~7000">5001～7000円</option>
                        <option value="7001~10000">7001～10000円</option>
                        <option value="10001~15000">10001～15000円</option>
                        <option value="15001~20000">15001～20000円</option>
                        <option value="20001~30000">20001～30000円</option>
                        <option value="30001~">30001円～</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="block text-xs font-semibold sm:text-sm md:text-base">
                        ジャンル
                    </label>
                    <select
                        className="p-1.5 border rounded sm:p-2 md:p-3"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                    >
                        <option value="">お店のジャンルすべて</option>
                        <option value="居酒屋">居酒屋</option>
                        <option value="ダイニングバー・バル">
                            ダイニングバー・バル
                        </option>
                        <option value="創作料理">創作料理</option>
                        <option value="和食">和食</option>
                        <option value="洋食">洋食</option>
                        <option value="イタリアン・フレンチ">
                            イタリアン・フレンチ
                        </option>
                        <option value="中華">中華</option>
                        <option value="焼肉・ホルモン">焼肉・ホルモン</option>
                        <option value="韓国料理">韓国料理</option>
                        <option value="アジア・エスニック料理">
                            アジア・エスニック料理
                        </option>
                        <option value="各国料理">各国料理</option>
                        <option value="カラオケ・パーティ">
                            カラオケ・パーティ
                        </option>
                        <option value="バー・カクテル">バー・カクテル</option>
                        <option value="ラーメン">ラーメン</option>
                        <option value="お好み焼き・もんじゃ">
                            お好み焼き・もんじゃ
                        </option>
                        <option value="カフェ・スイーツ">
                            カフェ・スイーツ
                        </option>
                        <option value="その他グルメ">その他グルメ</option>
                    </select>
                </div>

                <button
                    className={`py-1.5 px-3 rounded text-sm sm:py-2 sm:px-4 sm:text-base ${
                        searchRange === ""
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-orange-500 text-white"
                    }`}
                    onClick={handleSearch}
                    disabled={searchRange === ""}
                >
                    {loading ? <Spinner /> : "検索"}
                </button>
            </div>
        </div>
    );
}
