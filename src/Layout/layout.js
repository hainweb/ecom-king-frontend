import React, { useEffect } from 'react';
import UserHeader from '../Components/Userheader/UserHeader';

function Layout({  user, cartCount , darkMode,setDarkMode}) {
  // Use useEffect to add external scripts
 

  return (
    <div>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      
     
      <title>Shopping Cart</title>

      {/* Conditional rendering of headers */}
    
        <UserHeader user={user} cartCount={cartCount} darkMode={darkMode} setDarkMode={setDarkMode} />
      
    </div>
  );
}

export default Layout;
