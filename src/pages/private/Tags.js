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
import { useAuth } from '../../contexts/AuthContext';
import Cookies from 'js-cookie';

export default function ImprovedTagsManagement() {
    const { currentUser } = useAuth();
    const [tags, setTags] = useState([]); 
    const [selectedTags, setSelectedTags] = useState([]); 
    const [selectAll, setSelectAll] = useState(false);
    
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const getTokenFromCookie = () => {
        return Cookies.get('token');
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = getTokenFromCookie();

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

    const handleAddTags = () => {
        console.log('Ajouter des tags', selectedTags);
    };

    const handleDeleteTags = () => {
        console.log('Supprimer les tags', selectedTags);
    };

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
                    mb: 3,
                    mt: 2
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Tag Management
                </Typography>
                <Chip 
                    label={currentUser.username} 
                    color="primary" 
                    variant="outlined" 
                />
            </Box>

            <Paper elevation={3} sx={{ width: '100%', mb: 2 }}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    p: 2 
                }}>
                    <Box>
                        <Tooltip title="Add New Tag">
                            <Button 
                                variant="contained" 
                                color="primary" 
                                startIcon={<AddIcon />}
                                onClick={handleAddTags}
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
                    count={tags.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Container>
    );
}