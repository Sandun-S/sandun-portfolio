import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  // Adding custom CSS into layout to handle mobile menu styling easily 
  // without cluttering index.css
  return (
    <>
      <style>{`
        .desktop-nav { display: none !important; }
        .mobile-toggle { display: block !important; }
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
      <Header />
      <main style={{ paddingTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
