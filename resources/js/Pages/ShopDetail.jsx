import React, { useEffect, useState } from "react";
import { usePage, Head } from "@inertiajs/react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function ShopDetail() {
    const { props } = usePage();
    const { shopId } = props;
    const [shop, setShop] = useState(null);

    const getShopDetails = async () => {
        try {
            console.log("店舗情報を取得中...");
            const response = await fetch(`/api/shop/${shopId}`);
            if (!response.ok) {
                throw new Error("データの取得に失敗しました");
            }
            const data = await response.json();
            console.log("取得したデータ:", data);
            setShop(data);
        } catch (error) {
            alert("店舗情報を取得できませんでした。");
            console.log("データ取得エラー:", error);
        }
    };

    useEffect(() => {
        getShopDetails();
    }, [shopId]);

    if (!shop) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Head title="店舗情報" />
                <div className="flex justify-center" aria-label="読み込み中">
                    <div className="animate-spin h-12 w-12 border-4 border-orange-400 rounded-full border-t-transparent"></div>
                </div>
            </div>
        );
    }

    // オプションのカードの表示・非表示(灰色表示)を切り替える
    const renderOptionCard = (label, value, icon) => {
        let active = false;

        switch (true) {
            case !value:
            case value == "なし":
            case value == "不可":
            case value == "営業していない":
            case value.startsWith("なし ："):
                active = false;
                break;
            default:
                active = true;
                break;
        }

        return (
            <div
                className={`p-4 m-2 border rounded-lg shadow-lg flex items-center ${
                    active ? "bg-white" : "bg-gray-300"
                }`}
            >
                <img src={icon} alt={label} className="w-6 h-6 mr-2" />
                <p>
                    {label}: {value}
                </p>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Head title="店舗情報" />
            <div className="flex flex-wrap mb-4 border-b-2 border-orange-500 pb-4">
                {shop.photo && (
                    <div className="w-full md:w-1/2 p-2">
                        <img
                            src={shop.photo.pc.l}
                            alt={shop.name}
                            className="mb-4 rounded-lg shadow-lg"
                        />
                    </div>
                )}
                <div className="w-full md:w-1/2 p-2">
                    <h1 className="text-2xl font-bold mb-4 text-orange-600">
                        {shop.name}
                    </h1>
                    <p>{shop.address}</p>
                    <p>メインジャンル: {shop.genre.name}</p>
                    {shop.sub_genre?.name && (
                        <p>サブジャンル: {shop.sub_genre.name}</p>
                    )}
                    <p>{shop.catch}</p>
                    <div className="flex mb-4">
                        {/* 昼の予算がある場合のみ表示 */}
                        {shop.budget?.lunch && (
                            <div className="bg-orange-500 text-white p-2 rounded mr-2">
                                昼: {shop.budget.lunch}
                            </div>
                        )}
                        {/* 夜の予算がある場合のみ表示 */}
                        {shop.budget?.dinner && (
                            <div className="bg-blue-500 text-white p-2 rounded">
                                夜: {shop.budget.dinner}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="border-b-2 border-orange-500 pb-4 mb-4">
                <h2 className="text-xl font-bold mb-2 text-orange-600">
                    基本情報
                </h2>
                <div className="flex flex-wrap mb-4">
                    <div className="w-full md:w-1/2 p-2">
                        <p>営業時間: {shop.open}</p>
                        <p>定休日: {shop.close}</p>
                        <p>収容人数: {shop.capacity}</p>
                        <p>WiFi: {shop.wifi}</p>
                        <p>喫煙: {shop.non_smoking}</p>
                        <p>駐車場: {shop.parking}</p>
                        {shop.shop_detail_memo && (
                            <p>店舗からのメモ: {shop.shop_detail_memo}</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="border-b-2 border-orange-500 pb-4 mb-4">
                <h2 className="text-xl font-bold mb-2 text-orange-600">
                    アクセス情報
                </h2>
                <div className="w-full p-2">
                    <p>
                        エリア: {shop.large_area.name}：{shop.small_area.name}
                    </p>
                    <p>最寄り駅: {shop.station_name}</p>
                    <p>アクセス: {shop.access}</p>
                    <p>最短アクセス: {shop.mobile_access}</p>
                </div>
                <div className="w-full p-2">
                    {shop.lat && shop.lng ? (
                        <MapContainer
                            center={[shop.lat, shop.lng]}
                            zoom={17}
                            style={{ height: "300px", width: "100%" }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker position={[shop.lat, shop.lng]}>
                                <Popup>{shop.name}</Popup>
                            </Marker>
                        </MapContainer>
                    ) : (
                        <p>地図情報が利用できません</p>
                    )}
                </div>
            </div>
            <div className="border-b-2 border-orange-500 pb-4 mb-4">
                <h2 className="text-xl font-bold mb-2 text-orange-600">
                    料金情報
                </h2>
                <p>予算: {shop.budget.average || "情報なし"}</p>
                {shop.budget_memo && <p>料金備考: {shop.budget_memo}</p>}
            </div>
            <div className="border-b-2 border-orange-500 pb-4 mb-4">
                <h2 className="text-xl font-bold mb-2 text-orange-600">
                    設備・特徴
                </h2>
                <p>最大宴会収容人数: {shop.party_capacity}</p>
                <p>個室: {shop.private_room}</p>
                <p>掘りごたつ: {shop.horigotatsu}</p>
                <p>座敷: {shop.tatami}</p>
                <p>カード支払い: {shop.card}</p>
                <p>禁煙情報: {shop.non_smoking}</p>
                <p>貸切可否: {shop.charter}</p>
                <p>駐車場: {shop.parking}</p>
                <p>バリアフリー: {shop.barrier_free}</p>
                {shop.other_memo && <p>その他: {shop.other_memo}</p>}
            </div>
            <div className="border-b-2 border-orange-500 pb-4 mb-4">
                <h2 className="text-xl font-bold mb-2 text-orange-600">
                    オプション
                </h2>
                <div className="flex flex-wrap">
                    {renderOptionCard(
                        "ウェディング",
                        shop.wedding,
                        "/img/features/wedding.png"
                    )}
                    {renderOptionCard(
                        "コース料理",
                        shop.course,
                        "/img/features/course.png"
                    )}
                    {renderOptionCard(
                        "飲み放題",
                        shop.free_drink,
                        "/img/features/free_drink.png"
                    )}
                    {renderOptionCard(
                        "食べ放題",
                        shop.free_food,
                        "/img/features/free_food.png"
                    )}
                    {renderOptionCard(
                        "ショー",
                        shop.show,
                        "/img/features/show.png"
                    )}
                    {renderOptionCard(
                        "カラオケ",
                        shop.karaoke,
                        "/img/features/karaoke.png"
                    )}
                    {renderOptionCard(
                        "バンド演奏",
                        shop.band,
                        "/img/features/band.png"
                    )}
                    {renderOptionCard(
                        "テレビ・プロジェクター",
                        shop.tv,
                        "/img/features/tv_projector.png"
                    )}
                    {renderOptionCard(
                        "ランチ",
                        shop.lunch,
                        "/img/amenities/lunch.png"
                    )}
                    {renderOptionCard(
                        "深夜営業",
                        shop.midnight,
                        "/img/amenities/midnight.png"
                    )}
                    {renderOptionCard(
                        "英語メニュー",
                        shop.english,
                        "/img/amenities/english.png"
                    )}
                    {renderOptionCard(
                        "ペット可",
                        shop.pet,
                        "/img/amenities/pet.png"
                    )}
                    {renderOptionCard(
                        "子供連れOK",
                        shop.child,
                        "/img/amenities/child.png"
                    )}
                    {renderOptionCard(
                        "Wi-Fi",
                        shop.wifi,
                        "/img/amenities/wifi.png"
                    )}
                </div>
            </div>
            Powered by{" "}
            <a href="http://webservice.recruit.co.jp/">
                ホットペッパーグルメ Webサービス
            </a>
            <p>【画像提供：ホットペッパー グルメ】</p>
        </div>
    );
}
