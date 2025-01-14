import React from "react";

export default function MutualFriends({mutualFriends}) {
    if (!Array.isArray(mutualFriends) || mutualFriends.length === 0) {
        return <div>
            <div className="d-flex" style={{fontSize: "12px", color: "#6C757D"}}>
               Chưa có bạn chung
            </div>
        </div>;
    }

    return (
        <div style={{display: "flex", alignItems: "center"}}>
            <div className="d-flex">
                {mutualFriends.slice(0, 2).map((friend) => (
                    <img
                        key={friend.userId}
                        src={friend.userProfilePictureUrl}
                        alt={friend.userFirstName}
                        className="rounded-circle me-1"
                        style={{width: "20px", height: "20px"}}
                    />
                ))}
                {mutualFriends.length > 2 && (
                    <span className="text-muted small ms-1">
                +{mutualFriends.length - 2}
            </span>
                )}
            </div>
            <div className="text-muted small me-2" style={{marginBottom: 0}}>
                {mutualFriends.length} bạn chung
            </div>
        </div>
    );
}