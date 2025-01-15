import React from 'react';
import { deleteUser } from '../../service/user/user';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Fade, Backdrop } from '@mui/material';
import {toast} from "react-toastify";

function DeleteComponent({ userToDelete, isShowModal, handleIsShowModal, onDeleteSuccess }) {
    const handleDelete = async () => {

            await deleteUser(userToDelete.id);
            onDeleteSuccess();
            toast.success("Xóa thành công!");

    };

    return (
        <Modal
            open={isShowModal}
            onClose={handleIsShowModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={isShowModal}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    borderRadius: '8px',
                    boxShadow: 24,
                    p: 4,
                    textAlign: 'center',
                }}>
                    <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Xác nhận xóa người dùng
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
                        Bạn có chắc chắn muốn xóa người dùng{' '}
                        <span style={{ color: 'red', fontWeight: 'bold' }}>
                            {userToDelete ? `${userToDelete.firstName} ${userToDelete.lastName}` : ''}
                        </span>
                        ?
                    </Typography>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                        <Button
                            onClick={handleIsShowModal}
                            sx={{
                                mr: 2,
                                px: 3,
                                py: 1,
                                borderRadius: '20px',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    backgroundColor: '#e0e0e0',
                                }
                            }}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleDelete}
                            variant="contained"
                            color="error"
                            sx={{
                                px: 3,
                                py: 1,
                                borderRadius: '20px',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    backgroundColor: '#d32f2f',
                                }
                            }}
                        >
                            Xóa
                        </Button>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
}

export default DeleteComponent;