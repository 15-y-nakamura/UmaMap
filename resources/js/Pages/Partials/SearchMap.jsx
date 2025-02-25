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

function MapUpdater({ position, radius }) {
    const map = useMap();

    useEffect(() => {
        map.setView(position, getZoomLevel(radius));
    }, [position, radius, map]);

    return null;
}

function getZoomLevel(radius) {
    switch (true) {
        case radius <= 300:
            return 16;
        case radius <= 500:
            return 15;
        case radius <= 1000:
            return 14;
        case radius <= 2000:
            return 13;
        case radius <= 3000:
            return 12;
    }
}

function getSearchRadiusMeters(range) {
    const rangeMap = {
        1: 300,
        2: 500,
        3: 1000,
        4: 2000,
        5: 3000,
    };
    return rangeMap[range];
}

function ShopMarker({ shop, isSelected }) {
    const map = useMap();
    const popupRef = useRef();

    useEffect(() => {
        if (isSelected && shop.lat && shop.lng) {
            map.setView([shop.lat, shop.lng], map.getZoom());
            popupRef.current.openOn(map);
        }
    }, [isSelected, map, shop.lat, shop.lng]);

    const hasPhoto = shop.photo && shop.photo.pc && shop.photo.pc.l;

    return (
        <Marker position={[shop.lat, shop.lng]}>
            <Popup ref={popupRef}>
                <div>
                    <h3>{shop.name}</h3>
                    <p>{shop.access}</p>
                    <Link href={`/shop/${shop.id}`} className="text-blue-500">
                        もっと見る
                    </Link>
                    {hasPhoto ? (
                        <img src={shop.photo.pc.l} alt={shop.name} />
                    ) : (
                        <p className="text-gray-500">画像がありません</p>
                    )}
                </div>
            </Popup>
        </Marker>
    );
}

export default function SearchMap({ position, radius, shops, selectedShop }) {
    const searchRadiusMeters = getSearchRadiusMeters(radius);

    return (
        <div className="w-full h-full bg-white shadow-lg rounded-2xl p-2 flex flex-col">
            <MapContainer
                center={position}
                zoom={getZoomLevel(searchRadiusMeters)}
                className="w-full h-full rounded-2xl"
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {shops.map((shop) => (
                    <ShopMarker
                        key={shop.id}
                        shop={shop}
                        isSelected={selectedShop && selectedShop.id == shop.id}
                    />
                ))}
                <Circle center={position} radius={searchRadiusMeters} />
                <MapUpdater position={position} radius={searchRadiusMeters} />
            </MapContainer>
        </div>
    );
}
