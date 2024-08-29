'use client'

/**
 *
 * WatchList
 *
 */

import { useSession } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useAuthContext } from "../../context/authContext"

function ClerkToken() {
  const { session } = useSession();
  const { setUser } = useAuthContext();
  const user = session?.user;  
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (session) {
//         session.getToken().then((jwt) => {
//           if(jwt){       
//             setUser({
//               "data": {
//                 "email": user?.primaryEmailAddress.emailAddress,
//                 "profile_image": user?.imageUrl, 
//                 "username": user?.firstName,
//               },
//               "isAuthenticated": true,
//               "message": "Login Successful",
//               "token": jwt
//             })
           
//           }      
//         });
       
//       }
//     }, 10 * 1000); // Refresh every 45 seconds


// return () => clearInterval(interval);
//   }, [session]);
useEffect(() => {
  const fetchToken = async () => {
    if (session) {
      const jwt = await session.getToken({ template: "authtoken" });
      if (user) {
        setUser({
          "data": {
            "email": user.primaryEmailAddress?.emailAddress,
            "profile_image": user?.imageUrl,
            "username": user.firstName,
          },
          "isAuthenticated": true,
          "message": "Login Successful",
          "token": jwt,
        });
      }
    }
  };

  fetchToken();
}, [session, user]);

  return <></>;
}

export default ClerkToken;
