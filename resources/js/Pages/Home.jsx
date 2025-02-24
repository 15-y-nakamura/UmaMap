import { Head } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Circle,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Home() {
    const [position, setPosition] = useState([35.6895, 139.6917]); // 東京都心の座標 (デフォルト)
    const [radius, setRadius] = useState(300);
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

function SearchFilters({ onSearch }) {
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
    });
    const [radius, setRadius] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("current");

    const handleSearch = () => {
        let latitude, longitude;

        if (selectedLocation === "current") {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        latitude = position.coords.latitude;
                        longitude = position.coords.longitude;
                        setLocation({ latitude, longitude });

                        // ダミーデータを使用
                        const shops = [
                            {
                                id: 1,
                                name: "ダミーショップ",
                                access: "ダミーアクセス",
                                lat: latitude,
                                lng: longitude,
                                photo: {
                                    pc: {
                                        l: "https://via.placeholder.com/150",
                                    },
                                },
                            },
                        ];
                        onSearch(latitude, longitude, radius, shops);
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

            setLocation({ latitude, longitude });

            // ダミーデータを使用
            const shops = [
                {
                    id: 1,
                    name: "ダミーショップ",
                    access: "ダミーアクセス",
                    lat: latitude,
                    lng: longitude,
                    photo: { pc: { l: "ダミー画像" } },
                },
            ];
            onSearch(latitude, longitude, radius, shops);
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
                            <option value="">検索範囲を選択してください</option>
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

function SearchMap({ position, radius, shops, selectedShop }) {
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

function SearchResults({ shops, onSelectShop }) {
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
                            alt={shop.name}
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
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MapUpdater({ position, radius }) {
    const map = useMap();

    useEffect(() => {
        map.setView(position, getZoomLevel(radius));
    }, [position, radius, map]);

    return null;
}

function getZoomLevel(radius) {
    if (radius <= 500) return 15;
    if (radius <= 1000) return 14;
    if (radius <= 2000) return 13;
    if (radius <= 3000) return 12;
}

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
                </div>
            </Popup>
        </Marker>
    );
}
