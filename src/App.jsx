import { useTheme } from './hooks/useTheme';
import Navbar         from './components/Navbar';
import Hero           from './components/Hero';
import Portfolio      from './components/Portfolio';
import Packages       from './components/Packages';
import Booking        from './components/Booking';
import Footer         from './components/Footer';
import PortfolioAdmin from './components/PortfolioAdmin';
import './index.css';

export default function App() {
  const { dark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark">
      <Navbar dark={dark} onToggleTheme={toggle} />
      <main>
        <Hero />
        <Portfolio />
        <Packages />
        <Booking />
      </main>
      <Footer />
      <PortfolioAdmin />
    </div>
  );
}
