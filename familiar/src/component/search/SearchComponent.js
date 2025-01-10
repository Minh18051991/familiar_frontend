import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, Form, InputGroup} from 'react-bootstrap';
import {FaBriefcase, FaMapMarkedAlt, FaSearch} from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom';
import {searchUsers} from '../../service/user/user';
import styles from './SearchComponent.module.css';
import {FaEnvelope} from "react-icons/fa6";

const SearchComponent = ({initialResults, showAllResults}) => {
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState(initialResults || []);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (searchValue.trim() !== '') {
            const delayDebounceFn = setTimeout(() => {
                handleSearch();
            }, 300);
            return () => clearTimeout(delayDebounceFn);
        } else {
            setSearchResults([]);
            setShowResults(false);
        }
    }, [searchValue]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (initialResults) {
            setSearchResults(initialResults);
            setShowResults(true);
        }
    }, [initialResults]);

    const handleSearch = async () => {
        if (searchValue.trim() === '') return;

        setIsLoading(true);
        try {
            const results = await searchUsers(searchValue, 0, 6);
            console.log("Search results:", results);
            if (results.error) {
                console.error(results.error);
            } else {
                setSearchResults(results.content || []);
                setShowResults(true);
            }
        } catch (error) {
            console.error("Error searching users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewAll = () => {
        navigate(`/search?q=${encodeURIComponent(searchValue)}`);
    };

    const handleUserClick = (userId) => {
        setShowResults(false);
        navigate(`/users/detail/${userId}`);
    };


    const renderSearchResults = () => {
        const resultsToShow = showAllResults ? searchResults : searchResults.slice(0, 5);
        return (
            <div className={styles.searchResults}>
                {resultsToShow.map((user) => (
                    <Card key={user.userId}
                          className={`mb-2 ${styles.resultCard}`}
                          onClick={() => handleUserClick(user.userId)}
                    >
                        <Card.Body>
                            <Link to={`/users/detail/${user.userId}`} className="text-decoration-none">
                                <div className="d-flex align-items-center">
                                    <img
                                        src={user.userProfilePictureUrl || "https://via.placeholder.com/40"}
                                        alt={`${user.userFirstName} ${user.userLastName}`}
                                        className={`${styles.searchResultAvatar} rounded-circle me-2`}
                                    />
                                    <div>
                                        <div className="fw-bold">{`${user.userFirstName} ${user.userLastName}`}</div>
                                        <div className="text-muted small"><FaBriefcase
                                            className="me-1"/> {user.userOccupation}</div>
                                        <div className="text-muted small"><FaEnvelope className="me-1"/>{user.userEmail}
                                        </div>
                                        <div className="text-muted small"><FaMapMarkedAlt
                                            className="me-1"/>{user.userAddress}</div>
                                    </div>
                                </div>
                            </Link>
                        </Card.Body>
                    </Card>
                ))}
                {!showAllResults && searchResults.length > 5 && (
                    <Button
                        variant="outline-primary"
                        className="w-100 mt-2"
                        onClick={handleViewAll}
                    >
                        Xem tất cả kết quả
                    </Button>
                )}
            </div>
        );
    };

    return (
        <div className={styles.searchContainer} ref={searchRef}>
            {!showAllResults && (
                <InputGroup>
                    <Form.Control
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className={styles.searchInput}
                    />
                    <InputGroup.Text className={styles.searchIcon}>
                        <FaSearch/>
                    </InputGroup.Text>
                </InputGroup>
            )}
            {(showResults || showAllResults) && searchResults.length > 0 && renderSearchResults()}
        </div>
    );
};

export default SearchComponent;