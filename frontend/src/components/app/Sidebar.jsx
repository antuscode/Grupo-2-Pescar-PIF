import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOutIcon } from 'lucide-react';
import { Avatar } from './Avatar';
import { useAppData } from '../../contexts/AppDataContext';

export function Sidebar({ nav, user, profileTo, open }) {
  const { signOut } = useAppData();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/perfil', { replace: true });
  };

  return (
    <aside className={open ? 'sidebar sidebar--open' : 'sidebar'} aria-label="Navegación principal">
      <nav>
        {nav.map((group, index) =>
        <div className="sidebar__group" key={index}>
            {group.section && <p className="sidebar__section">{group.section}</p>}
            <div className="sidebar__nav">
              {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>
                  
                    <Icon size={16} aria-hidden="true" />
                    {item.label}
                  </NavLink>);

            })}
            </div>
          </div>
        )}
      </nav>

      <div className="sidebar__user">
        <Avatar initials={user.initials} />
        {profileTo ?
        <Link to={profileTo} className="sidebar__user-info">
            <p className="sidebar__user-name">{user.shortName}</p>
            <p className="sidebar__user-role">{user.role}</p>
          </Link> :

        <div className="sidebar__user-info">
            <p className="sidebar__user-name">{user.shortName}</p>
            <p className="sidebar__user-role">{user.role}</p>
          </div>
        }
        <button type="button" className="sidebar__logout" aria-label="Cerrar sesión" title="Cerrar sesión" onClick={handleLogout}>
          <LogOutIcon size={16} aria-hidden="true" />
        </button>
      </div>
    </aside>);

}