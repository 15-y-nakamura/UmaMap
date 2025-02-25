import React, { useEffect, useState, useRef } from "react";
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

// マップの位置とズームレベルを更新
function MapUpdater({ position, radius }) {
    const map = useMap();

    useEffect(() => {
        map.setView(position, getZoomLevel(radius));
    }, [position, radius, map]);

    return null;
}

// 検索範囲に応じたズームレベルを返す
function getZoomLevel(radius) {
    if (radius <= 300) return 16;
    if (radius <= 500) return 15;
    if (radius <= 1000) return 14;
    if (radius <= 2000) return 13;
    if (radius <= 3000) return 12;
}

// 検索範囲の値をメートルに変換
function convertRangeToMeters(range) {
    switch (range) {
        case 1:
            return 300;
        case 2:
            return 500;
        case 3:
            return 1000;
        case 4:
            return 2000;
        case 5:
            return 3000;
        default:
            return 0;
    }
}

// 店舗のマーカーとポップアップを表示
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
                <div>
                    <h3>{shop.name}</h3>
                    <p>{shop.access}</p>
                    {shop.photo && shop.photo.pc && shop.photo.pc.l ? (
                        <img src={shop.photo.pc.l} alt={shop.name} />
                    ) : (
                        <p className="text-gray-500">画像がありません</p>
                    )}
                    <Link href={`/shop/${shop.id}`} className="text-blue-500">
                        もっと見る
                    </Link>
                </div>
            </Popup>
        </Marker>
    );
}

// マップと店舗のマーカーを表示
export default function SearchMap({ position, radius, shops, selectedShop }) {
    const radiusInMeters = convertRangeToMeters(radius);

    return (
        <div className="w-full md:w-[48%] lg:w-[50%] xl:w-[60%] max-w-[700px] xl:max-w-[900px] h-[400px] md:h-[450px] lg:h-[350px] xl:h-[500px] bg-white shadow-lg rounded-2xl p-2 lg:p-1 xl:p-4 flex flex-col">
            <MapContainer
                center={position}
                zoom={getZoomLevel(radiusInMeters)}
                className="w-full h-full rounded-2xl"
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {shops.map((shop) => (
                    <ShopMarker
                        key={shop.id}
                        shop={shop}
                        isSelected={selectedShop && selectedShop.id === shop.id}
                    />
                ))}
                <Circle center={position} radius={radiusInMeters} />
                <MapUpdater position={position} radius={radiusInMeters} />
            </MapContainer>
        </div>
    );
}
