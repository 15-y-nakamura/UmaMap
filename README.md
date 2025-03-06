## **はじめに**

本ドキュメントでは、開発した飲食店検索アプリ **「うまマップ」** について紹介します。
開発の背景、アプリの特徴、こだわったポイント、今後の展望などをまとめています。

## **コンセプト**

**マップから選択できる！店舗検索アプリ**

本アプリは、マップを活用して直感的に店舗を検索できる飲食店検索アプリです。ホットペッパーグルメサーチAPIを利用し、条件に合った飲食店を検索し、地図上に表示します。

## **アプリ概要**

### **アプリ名**
**うまマップ**

### **機能一覧**
- **ログイン:** 既存ユーザーがアカウントにログイン
- **新規登録:** 新しいユーザーがアカウントを作成
- **ログアウト:** 現在のセッションを終了
- **飲食店検索:** ホットペッパーグルメサーチAPIを使用して、条件に合った飲食店を検索し、検索結果をマップで表示
- **飲食店詳細表示:** ホットペッパーグルメサーチAPIを使用して、店舗の詳細情報を取得
- **「うまー！」機能:**
  - 1人1回まで「うまー！」を押せる
  - 「うまー！」のカウント数は全ユーザーに表示される
- **うまー！履歴表示:** 過去にうまー！を押した店舗を表示し、削除可能

## **環境**

### **開発環境**
- **Docker**
- **VSCode**

### **開発言語**
- **バックエンド:** PHP 8.2 (Laravel 11)
- **フロントエンド:** JavaScript (React 18, Vite 6)
- **データベース:** MySQL

### **動作確認済みOS**
- **Windows 11**

### **動作確認済みブラウザ**
- **Google Chrome（最新）**
- **Microsoft Edge（最新）**

### **使用している API, SDK, ライブラリ**
- **ホットペッパーグルメサーチAPI**
- **マップ関連**
  - Leaflet 1.9.4
  - React-Leaflet 4.2.1
  - OpenStreetMap Tile API
- **バックエンド**
  - Laravel 11
  - Inertia.js
  - Laravel Sanctum (認証)
  - Laravel Breeze
- **フロントエンド**
  - React 18
  - Vite 6
  - Tailwind CSS 3.2.1
  - Ziggy 2.0 (ルーティング)

## **利用方法**

### **リポジトリのクローン**
```sh
git clone https://github.com/15-y-nakamura/UmaMap.git
cd UmaMap
```

### **必要な依存関係をインストール**
```sh
composer install
npm install
```
npm install の際、以下の警告が表示されることがありますが、@inertiajs/react に内部依存しているため、問題なく利用できます。
```sh
npm WARN deprecated lodash.isequal@4.5.0: This package is deprecated. Use require('node:util').isDeepStrictEqual instead.
```
"lodash.isequal": "^4.5.0" は 非推奨 ですが、@inertiajs/react で使用されているため、そのまま利用しています。

### **環境変数ファイルを設定**
```sh
cp .env.example .env
php artisan key:generate
```
.env.example を参考に .env ファイルを作成し、必要な値を設定してください。

### **データベースの設定とマイグレーションの実行**
```sh
./vendor/bin/sail up -d
./vendor/bin/sail php artisan migrate
```

### **アプリケーションの起動**
```sh
npm run dev
```

## **今後実装予定の機能**

- **SNS共有機能:** 飲食店の情報をTwitterやLINEなどで共有できる機能の追加
- **ユーザープロフィール編集:** ユーザーがアカウント情報を変更できる機能

## **おわりに**

今回の開発では、LaravelとReactを活用した開発を通じて、APIの活用方法やデータ管理の最適化について理解を深めることができました。
詳しくは簡易仕様書をご覧ください。
