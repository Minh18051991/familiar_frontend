import React, { useState, useEffect, useRef } from 'react';
import { Form, InputGroup, Card } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { searchUsers } from '../../service/user/user';
import styles from './SearchComponent.module.css';

const SearchComponent = () => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

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

  return (
    <div className={styles.searchContainer} ref={searchRef}>
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Tìm kiếm..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className={styles.searchInput}
        />
        <InputGroup.Text className={styles.searchIcon}>
          <FaSearch />
        </InputGroup.Text>
      </InputGroup>
      {showResults && searchResults.length > 0 && (
        <div className={styles.searchResults}>
          {searchResults.map((user) => (
            <Card key={user.userId} className={`mb-2 ${styles.resultCard}`}>
              <Card.Body>
                <Link to={`/users/detail/${user.userId}`} className="text-decoration-none">
                  <div className="d-flex align-items-center">
                    <img
                      src={user.userProfilePictureUrl || "https://via.placeholder.com/40"}
                      alt={`${user.userFirstName} ${user.userLastName}`}
                      className={`${styles.searchResultAvatar} rounded-circle me-2`}
                    />
                    <div>
                      <span className="fw-bold">{`${user.userFirstName} ${user.userLastName}`}</span>
                    </div>
                  </div>
                </Link>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;