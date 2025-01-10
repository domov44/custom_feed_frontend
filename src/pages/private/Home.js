import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Skeleton,
  Box,
  Link,
  Button,
  CircularProgress,
  CardHeader,
  CardActionArea,
  IconButton,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Cookies from 'js-cookie';
import ClearIcon from '@mui/icons-material/Clear';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const Feed = () => {
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = Cookies.get('token');

        if (!token) {
          console.error('Token absent dans les cookies');
          return;
        }

        const response = await fetch('https://nest-api-sand.vercel.app/categories', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des catégories');
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories: ', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const fetchVideos = async (categoryId = null, pageToken = null) => {
    if (pageToken) setLoadingMore(true);
    else setLoading(true);

    try {
      const token = Cookies.get('token');

      if (!token) {
        console.error('Token absent dans les cookies');
        return;
      }

      const url = categoryId
        ? `https://nest-api-sand.vercel.app/feed/${categoryId}?pageToken=${pageToken || ''}`
        : `https://nest-api-sand.vercel.app/feed?pageToken=${pageToken || ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des vidéos');
      }

      const data = await response.json();
      setVideos((prevVideos) => (pageToken ? [...prevVideos, ...data.items] : data.items));
      setNextPageToken(data.nextPageToken || null);
    } catch (error) {
      console.error('Erreur lors de la récupération des vidéos: ', error);
    } finally {
      if (pageToken) setLoadingMore(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchVideos(categoryId);
  };

  const clearCategory = () => {
    setSelectedCategory(null);
    fetchVideos();
  };

  const loadMoreVideos = () => {
    if (nextPageToken) {
      fetchVideos(selectedCategory, nextPageToken);
    }
  };

  return (
    <Container component="main" maxWidth="lg">
      {loadingCategories ? (
        <Box display="flex" gap={2} mb={4} flexWrap="wrap">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton variant="rectangular" width={100} height={36} key={index} />
          ))}
        </Box>
      ) : (
        <Box display="flex" gap={2} mb={4} flexWrap="wrap">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'contained' : 'outlined'}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.label}
            </Button>
          ))}
          <Button
            variant="outlined"
            color="secondary"
            onClick={clearCategory}
            disabled={!selectedCategory}
            startIcon={<ClearIcon />}
          >
            Clear Category
          </Button>
        </Box>
      )}

      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 9 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ maxWidth: 345, borderRadius: 2, boxShadow: 3 }}>
                <Box display="flex" alignItems="center" p={2} gap={2}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box flexGrow={1}>
                    <Skeleton width="60%" height={20} />
                    <Skeleton width="40%" height={15} />
                  </Box>
                  <Skeleton variant="circular" width={32} height={32} />
                </Box>
                <Skeleton variant="rectangular" width="100%" height={194} />
                <Box p={2}>
                  <Skeleton width="80%" height={20} />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          <Grid container spacing={3}>
            {videos.map((video) => (
              <Grid item xs={12} sm={6} md={4} key={video.id.videoId || video.id.playlistId}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardHeader
                    avatar={
                      <Tooltip title={video.channel.title}>
                        <IconButton sx={{ p: 0 }} component={Link} href={video.channel.url} target='_blank'>
                          <Avatar src={video.channel.avatar} alt={video.channel.title} />
                        </IconButton>
                      </Tooltip>
                    }
                    action={
                      <IconButton aria-label="settings">
                        <MoreVertIcon />
                      </IconButton>
                    }
                    title={
                      <Link
                        href={video.channel.url}
                        target="_blank"
                        rel="noreferrer"
                        underline="none"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          color: 'inherit',
                        }}
                      >
                        {video.channel.title}
                      </Link>
                    }
                    subheader={formatDate(video.publishedAt)}
                  />
                  <CardActionArea href={video.url} target='_blank'>
                    <CardMedia
                      component="img"
                      height="194"
                      image={video.thumbnail}
                      alt={video.title}
                      title={video.title}
                    />
                    <CardContent>
                      <Typography
                        variant="h6"
                        rel="noreferrer"
                        color="textPrimary"
                        sx={{
                          textDecoration: 'none',
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          WebkitLineClamp: 1,
                        }}
                      >
                        {video.title}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          {nextPageToken && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={loadMoreVideos}
                disabled={loadingMore}
                startIcon={loadingMore ? <CircularProgress size={20} /> : null}
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </Button>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Feed;
