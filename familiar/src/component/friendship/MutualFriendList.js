import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getMutualFriends } from "../../service/friendship/friendshipService";
import { useParams } from "react-router-dom";
import MutualItem from "./MutualItem";

function MutualFriendList() {
  const [friendList, setFriendList] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { id: userId2 } = useParams();
  const userId = useSelector((state) => state.user.account.userId);

  useEffect(() => {
    const fetchMutualFriends = async () => {
      try {
        const res = await getMutualFriends(userId, userId2, page, 4);
        if (res) {
          setFriendList((prev) => (page === 0 ? res.content : [...prev, ...res.content]));
          setHasMore(!res.last);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchMutualFriends();
  }, [userId, userId2, page]);

  const handleMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
      <div className="container">
        <h5
            className="mb-3 justify-content-center text-primary text-center mt-4"
            style={{ textAlign: "center" }}
        >
          BẠN BÈ CHUNG
        </h5>
        {friendList.length > 0 ? (
            <div className="row justify-content-center" style={{ display: "flex", justifyContent: "center" }}>
              {friendList.map((user, index) => (
                  <MutualItem key={index} data={user} />
              ))}
            </div>
        ) : (
            <div className="text-center mt-5">
              <h5>Không có bạn bè chung nào</h5>
              <p>Hãy kiểm tra lại sau nhé!</p>
            </div>
        )}

        {hasMore && (
            <div className="text-center mt-3">
              <button className="btn btn-light" onClick={handleMore}>
                Xem thêm
              </button>
            </div>
        )}
      </div>
  );
}

export default MutualFriendList;
