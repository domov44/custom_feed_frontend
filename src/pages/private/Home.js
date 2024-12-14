import React, { useEffect, useState } from 'react';
import { Grid, Typography, Card, CardContent, CardMedia, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Cookies from 'js-cookie';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
  },
}));

const StyledCardMedia = styled(CardMedia)({
  height: '180px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
});

const StyledCardContent = styled(CardContent)({
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
});

const Feed = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = Cookies.get('token');

        if (!token) {
          console.error('Token absent dans les cookies');
          return;
        }

        const response = await fetch('https://nest-api-sand.vercel.app/feed', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des vidéos');
        }

        const data = await response.json();
        setVideos(data.items);
      } catch (error) {
        console.error("Erreur lors de la récupération des vidéos: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <Container component="main" maxWidth="lg">
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StyledCard>
                <Skeleton variant="rectangular" width="100%" height={180} />
                <StyledCardContent>
                  <Skeleton width="60%" height={20} />
                  <Skeleton width="40%" height={15} />
                </StyledCardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="lg">
      <Grid container spacing={3}>
        {videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video.id.videoId}>
            <a href={video.url} target="_blank" style={{ textDecoration: 'none' }} rel="noreferrer">
              <StyledCard>
                <StyledCardMedia
                  image={video.thumbnail}
                  title={video.title}
                />
                <StyledCardContent>
                  <Typography variant="h6" component="div" noWrap>
                    {video.title}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" display="block" noWrap>
                    {video.channelTitle}
                  </Typography>
                </StyledCardContent>
              </StyledCard>
            </a>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Feed;
