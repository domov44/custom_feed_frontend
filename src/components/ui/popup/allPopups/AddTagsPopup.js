import React, { useState } from 'react';
import Popup from '../Popup';
import { TextField, Button, Box, Chip, IconButton } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { notifyError, notifySuccess } from '../../Toastify';

const AddTagsPopup = ({ open, onClose, token }) => {
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
            for (const tag of tags) {
                const response = await fetch('https://nest-api-sand.vercel.app/tags/', {
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

                if (!response.ok) {
                    throw new Error('Failed to add tag');
                }
            }
            notifySuccess("Tags added successfuly")
            onClose();
        } catch (err) {
            notifyError("Error during tags submit")
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Popup open={open} onClose={onClose} title="Add Tags">
            <form onSubmit={handleSubmitTag}>
                <TextField
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    label="Enter Tag"
                    placeholder="Type a new tag"
                    value={tagInput}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
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
