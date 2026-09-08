import { useState } from 'react';

import PropTypes from 'prop-types';
import { SquarePen } from 'lucide-react';

import './EditUserDataModal.css';

import useUserForm from '../../../hooks/useUserForm';
import InputField from '../common/InputField';
import placeholderImg from '../../../assets/images/profile-placeholder.avif';

const inputFields = [
    { name: 'fullName', label: 'Név megváltoztatása', type: 'text' },
    { name: 'currentPassword', label: 'Jelenlegi jelszó', type: 'password' },
    { name: 'newPassword', label: 'Új jelszó', type: 'password' },
    { name: 'newPasswordConfirm', label: 'Új jelszó mégegyszer', type: 'password' },
];


function EditUserDataModal({ onClose, onSave, userData }) {
    const {
        formData, formErrors,
        handleInputChange, validateForm
    } = useUserForm(userData);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(userData?.profile_pic_url || placeholderImg);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
            if (validateForm()) {
            const submitData = new FormData();

            submitData.append('fullName', formData.fullName);

            if (formData.newPassword) {
                submitData.append('currentPassword', formData.currentPassword);
                submitData.append('newPassword', formData.newPassword);
            }

            if (selectedFile) {
                submitData.append('profileImage', selectedFile);
            }

            onSave(submitData);
        }
    };

    return (
        <form
            className='user-data-modal'
            onSubmit={handleSubmit}
            noValidate
            aria-labelledby="modal-title"
        >
            <div className='title-bg'>
                <h1 id="modal-title">Saját adatok módosítása</h1>
            </div>
            <div className='user-datas-wrapper'>
                <div className='user-wrapper-left'>
                    <div className='client-avatar'>
                        <label htmlFor="profile-image-upload" className="avatar-label">
                            <img src={previewUrl} alt="Felhasználó profilképe" className="avatar-img" />

                            <div className="avatar-overlay">
                                <SquarePen className="avatar-icon" color="#f2f2f2" aria-hidden='true' size={40}/>
                            </div>
                        </label>

                        <input
                            id="profile-image-upload"
                            type="file"
                            accept="image/*"
                            className="avatar-input"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
                <div className='user-wrapper-right'>
                    {inputFields.map((field) => (
                        <InputField
                            key={field.name}
                            label={field.label}
                            type={field.type}
                            value={formData[field.name]}
                            onChange={(event) => handleInputChange(field.name, event)}
                            error={formErrors[field.name]}
                        />
                    ))}
                </div>
            </div>
            <div className='modal-buttons'>
                <button type='button' className='modal-close-btn' onClick={onClose}>Mégse</button>
                <button type='submit' className='modal-save-btn'>Mentés</button>
            </div>
        </form>
    )
}

EditUserDataModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    userData: PropTypes.object
};

export default EditUserDataModal;