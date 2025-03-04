import React, { useEffect, useRef } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Circle,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "@inertiajs/react";

// 検索範囲に応じたズームレベルを取得する
function getZoomLevel(radius) {
    switch (true) {
        case radius <= 300:
            return 15;
        case radius <= 500:
            return 14;
        case radius <= 1000:
            return 13;
        case radius <= 2000:
            return 12;
        case radius <= 3000:
            return 11;
        default:
            return 11;
    }
}

// 検索範囲の値をメートルに変換する
function getSearchRadiusMeters(range) {
    const rangeMap = {
        1: 300,
        2: 500,
        3: 1000,
        4: 2000,
        5: 3000,
    };
    return rangeMap[range] || 3000;
}

// 地図の位置とズームレベルを更新する
function MapUpdater({ position, radius }) {
    const map = useMap();

    useEffect(() => {
        map.setView(position, getZoomLevel(radius));
    }, [position, radius, map]);

    return null;
}

// 店舗マーカーを表示する
function ShopMarker({ shop, isSelected }) {
    const map = useMap();
    const popupRef = useRef();

    useEffect(() => {
        if (isSelected && shop.lat && shop.lng) {
            map.setView([shop.lat, shop.lng], map.getZoom());
            popupRef.current.openOn(map);
        }
    }, [isSelected, map, shop.lat, shop.lng]);

    return (
        <Marker position={[shop.lat, shop.lng]}>
            <Popup ref={popupRef}>
                <div className="text-sm sm:text-base md:text-lg">
                    <h3 className="font-bold">{shop.name}</h3>
                    <p>{shop.access}</p>
                    <Link href={`/shop/${shop.id}`} className="text-blue-500">
                        もっと見る
                    </Link>
                    {shop.photo?.pc?.l ? (
                        <img
                            src={shop.photo.pc.l}
                            alt={shop.name}
                            className="w-full mt-2 rounded sm:max-w-[60px] md:max-w-[80px] lg:max-w-[100px]"
                        />
                    ) : (
                        <p className="text-gray-500">画像がありません</p>
                    )}
                </div>
            </Popup>
        </Marker>
    );
}

// 検索結果の地図を表示するメインコンポーネント
export default function SearchMap({ position, radius, shops, selectedShop }) {
    const searchRadiusMeters = getSearchRadiusMeters(radius);

    return (
        <div className="w-full h-full p-2 bg-white shadow-lg rounded-2xl sm:h-[400px] md:h-[600px] lg:h-[1000px] flex flex-col">
            <MapContainer
                center={position}
                zoom={getZoomLevel(searchRadiusMeters)}
                className="w-full h-full rounded-2xl"
                style={{ height: "100%", width: "100%", minHeight: "300px" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* 店舗マーカーを描画 */}
                {shops.map((shop) => (
                    <ShopMarker
                        key={shop.id}
                        shop={shop}
                        isSelected={selectedShop?.id === shop.id}
                    />
                ))}

                {/* 検索範囲の円 */}
                <Circle center={position} radius={searchRadiusMeters} />

                {/* 地図の位置を更新 */}
                <MapUpdater position={position} radius={searchRadiusMeters} />
            </MapContainer>
        </div>
    );
}
