import React, { useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Tooltip,
    Paper,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import Popup from '../Popup';
import { notifyError, notifySuccess } from '../../Toastify';
import { confirm } from '../ConfirmGlobal';

const CategoriesPopup = ({ open, onClose, token, categories, tags }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showForm, setShowForm] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    const handleSelectCategory = (categoryId) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleSelectAll = (isChecked) => {
        if (isChecked) {
            setSelectedCategories(categories.map((category) => category.id));
        } else {
            setSelectedCategories([]);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const toggleForm = () => {
        setShowForm((prev) => !prev);
    };

    const handleSubmit = async () => {
        const newCategory = {
            label: categoryName,
            slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
            tags: selectedTags,
        };

        try {
            const response = await fetch('https://nest-api-sand.vercel.app/categories/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCategory),
            });

            if (response.ok) {
                console.log('Category created successfully:', await response.json());
                setCategoryName('');
                setSelectedTags([]);
                setShowForm(false);
                notifySuccess('Category created');
            } else {
                console.error('Error creating category:', response.statusText);
                notifyError('Error during creation');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            notifyError('Error during creation');
        }
    };

    const handleDeleteSelected = async () => {
        const userConfirmed = await confirm({
            title: "Do you really want to delete all selected categories?",
            content: "All categories will be removed forever, and tags will be placed as uncategorized.",
            variant: "danger"
        });
        if (userConfirmed) {
            try {
                for (const categoryId of selectedCategories) {
                    const response = await fetch(`https://nest-api-sand.vercel.app/categories/${categoryId}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        notifyError(`Error deleting category with ID ${categoryId}`);
                        console.error(`Error deleting category with ID ${categoryId}:`, response.statusText);
                        return;
                    }
                }

                notifySuccess(`${selectedCategories.length} categories deleted successfully`);
                setSelectedCategories([]);
            } catch (error) {
                console.error('Error deleting categories:', error);
                notifyError('An error occurred while deleting categories');
            }
        }
    };

    const paginatedCategories = categories.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Popup open={open} onClose={onClose} title="Manage categories">
            <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Tooltip title="Add new category">
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            sx={{ mr: 2 }}
                            onClick={toggleForm}
                        >
                            {showForm ? 'Close form' : 'Add new category'}
                        </Button>
                    </Tooltip>
                    <Tooltip title="Delete selected categories">
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon />}
                            disabled={selectedCategories.length === 0}
                            onClick={handleDeleteSelected}
                        >
                            Delete ({selectedCategories.length})
                        </Button>
                    </Tooltip>
                </Box>

                {showForm && (
                    <Box
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            mb: 2,
                        }}
                    >
                        <TextField
                            label="Category Name"
                            variant="outlined"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            required
                        />
                        <FormControl>
                            <InputLabel id="tag-select-label">Select Tags</InputLabel>
                            <Select
                                labelId="tag-select-label"
                                multiple
                                value={selectedTags}
                                onChange={(e) => setSelectedTags(e.target.value)}
                                renderValue={(selected) =>
                                    selected.map((tagId) => (
                                        <Chip
                                            key={tagId}
                                            label={tags.find((tag) => tag.id === tagId)?.label}
                                        />
                                    ))
                                }
                            >
                                {tags.map((tag) => (
                                    <MenuItem key={tag.id} value={tag.id}>
                                        {tag.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            Add the new category
                        </Button>
                    </Box>
                )}
            </Box>
            <Paper elevation={3}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={
                                            selectedCategories.length > 0 &&
                                            selectedCategories.length < categories.length
                                        }
                                        checked={
                                            categories.length > 0 &&
                                            selectedCategories.length === categories.length
                                        }
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                    />
                                </TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Tags Count</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedCategories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedCategories.includes(category.id)}
                                            onChange={() => handleSelectCategory(category.id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={category.label} color="primary" />
                                    </TableCell>
                                    <TableCell>{category.tags.length}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={categories.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Popup>
    );
};

export default CategoriesPopup;
