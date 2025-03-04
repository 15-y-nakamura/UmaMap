import React from "react";

const Credit = () => {
    return (
        <div className="mt-3 mr-2 text-center text-xs text-gray-600 sm:mt-4 sm:mr-4 sm:text-right sm:text-sm md:mt-5 md:mr-6 md:text-base lg:mt-6">
            <p>
                Powered by{" "}
                <a
                    href="http://webservice.recruit.co.jp/"
                    className="text-blue-500 hover:text-orange-500"
                >
                    ホットペッパーグルメ Webサービス
                </a>
            </p>
            <p>【画像提供：ホットペッパー グルメ】</p>
        </div>
    );
};

export default Credit;
