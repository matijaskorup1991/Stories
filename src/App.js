import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
// import Check from './check.png';

import styles from './App.module.css';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

function App() {
  const useSemiPersistantState = (key, initialState) => {
    const [value, setValue] = useState(
      localStorage.getItem(key) || initialState
    );

    useEffect(() => {
      localStorage.setItem(key, value);
    }, [value, key]);

    return [value, setValue];
  };

  const [searchTerm, setSearchTerm] = useSemiPersistantState('search', 'React');

  const [stories, setStories] = useState(null);

  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

  const handleSearchInput = (e) => setSearchTerm(e.target.value);

  const handleSearchSubmit = (e) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    e.preventDefault();
  };

  const handleFetchStories = useCallback(async () => {
    try {
      const result = await axios.get(url);
      console.log(result);
      setStories(result.data.hits);
    } catch (error) {
      console.log(error);
    }
  }, [url]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  // function handleSearch(e) {
  //   setSearchTerm(e.target.value);
  // }

  function handleRemoveStory(item) {
    const newStories =
      stories && stories.filter((story) => story.objectID !== item.objectID);
    setStories(newStories);
  }

  const searchedStories =
    stories &&
    stories.filter((story) => {
      return story.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

  return (
    <div className={styles.container}>
      <h1 className={styles.headlinePrimary}>My Hacker Stories </h1>
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <List list={searchedStories} onRemoveItem={handleRemoveStory} />
    </div>
  );
}

function List({ list, onRemoveItem }) {
  return (
    list &&
    list.map((item) => (
      <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
    ))
  );
}

function Item({ item, onRemoveItem }) {
  return (
    <div className={styles.item}>
      <span style={{ width: '40%' }}>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={{ width: '30%' }}>{item.author}</span>
      <span style={{ width: '10%' }}>{item.points}</span>
      <span style={{ width: '10%' }}>
        <button
          className={`${styles.button} ${styles.buttonSmall}`}
          type='button'
          onClick={() => onRemoveItem(item)}
        >
          Dismiss
        </button>
        {/* <check height='19px' width='19px' /> */}
      </span>
    </div>
  );
}

function InputWithLabel({
  id,
  type,
  value,
  isFocused,
  onInputChange,
  children,
}) {
  const inputRef = useRef();

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id} className={styles.label}>
        {children}
      </label>
      &nbsp;
      <input
        className={styles.input}
        id={id}
        type={type}
        ref={inputRef}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
}

function SearchForm({ searchTerm, onSearchInput, onSearchSubmit }) {
  return (
    <form onSubmit={onSearchSubmit} className={styles.searchForm}>
      <InputWithLabel
        id='search'
        label='Search'
        type='text'
        value={searchTerm}
        isFocused
        onInputChange={onSearchInput}
      >
        <strong>Search:</strong>
      </InputWithLabel>
      <button
        type='submit'
        disabled={!searchTerm}
        className={`${styles.button} ${styles.buttonLarge}`}
      >
        Submit
      </button>
    </form>
  );
}

export default App;
