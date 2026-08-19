import './ProfilePanel.css';

import { useAuth } from '../../../context/AuthContext';
import placeholderImg from '../../../assets/images/profile-placeholder.avif';


function ProfilePanel({ onClose }) {
    const { logout, user } = useAuth();

    const handleLogout = () => {
        logout();
        if (onClose) onClose();
    };

    return (
        <div className="profile-panel-wrapper" role="menu" aria-label="Felhasználói menü">
            <div className="profile-panel-inner">
                <img
                    src={placeholderImg}
                    alt="Felhasználó profilképe"
                    className="profile-panel-img"
                />
                <h3 className="profile-panel-name">{user?.name}</h3>

                <button
                    type="button"
                    className="profile-panel-logout-btn"
                    onClick={handleLogout}
                    role="menuitem"
                >
                    Kijelentkezés
                </button>
            </div>
        </div>
    );
}

export default ProfilePanel;