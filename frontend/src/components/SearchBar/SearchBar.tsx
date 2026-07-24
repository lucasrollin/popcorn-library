import { useState } from 'react';
import type { FormEvent } from 'react';
import Button from '../Button/Button';
import styles from './SearchBar.module.scss';

type SearchBarProps = {
  defaultValue?: string;
  onSearch: (query: string) => void;
  loading?: boolean;
  placeholder?: string;
};

const SearchBar = ({
  defaultValue = '',
  onSearch,
  loading = false,
  placeholder = 'Search for a film…',
}: SearchBarProps) => {
  const [query, setQuery] = useState(defaultValue);
  const [prevDefaultValue, setPrevDefaultValue] = useState(defaultValue);

  // The URL owns the query, so when it changes on its own (browser back/forward)
  // the input has to follow. Typing only ever touches `query`.
  if (defaultValue !== prevDefaultValue) {
    setPrevDefaultValue(defaultValue);
    setQuery(defaultValue);
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        className={styles.input}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Search for a film"
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Searching…' : 'Search'}
      </Button>
    </form>
  );
};

export default SearchBar;
