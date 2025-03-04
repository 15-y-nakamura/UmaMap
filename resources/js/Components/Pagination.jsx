import React, { useState, useEffect } from "react";

const Pagination = ({ data, itemsPerPage, onPageChange }) => {
    const [currentPage, setCurrentPage] = useState(1); // 現在のページ番号を管理するステート
    const totalPageCount = Math.ceil(data.length / itemsPerPage); // 総ページ数を計算

    // 指定されたページ番号のデータを取得する
    const getPageData = (pageNum) => {
        const start = (pageNum - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return data.slice(start, end);
    };

    useEffect(() => {
        setCurrentPage(1); // 新しいデータが入るたびに1ページ目にリセット
    }, [data]);

    useEffect(() => {
        onPageChange(getPageData(currentPage));
    }, [currentPage]);

    // ページを変更する
    const changePage = (pageNum) => {
        setCurrentPage(pageNum);
    };

    // 前のページに移動する
    const goPrev = () => {
        if (currentPage > 1) {
            changePage(currentPage - 1);
        }
    };

    // 次のページに移動する
    const goNext = () => {
        if (currentPage < totalPageCount) {
            changePage(currentPage + 1);
        }
    };

    // ページ番号のリストを作成する
    const createPageNumbers = () => {
        let pageList = [];
        const maxPages = 5; // 表示する最大ページ数

        if (totalPageCount <= maxPages) {
            // 総ページ数が最大ページ数以下の場合、すべてのページ番号を表示
            for (let i = 1; i <= totalPageCount; i++) {
                pageList.push(i);
            }
        } else {
            // 総ページ数が最大ページ数を超える場合、現在のページを中心に表示
            let start = currentPage - 2;
            let end = currentPage + 2;

            if (currentPage <= 3) {
                start = 1;
                end = maxPages;
            } else if (currentPage >= totalPageCount - 2) {
                start = totalPageCount - maxPages + 1;
                end = totalPageCount;
            }

            for (let i = start; i <= end; i++) {
                pageList.push(i);
            }

            if (start > 1) {
                pageList.unshift("...");
                pageList.unshift(1);
            }
            if (end < totalPageCount) {
                pageList.push("...");
                pageList.push(totalPageCount);
            }
        }
        return pageList;
    };

    return (
        <div className="flex justify-center gap-1.5 mt-6 sm:gap-2 sm:mt-8 md:gap-3 md:mt-10">
            {/* 「<」前のページボタン */}
            <button
                onClick={goPrev}
                disabled={currentPage === 1}
                className="p-2 text-center bg-gray-200 rounded-md sm:p-3 sm:min-w-10 sm:rounded-lg md:p-4 md:min-w-12 disabled:opacity-50"
            >
                &lt;
            </button>

            {/* ページ番号ボタン */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3">
                {createPageNumbers().map((page, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            if (page !== "...") {
                                changePage(page);
                            }
                        }}
                        className={`p-2 text-center rounded-md sm:p-3 sm:min-w-10 sm:rounded-lg sm:text-base md:p-4 md:min-w-12 md:text-lg ${
                            currentPage === page
                                ? "bg-orange-500 text-white"
                                : "bg-gray-200"
                        }`}
                        disabled={page === "..."}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {/* 「>」次のページボタン */}
            <button
                onClick={goNext}
                disabled={currentPage === totalPageCount}
                className="p-2 text-center bg-gray-200 rounded-md sm:p-3 sm:min-w-10 sm:rounded-lg md:p-4 md:min-w-12 disabled:opacity-50"
            >
                &gt;
            </button>
        </div>
    );
};

export default Pagination;
