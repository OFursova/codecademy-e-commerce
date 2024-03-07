import { useState, useEffect } from 'react';

const useAuthentication = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const apiUrl = process.env.API_URL || 'http://127.0.0.1:8000';

    const checkAuthentication = async () => {
      try {
        const response = await fetch(`${apiUrl}/auth/check-auth`, {
          method: 'GET',
          credentials: 'include'
        });
        console.log(response);
        if (response.ok) {
          setAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    checkAuthentication();
  }, []);

  return authenticated;
};

export default useAuthentication;
