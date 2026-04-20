import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Header />
      <main className="flex-grow p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
