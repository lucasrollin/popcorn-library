import usePageTitle from '../../hooks/usePageTitle';
import EmptyState from '../../components/EmptyState/EmptyState';

const NotFound = () => {
  usePageTitle('Page not found');

  return (
    <EmptyState
      title="Page not found"
      emoji="🎞️"
      message="This one never made it to the screen."
      action={{ label: 'Back to the homepage', to: '/' }}
    />
  );
};

export default NotFound;
