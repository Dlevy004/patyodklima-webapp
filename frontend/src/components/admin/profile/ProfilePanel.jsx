import './ProfilePanel.css';

import { toast } from 'react-hot-toast';

import { useAuth } from '../../../context/AuthContext';
import { getAuthHeaders } from '../../../utils/api';
import placeholderImg from '../../../assets/images/profile-placeholder.avif';
import ModalBackdrop from '../common/ModalBackdrop'
import EditUserDataModal from '../profile/EditUserDataModal'
import EditCompanyDataModal from '../profile/EditCompanyDataModal'
import useModal from '../../../hooks/useModal'
import useSaveData from '../../../hooks/useSaveData'


function ProfilePanel({ onClose, isInstallable, installPWA }) {
    const { logout, user } = useAuth();
    const { saveData } = useSaveData();

    const userModal = useModal();
    const companyModal = useModal();

    const handleLogout = () => {
        logout();
        if (onClose) onClose();
    };

    const handleSaveUser = async (formData) => {
        const success = await saveData(`${import.meta.env.VITE_API_URL}/api/auth/profile`, 'PUT', formData);

        if (success) {
            userModal.close();
            window.location.reload();
        }
    };

    const handleOpenCompanyModal = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/company`, {
                method: 'GET',
                headers: getAuthHeaders({ 'Content-Type': 'application/json' })
            });

            if (response.ok) {
                const data = await response.json();
                companyModal.open(data.company);
            } else {
                toast.error('Nem sikerült betölteni a cégadatokat.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Hiba történt a szerverrel való kommunikáció során.');
        }
    };

    const handleSaveCompany = async (formData) => {
        const success = await saveData(`${import.meta.env.VITE_API_URL}/api/company`, 'PUT', formData);

        if (success) {
            companyModal.close();
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
                        onClick={() => userModal.open(user)}
                        role="menuitem"
                    >
                        Adatok módosítása
                    </button>

                    <button
                        type="button"
                        className="profile-panel-companydata-btn"
                        onClick={handleOpenCompanyModal}
                        role="menuitem"
                    >
                        Cégadatok
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

            <ModalBackdrop isOpen={userModal.isOpen} onClose={userModal.close}>
                <EditUserDataModal
                    onClose={userModal.close}
                    onSave={handleSaveUser}
                    userData={userModal.selectedItem}
                />
            </ModalBackdrop>

            <ModalBackdrop isOpen={companyModal.isOpen} onClose={companyModal.close}>
                <EditCompanyDataModal
                    onClose={companyModal.close}
                    onSave={handleSaveCompany}
                    companyData={companyModal.selectedItem}
                />
            </ModalBackdrop>
        </>
    );
}

export default ProfilePanel;