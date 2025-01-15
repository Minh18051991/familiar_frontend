import { Link } from "react-router-dom";
import MutualFriends from "../MutualFriends";
import {useEffect, useState} from "react";
import {
  cancelFriendship,
  deleteFriendship,
  mutualFriendList,
  sendFriendship
} from "../../../service/friendship/friendshipService";
import {useSelector} from "react-redux";

function MutualItem({ data }) {
  const [isSendAddRequest, setIsSendAddRequest] = useState(null);
  const [mutualFriends, setMutualFriends] = useState([]);

  const userId = useSelector((state) => state.user.account.userId);
  const userId2 = data.userId;

  const handleFriendshipAction = async () => {
    if (isSendAddRequest === null) {
      // call api xoa ban be
      await deleteFriendship(userId, userId2);
      setIsSendAddRequest(false);
    } else {
      if (isSendAddRequest) {
        // call api huy yeu cau ket ban
        await cancelFriendship(userId, userId2);
      } else {
        // call api yeu cau ket ban
        await sendFriendship(userId, userId2);
      }
      setIsSendAddRequest(!isSendAddRequest);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await mutualFriendList(userId, userId2, 0, 5);
        setMutualFriends(data || []);
      } catch (error) {
        console.error("Error fetching mutual friends:", error);
        setMutualFriends([]);
      }
    };
    fetchData();
  }, [userId, userId2]);

  return (
    <div className="col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
      <div
        className="card shadow-sm text-center"
        style={{ width: "250px", padding: "10px" }}
      >
        <img
          src={data?.userProfilePictureUrl}
          alt="Friend Avatar"
          className="card-img-top rounded-circle mx-auto mt-3"
          style={{
            width: "120px",
            height: "120px",
            objectFit: "cover",
          }}
        />
        <div className="card-body d-flex flex-column justify-content-center align-items-center">
          <Link
            to={`/users/detail/${data?.userId}`}
            className="text-decoration-none text-dark"
          >
            <h5 className="card-title">
              {data?.userFirstName} {data?.userLastName}
            </h5>
          </Link>
          <div className="my-3">
            <MutualFriends mutualFriends={mutualFriends} friendId={data?.userId}/>
          </div>
          <button
            onClick={handleFriendshipAction}
            className={`btn btn-sm px-4 ${
              isSendAddRequest || isSendAddRequest === null
                ? "btn-outline-secondary"
                : "btn-primary"
            }`}
          >
            {isSendAddRequest === null
              ? "Xoá bạn bè"
              : isSendAddRequest
              ? "Huỷ kết bạn"
              : "Kết bạn"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MutualItem;
