import React, { useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    Chip,
    IconButton,
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
    Edit as EditIcon
} from '@mui/icons-material';
import Popup from '../Popup';

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
            } else {
                console.error('Error creating category:', response.statusText);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
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
                                <TableCell align="right">Actions</TableCell>
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
                                    <TableCell align="right">
                                        <Tooltip title="Edit Category">
                                            <IconButton color="primary">
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Category">
                                            <IconButton color="error">
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
