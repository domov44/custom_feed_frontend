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
    const [categories, setCategories] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const getTokenFromCookie = () => {
        return Cookies.get('token');
    };

    const token = getTokenFromCookie();

    useEffect(() => {
        const fetchTagsAndCategories = async () => {
            if (token) {
                try {
                    const responseTags = await fetch('https://nest-api-sand.vercel.app/tags/', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    const responseCategories = await fetch('https://nest-api-sand.vercel.app/categories/', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!responseTags.ok || !responseCategories.ok) {
                        throw new Error('Failed to fetch tags or categories');
                    }

                    const tags = await responseTags.json();
                    const categories = await responseCategories.json();

                    const uncategorizedTags = tags
                        .filter(tag => tag.categories.length === 0)
                        .map(tag => ({
                            id: tag.id,
                            label: tag.label
                        }));

                    const categorizedTags = categories.map(category => {
                        const categoryTags = tags.filter(tag =>
                            tag.categories.some(cat => cat.id === category.id)
                        );
                        return {
                            ...category,
                            tags: categoryTags.map(tag => ({
                                id: tag.id,
                                label: tag.label
                            }))
                        };
                    });

                    setCategories([
                        ...categorizedTags,
                        { id: 'uncategorized', label: 'Uncategorized', tags: uncategorizedTags }
                    ]);

                } catch (error) {
                    console.error('Error fetching tags or categories:', error);
                }
            } else {
                console.log('Token is not available');
            }
        };

        fetchTagsAndCategories();
    }, [token]);

    const handleSelectTag = (tagId) => {
        setSelectedTags((prevSelectedTags) =>
            prevSelectedTags.includes(tagId)
                ? prevSelectedTags.filter((id) => id !== tagId)
                : [...prevSelectedTags, tagId]
        );
    };

    const handleSelectCategory = (categoryId, isChecked) => {
        const category = categories.find(cat => cat.id === categoryId);
        if (!category) return;

        const categoryTagIds = category.tags.map(tag => tag.id);

        setSelectedTags(prevSelectedTags => isChecked
            ? [...new Set([...prevSelectedTags, ...categoryTagIds])]
            : prevSelectedTags.filter(tagId => !categoryTagIds.includes(tagId))
        );
    };

    const handleSelectAll = () => {
        const allTagIds = categories.flatMap(category => category.tags.map(tag => tag.id));

        if (selectAll) {
            setSelectedTags([]);
        } else {
            setSelectedTags(allTagIds);
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

                    if (!response.ok) {
                        deletionSuccessful = false;
                        console.error(`Failed to delete tag ${tagId}`);
                    }
                }

                if (deletionSuccessful) {
                    setCategories(prevCategories => prevCategories.map(category => ({
                        ...category,
                        tags: category.tags.filter(tag => !selectedTags.includes(tag.id))
                    })));
                    notifySuccess('All selected tags were deleted');
                } else {
                    notifyError('Error deleting some tags');
                }

                setSelectedTags([]);
                setSelectAll(false);

            } catch (error) {
                notifyError('Error deleting tags');
                console.error('Error deleting tags:', error);
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

    const paginatedCategories = categories.slice(
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
                    Your tags
                </Typography>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'center',
                }}>
                    <Tooltip title="Add new tags">
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => openPopup("add_tag")}
                            sx={{ mr: 2 }}
                        >
                            Add tags
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
            <Paper elevation={3} sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow sx={{
                                backgroundColor: 'background.paper',
                            }}>
                                <TableCell padding="checkbox" sx={{ padding: '4px 8px' }}>
                                    <Checkbox
                                        indeterminate={
                                            selectedTags.length > 0 &&
                                            selectedTags.length < categories.flatMap(category => category.tags).length
                                        }
                                        checked={
                                            categories.flatMap(category => category.tags).length > 0 &&
                                            selectedTags.length === categories.flatMap(category => category.tags).length
                                        }
                                        onChange={handleSelectAll}
                                        color="primary"
                                    />
                                </TableCell>
                                <TableCell sx={{ padding: '4px 8px' }}>Tags</TableCell>
                                <TableCell align="right" sx={{ padding: '4px 8px' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedCategories.map((category) => (
                                <React.Fragment key={category.id}>
                                    <TableRow hover sx={{ padding: '4px 8px' }}>
                                        <TableCell padding="checkbox" sx={{ padding: '4px 8px' }}>
                                            <Checkbox
                                                checked={category.tags.every(tag => selectedTags.includes(tag.id))}
                                                onChange={(event) => handleSelectCategory(category.id, event.target.checked)}
                                                color="primary"
                                            />
                                        </TableCell>
                                        <TableCell colSpan={4} sx={{ padding: '4px 8px' }}>
                                            <Chip label={category.label} color="primary" />
                                        </TableCell>
                                    </TableRow>
                                    {category.tags.map((tag) => (
                                        <TableRow key={tag.id} hover sx={{ backgroundColor: 'background.paper', padding: '4px 8px' }}>
                                            <TableCell padding="checkbox" sx={{ padding: '4px 8px' }}>
                                                <Checkbox
                                                    checked={selectedTags.includes(tag.id)}
                                                    onChange={() => handleSelectTag(tag.id)}
                                                    color="primary"
                                                />
                                            </TableCell>
                                            <TableCell sx={{ padding: '4px 8px' }}>{tag.label}</TableCell>
                                            <TableCell align="right" sx={{ padding: '4px 8px' }}>
                                                <Tooltip title="Edit Tag">
                                                    <IconButton color="primary">
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Tag">
                                                    <IconButton color="error" onClick={() => handleDeleteTags(tag.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    sx={{
                        backgroundColor: 'background.paper',
                    }}
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={categories.flatMap(category => category.tags).length}
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
