import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

function Home() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome to Productivity Plus
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Your Tasks
            </Typography>
            <Typography>
              Manage your daily tasks and track your progress.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Your Goals
            </Typography>
            <Typography>
              Set and monitor your long-term goals.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Journal
            </Typography>
            <Typography>
              Keep track of your thoughts and reflections.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Calendar
            </Typography>
            <Typography>
              Schedule and organize your activities.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home; 