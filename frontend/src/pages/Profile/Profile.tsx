import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { PublicProfile } from '../../types/user';
import { getPublicProfile } from '../../services/userService';
import Loader from '../../components/Loader/Loader';
import styles from './Profile.module.scss';

const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    const loadProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getPublicProfile(username);
        setProfile(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [username]);

  if (loading) return <Loader />;
  if (error) return <p>Error : {error}</p>;
  if (!profile) return <p>User not found.</p>;

  return (
    <section className={styles.profile}>
      {profile.avatar && (
        <img className={styles.avatar} src={profile.avatar} alt={profile.username} />
      )}
      <h1 className={styles.username}>{profile.username}</h1>
      <p className={styles.joined}>
        Member since {new Date(profile.createdAt).toLocaleDateString()}
      </p>
    </section>
  );
};

export default Profile;
