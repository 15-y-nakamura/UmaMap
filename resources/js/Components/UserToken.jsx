import axios from "axios";

const fetchUserId = async (setUserId) => {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const response = await axios.post("/api/user-token", { token });
            setUserId(response.data.user_id);
        } catch (error) {
            console.error("ユーザーIDの取得中にエラーが発生しました:", error);
        }
    } else {
        console.log("トークンが見つかりませんでした。");
    }
};

export default fetchUserId;
