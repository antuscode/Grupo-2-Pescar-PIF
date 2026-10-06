import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { FloatingLumi } from './FloatingLumi';
import { TopBar } from '../TopBar';
import { useAppData } from '../../contexts/AppDataContext';
import { employeeNav, managerNav } from '../../data/navigation';
import './app.css';

// variant: 'employee' | 'manager'
export function AppShell({ variant }) {
  const { user } = useAppData();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Cierra el menú del celular al cambiar de página
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isManager = variant === 'manager';

  return (
    <div className={isManager ? 'app' : 'app app--employee'}>
      <TopBar logoTo={isManager ? '/equipo' : '/app'} onMenu={() => setMenuOpen(true)} menuOpen={menuOpen} />

      <div className="app__body">
        <Sidebar
          nav={isManager ? managerNav : employeeNav}
          user={user}
          profileTo={isManager ? '/equipo/perfil' : '/app/perfil'}
          open={menuOpen} />
        
        {menuOpen && <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />}

        <main className="app-main">
          <div className="app-container">
            <Outlet />
          </div>
        </main>
      </div>
      <FloatingLumi variant={variant} />
    </div>);

}