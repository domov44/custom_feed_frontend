import React, { useEffect, useState } from 'react';
import {
    Typography,
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Button,
    Box,
    Chip,
    TablePagination,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Add as AddIcon,
    Edit as EditIcon
} from '@mui/icons-material';
import Cookies from 'js-cookie';
import AddTagsPopup from '../../components/ui/popup/allPopups/AddTagsPopup';
import { usePopup } from '../../contexts/PopupContext';
import { confirm } from '../../components/ui/popup/ConfirmGlobal';
import { notifyError, notifySuccess } from '../../components/ui/Toastify';

export default function ImprovedTagsManagement() {
    const { popups, openPopup, closePopup } = usePopup();
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const getTokenFromCookie = () => {
        return Cookies.get('token');
    };

    const token = getTokenFromCookie();

    useEffect(() => {
        const fetchData = async () => {

            if (token) {
                try {
                    const response = await fetch('https://nest-api-sand.vercel.app/tags/', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch tags');
                    }

                    const data = await response.json();
                    setTags(data);
                } catch (error) {
                    console.error('Error fetching tags:', error);
                }
            } else {
                console.log('Token is not available');
            }
        };

        fetchData();
    }, []);

    const handleSelectTag = (tagId) => {
        setSelectedTags((prevSelectedTags) =>
            prevSelectedTags.includes(tagId)
                ? prevSelectedTags.filter((id) => id !== tagId)
                : [...prevSelectedTags, tagId]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedTags([]);
        } else {
            setSelectedTags(tags.map((tag) => tag.id));
        }
        setSelectAll(!selectAll);
    };

    async function handleDeleteTags() {
        const userConfirmed = await confirm({
            title: "Do you really want to delete all selected tags?",
            content: "All selected tags will be removed forever.",
            variant: "danger"
        });

        if (userConfirmed) {
            try {
                let deletionSuccessful = true;

                for (let tagId of selectedTags) {
                    const response = await fetch(`https://nest-api-sand.vercel.app/tags/${tagId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        setTags((prevTags) => prevTags.filter((tag) => tag.id !== tagId));
                    } else {
                        deletionSuccessful = false;
                        console.error(`Failed to delete tag ${tagId}`);
                    }
                }

                if (deletionSuccessful) {
                    notifySuccess('All selected tags were deleted');
                } else {
                    notifyError('Error deleting some tags');
                }

            } catch (error) {
                notifyError('Error deleting tags');
                console.error('Error deleting tags:', error);
            }
        }
    }


    async function handleDeleteOneTag(id) {
        const userConfirmed = await confirm({
            title: "Do you really want to delete this tag?",
            content: "The tag will be removed forever.",
            variant: "danger"
        });

        if (userConfirmed) {
            try {
                const response = await fetch(`https://nest-api-sand.vercel.app/tags/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    notifySuccess('The tag was deleted')
                    setTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
                } else {
                    notifyError('Error deleting tag')
                    console.error('Failed to delete tag');
                }
            } catch (error) {
                notifyError('Error deleting tag')
                console.error('Error deleting tag:', error);
            }
        }
    }


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedTags = tags.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Container component="main" maxWidth="lg">
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                    mt: 1
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Tag Management
                </Typography>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'center',
                }}>
                    <Box>
                        <Tooltip title="Add New Tag">
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={() => openPopup("add_tag")}
                                sx={{ mr: 2 }}
                            >
                                Add Tag
                            </Button>
                        </Tooltip>
                        <Tooltip title="Delete Selected Tags">
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={handleDeleteTags}
                                disabled={selectedTags.length === 0}
                            >
                                Delete ({selectedTags.length})
                            </Button>
                        </Tooltip>
                    </Box>
                </Box>
            </Box>
            <Paper elevation={3} sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={
                                            selectedTags.length > 0 &&
                                            selectedTags.length < tags.length
                                        }
                                        checked={
                                            tags.length > 0 &&
                                            selectedTags.length === tags.length
                                        }
                                        onChange={handleSelectAll}
                                        color="primary"
                                    />
                                </TableCell>
                                <TableCell>ID</TableCell>
                                <TableCell>Label</TableCell>
                                <TableCell>Slug</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedTags.map((tag) => (
                                <TableRow
                                    key={tag.id}
                                    hover
                                    sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        backgroundColor: selectedTags.includes(tag.id)
                                            ? 'action.selected'
                                            : 'transparent'
                                    }}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedTags.includes(tag.id)}
                                            onChange={() => handleSelectTag(tag.id)}
                                            color="primary"
                                        />
                                    </TableCell>
                                    <TableCell>{tag.id}</TableCell>
                                    <TableCell>{tag.label}</TableCell>
                                    <TableCell>{tag.slug}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit Tag">
                                            <IconButton color="primary">
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Tag">
                                            <IconButton color="error" onClick={() => handleDeleteOneTag(tag.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={tags.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <AddTagsPopup
                open={popups["add_tag"]}
                onClose={() => closePopup("add_tag")}
                token={token}
            />
        </Container>
    );
}