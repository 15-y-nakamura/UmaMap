import React, { useState } from "react";

const Pagination = ({ data, itemsPerPage, onPageChange }) => {
    // 初期値:1ページ目
    const [currentPage, setCurrentPage] = useState(1);
    // data.length / itemsPerPage で 全体のページ数 を計算。
    // ページネーションでは 整数値が必要なので、Math.ceil を使って、小数点を切り上げする。
    const totalPageCount = Math.ceil(data.length / itemsPerPage);

    // 指定されたページのデータを取得
    const getPageData = (pageNum) => {
        let start = (pageNum - 1) * itemsPerPage;
        let end = start + itemsPerPage;
        return data.slice(start, end);
    };

    // ページ番号を変更
    const changePage = (pageNum) => {
        setCurrentPage(pageNum);
        onPageChange(getPageData(pageNum));
    };

    // 前のページへ戻る
    const goPrev = () => {
        if (currentPage > 1) {
            changePage(currentPage - 1);
        }
    };

    // 次のページへ進む
    const goNext = () => {
        if (currentPage < totalPageCount) {
            changePage(currentPage + 1);
        }
    };

    // ページ番号リストを作成
    const createPageNumbers = () => {
        let pageList = [];
        let maxPages = 5;

        // ページ番号が最大表示数以下の場合
        if (totalPageCount <= maxPages) {
            for (let i = 1; i <= totalPageCount; i++) {
                pageList.push(i);
            }
        } else {
            // 2は、現在のページ (currentPage) を中心にして前後2ページずつ番号表示するための設定
            let start = Math.max(currentPage - 2, 1);
            let end = Math.min(currentPage + 2, totalPageCount);

            // 現在のページが1～3ページ目の場合
            if (currentPage <= 3) {
                end = maxPages;
            } else if (currentPage >= totalPageCount - 2) {
                // 現在のページが最終ページから3ページ
                start = totalPageCount - maxPages + 1;
            }

            // ページ番号リストを作成
            for (let i = start; i <= end; i++) {
                pageList.push(i);
            }

            // 1ページ目より後ろの場合、「...」と1ページ目を追加
            if (start > 1) {
                pageList.unshift("...");
                pageList.unshift(1);
            }
            // 最終ページより前の場合、「...」と最終ページを追加
            if (end < totalPageCount) {
                pageList.push("...");
                pageList.push(totalPageCount);
            }
        }
        return pageList;
    };

    return (
        <div className="flex justify-center gap-2 mt-8">
            {/* 「<」ボタン */}
            <button
                onClick={goPrev}
                disabled={currentPage == 1}
                className="border-none p-3 cursor-pointer min-w-10 text-center rounded bg-gray-200 disabled:opacity-50"
            >
                &lt;
            </button>

            {/* ページ番号ボタン */}
            <div className="flex flex-wrap gap-2">
                {createPageNumbers().map((page, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            if (page !== "...") {
                                changePage(page);
                            }
                        }}
                        className={`border-none p-3 cursor-pointer min-w-10 text-center rounded ${
                            currentPage == page
                                ? "bg-orange-500 text-white"
                                : "bg-gray-200"
                        }`}
                        disabled={page == "..."}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {/* 「>」ボタン */}
            <button
                onClick={goNext}
                disabled={currentPage == totalPageCount}
                className="border-none p-3 cursor-pointer min-w-10 text-center rounded bg-gray-200 disabled:opacity-50"
            >
                &gt;
            </button>
        </div>
    );
};

export default Pagination;
