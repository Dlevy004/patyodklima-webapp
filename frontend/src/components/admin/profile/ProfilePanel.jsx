import './ProfilePanel.css';

import { useAuth } from '../../../context/AuthContext';
import placeholderImg from '../../../assets/images/profile-placeholder.avif';
import ModalBackdrop from '../common/ModalBackdrop'
import EditUserDataModal from '../profile/EditUserDataModal'
import useModal from '../../../hooks/useModal'
import useSaveData from '../../../hooks/useSaveData'


function ProfilePanel({ onClose, isInstallable, installPWA }) {
    const { logout, user } = useAuth();

    const handleLogout = () => {
        logout();
        if (onClose) onClose();
    };

    const editModal = useModal();
    const { saveData } = useSaveData();

    const handleSaveUser = async (formData) => {
        const success = await saveData(`${import.meta.env.VITE_API_URL}/api/auth/profile`, 'PUT', formData);

        if (success) {
            editModal.close();
            window.location.reload();
        }
    };

    return (
        <>
            <div className="profile-panel-wrapper" role="menu" aria-label="Felhasználói menü">
                <div className="profile-panel-inner">
                    <img
                        src={user?.profilePicUrl || placeholderImg}
                        alt="Felhasználó profilképe"
                        className="profile-panel-img"
                    />
                    <h3 className="profile-panel-name">{user?.fullName || 'Adminisztrátor'}</h3>
                    <p className="profile-panel-role">{user?.role}</p>

                    <button
                        type="button"
                        className="profile-panel-userdata-btn"
                        onClick={() => editModal.open(user)}
                        role="menuitem"
                    >
                        Adatok módosítása
                    </button>

                    {isInstallable && (
                        <button
                            type="button"
                            className="profile-panel-install-btn"
                            onClick={installPWA}
                            role="menuitem"
                        >
                            App telepítése
                        </button>
                    )}

                    <button
                        type="button"
                        className="profile-panel-logout-btn"
                        onClick={handleLogout}
                        role="menuitem"
                    >
                        Kijelentkezés
                    </button>

                    <p className="profile-panel-version">Verzió:&nbsp; v2.2.0</p>
                </div>
            </div>

            <ModalBackdrop isOpen={editModal.isOpen} onClose={editModal.close}>
                <EditUserDataModal
                    onClose={editModal.close}
                    onSave={handleSaveUser}
                    userData={editModal.selectedItem}
                />
            </ModalBackdrop>
        </>
    );
}

export default ProfilePanel;