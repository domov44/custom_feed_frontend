import React, { useState, useEffect } from 'react';
import Popup from '../Popup';
import { TextField, Button, Box, Chip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { notifyError, notifySuccess } from '../../Toastify';

const AddTagsPopup = ({ open, onClose, token, categories }) => {
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [existingTags, setExistingTags] = useState([]);

    useEffect(() => {
        if (category) {
            const selectedCategory = categories.find(cat => cat.id === category);
            if (selectedCategory?.tags) {
                setExistingTags(selectedCategory.tags);
            }
        }
    }, [category, categories]);

    const handleInputChange = (e) => {
        setTagInput(e.target.value);
        if (e.target.value.trim()) {
            setError(null);
        }
    };

    const handleAddTag = () => {
        const trimmedTag = tagInput.trim();
        if (trimmedTag && !tags.some(tag => tag.label === trimmedTag)) {
            const slug = trimmedTag.toLowerCase().replace(/\s+/g, '-');
            setTags([...tags, { label: trimmedTag, slug }]);
            setTagInput('');
        } else {
            setError('Tag cannot be empty or duplicate');
        }
    };

    const handleDeleteTag = (tagToDelete) => {
        setTags(tags.filter(tag => tag.label !== tagToDelete));
    };

    const handleSubmitTag = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const newTagIds = [];
            for (const tag of tags) {
                const tagResponse = await fetch('https://nest-api-sand.vercel.app/tags/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        label: tag.label,
                        slug: tag.slug,
                    }),
                });

                if (!tagResponse.ok) {
                    throw new Error('Failed to add tag');
                }
                const tagData = await tagResponse.json();
                newTagIds.push(tagData.id);
            }

            const existingTagIds = existingTags.map(tag => tag.id);
            const allTagIds = [...existingTagIds, ...newTagIds];

            const patchResponse = await fetch(`https://nest-api-sand.vercel.app/categories/${category}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tags: allTagIds,
                }),
            });

            if (!patchResponse.ok) {
                throw new Error('Failed to update category with new tags');
            }

            notifySuccess('Tags added successfully');
            onClose();
        } catch (err) {
            notifyError('Error during tags submit');
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Popup open={open} onClose={onClose} title="Add Tags">
            <form onSubmit={handleSubmitTag}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="category-select-label">Select Category</InputLabel>
                    <Select
                        labelId="category-select-label"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        fullWidth
                        required
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                                {cat.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {category && (
                    <Box sx={{ mb: 2 }}>
                        <InputLabel sx={{ mb: 1 }}>Existing Tags</InputLabel>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {existingTags.map((tag) => (
                                <Chip
                                    key={tag.id}
                                    label={tag.label}
                                    color="default"
                                />
                            ))}
                        </Box>
                    </Box>
                )}

                <TextField
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    label="Enter Tag"
                    placeholder="Type a new tag"
                    value={tagInput}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault() && handleAddTag()}
                    sx={{ mb: 2 }}
                    error={Boolean(error)}
                    helperText={error}
                />

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {tags.map((tag, index) => (
                        <Chip
                            key={index}
                            label={tag.label}
                            onDelete={() => handleDeleteTag(tag.label)}
                            color="primary"
                            sx={{
                                backgroundColor: '#e3f2fd',
                                '& .MuiChip-deleteIcon': {
                                    color: '#1976d2',
                                },
                            }}
                        />
                    ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button
                        type="button"
                        variant="outlined"
                        color="primary"
                        onClick={handleAddTag}
                        sx={{
                            width: '48%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        startIcon={<AddCircleOutline />}
                    >
                        Add Tag
                    </Button>

                    {tags.length > 0 && (
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{
                                width: '48%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Adding tags...' : 'Submit tags'}
                        </Button>
                    )}
                </Box>
            </form>
        </Popup>
    );
};

export default AddTagsPopup;