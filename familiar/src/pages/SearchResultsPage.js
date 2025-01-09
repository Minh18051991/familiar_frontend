import React, { useState, useEffect } from 'react';
import {Link, useLocation} from 'react-router-dom';
import styles from './SearchResultsPage.module.css';
import { searchUsers } from "../service/user/user";
import {FaBriefcase, FaMapMarkerAlt, FaUser} from "react-icons/fa";
import {FaEnvelope} from "react-icons/fa6";

const SearchResultsPage = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const searchQuery = new URLSearchParams(location.search).get('q');
        if (searchQuery) {
            fetchSearchResults(searchQuery);
        }
    }, [location]);

    const fetchSearchResults = async (query) => {
        setLoading(true);
        try {
            const results = await searchUsers(query);
            if (results.error) {
                console.error(results.error);
            } else {
                setSearchResults(results.content || []);
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.searchResultsPage}>
            <h1>Kết quả tìm kiếm</h1>
            {searchResults.length > 0 ? (
                <ul className={styles.resultsList}>
                    {searchResults.map((user) => (
                        <li key={user.userId} className={styles.resultItem}>
                            <Link to={`/users/detail/${user.userId}`} className="text-decoration-none">
                            <img src={user.userProfilePictureUrl || "default-avatar-url"} alt={user.userFirstName} className={styles.avatar} />
                            <div>
                                <div>
                                    <h3>
                                        {`${user.userFirstName} ${user.userLastName}`}
                                    </h3>
                                    <p>
                                        <FaBriefcase className="me-2" />
                                        {user.userOccupation}
                                    </p>
                                    <p>
                                        <FaEnvelope className="me-2" />
                                        {user.userEmail}
                                    </p>
                                    <p>
                                        <FaMapMarkerAlt className="me-2" />
                                        {user.userAddress}
                                    </p>
                            </div>
                            </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Không tìm thấy kết quả nào.</p>
            )}
        </div>
    );
};

export default SearchResultsPage;