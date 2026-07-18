import { useEffect } from 'react';

const BASE_TITLE = 'Popcorn Library';

const usePageTitle = (title?: string) => {
  useEffect(() => {
    document.title = title ? `${BASE_TITLE} — ${title}` : BASE_TITLE;
    return () => {
      document.title = BASE_TITLE;
    };
  }, [title]);
};

export default usePageTitle;
