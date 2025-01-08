import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { searchUsers } from "../service/user/user";
import styles from './SearchResultsPage.module.css';

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
                setSearchResults(results);
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
                            <Link to={`/user/detail/${user.userId}`}>
                                <img src={user.profilePictureUrl || "default-avatar-url"} alt={user.name} className={styles.avatar} />
                                <span>{user.name}</span>
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