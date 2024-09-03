import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import { backend } from 'declarations/backend';

type Post = {
  id: bigint;
  title: string;
  body: string;
  author: string;
  timestamp: bigint;
};

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
    setIsLoading(false);
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await backend.addPost(data.title, data.body, data.author);
      await fetchPosts();
      setModalIsOpen(false);
      reset();
    } catch (error) {
      console.error('Error adding post:', error);
    }
    setIsLoading(false);
  };

  return (
    <Container maxWidth="lg">
      <div className="hero bg-cover bg-center h-64 flex items-center justify-center mb-8" style={{backgroundImage: "url('https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixid=M3w2MzIxNTd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjUzODA3ODZ8&ixlib=rb-4.0.3')"}}>
        <Typography variant="h2" component="h1" className="text-white text-shadow-lg">
          Crypto Blog
        </Typography>
      </div>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setModalIsOpen(true)}
        className="mb-4"
      >
        Add New Post
      </Button>

      {isLoading ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={Number(post.id)}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {post.title}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    By {post.author}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {post.body}
                  </Typography>
                  <Typography variant="caption" display="block" gutterBottom>
                    {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Add New Post"
        className="modal"
        overlayClassName="overlay"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Typography variant="h6">Add New Post</Typography>
          <input {...register('title')} placeholder="Title" className="w-full p-2 border rounded" />
          <input {...register('author')} placeholder="Author" className="w-full p-2 border rounded" />
          <textarea {...register('body')} placeholder="Body" className="w-full p-2 border rounded h-32" />
          <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </form>
      </Modal>
    </Container>
  );
};

export default App;
