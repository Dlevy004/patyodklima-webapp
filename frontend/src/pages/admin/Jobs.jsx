import ScrollUp from '@/components/common/ScrollUp';
import TableHeader from '@/components/admin/common/TableHeader';
import DataStateFeedback from '@/components/admin/common/DataStateFeedback'
import ModalBackdrop from '@/components/admin/common/ModalBackdrop'
import JobItem from '@/components/admin/jobs/JobItem';
import usePageTitle from '@/hooks/usePageTitle';
import useModal from '@/hooks/useModal';
import useDeleteData from '@/hooks/useDeleteData';
import useSaveData from '@/hooks/useSaveData';
import useFetch from '@/hooks/useFetch';
import DeleteDataModal from '@/components/admin/common/DeleteDataModal';
import AddEditJobModal from '@/components/admin/jobs/AddEditJobModal';

const API_URL = `${import.meta.env.VITE_API_URL}/api/jobs`
const CLIENT_API_URL = `${import.meta.env.VITE_API_URL}/api/clients`

const categoryTranslations = {
    survey: 'Felmérés',
    installation: 'Telepítés',
    maintenance: 'Karbantartás',
    cleaning: 'Tisztítás'
};


function Jobs() {
    usePageTitle('Munkanapló');

    const { data: jobs = [], isLoading, error, refetch } = useFetch(API_URL);
    const { data: clients = [] } = useFetch(CLIENT_API_URL);
    const isEmpty = !isLoading && !error && jobs?.length === 0;

    const deleteModal = useModal();
    const editModal = useModal();

    const { deleteData } = useDeleteData();
    const { saveData } = useSaveData();

    const handleConfirmDelete = async () => {
        if (!deleteModal.selectedItem) return;

        const success = await deleteData(`${API_URL}/${deleteModal.selectedItem.id}`);

        if (success) {
            deleteModal.close();
            refetch();
        }
    };

    const handleSaveJob = async (formData) => {
        const isEditing = Boolean(editModal.selectedItem);
        const url = isEditing ? `${API_URL}/${editModal.selectedItem.id}` : API_URL;
        const method = isEditing ? 'PUT' : 'POST';

        const success = await saveData(url, method, formData);

        if (success) {
            editModal.close();
            refetch();
        }
    };

    return (
        <>
            <TableHeader onAddClick={() => editModal.open()} />

            <div className='table-content'>
                <DataStateFeedback
                    isLoading={isLoading}
                    error={error}
                    isEmpty={isEmpty}
                    emptyMessage={'Nincsenek rögzített munkák az adatbázisban.'}
                >
                    {jobs?.map((job) => (
                        <JobItem
                            key={job.id}
                            client_name={job.clients?.full_name}
                            category={categoryTranslations[job.category]}
                            date={new Date(job.job_date).toLocaleDateString('hu-HU')}
                            isCompleted={false}
                            onToggleStatus={false}
                            onDelete={() => deleteModal.open(job)}
                            onEdit={() => editModal.open(job)}
                        />
                    ))}
                </DataStateFeedback>
            </div>

            <ModalBackdrop isOpen={deleteModal.isOpen} onClose={deleteModal.close}>
                <DeleteDataModal
                    titleData={'Munka'}
                    descriptionData={'munkát'}
                    onClose={deleteModal.close}
                    onDelete={handleConfirmDelete}
                />
            </ModalBackdrop>

            <ModalBackdrop isOpen={editModal.isOpen} onClose={editModal.close}>
                <AddEditJobModal
                    onClose={editModal.close}
                    onSave={handleSaveJob}
                    jobData={editModal.selectedItem}
                    clientsList={clients}
                />
            </ModalBackdrop>

            <ScrollUp />
        </>
    )
}

export default Jobs