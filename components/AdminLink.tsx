import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMe } from '@/lib/api';

const AdminLink = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAdmin = async () => {
      try {
        const { user } = await getMe();
        if (!user || !mounted) return;
        setIsAdmin((user.roles || []).includes('admin'));
      } catch (err) {
        // ignore
      }
    };

    checkAdmin();

    return () => {
      mounted = false;
    };
  }, []);

  if (!isAdmin) return null;

  return (
    <Link
      to="/admin/users"
      className="text-sm font-medium text-primary hover:underline"
    >
      Admin
    </Link>
  );
};

export default AdminLink;
