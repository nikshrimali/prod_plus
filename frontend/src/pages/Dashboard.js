import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Button,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

function Dashboard() {
  const [stats, setStats] = useState({
    total_points: 0,
    weekly_completed: 0,
    weekly_total: 0,
    monthly_completed: 0,
    monthly_total: 0,
  });
  const [todayTasks, setTodayTasks] = useState([]);

  useEffect(() => {
    // Fetch dashboard stats and today's tasks
    // This is a placeholder - implement actual API calls
    const fetchData = async () => {
      try {
        // Fetch stats
        const statsResponse = await fetch('/api/dashboard/stats');
        const statsData = await statsResponse.json();
        setStats(statsData);

        // Fetch today's tasks
        const tasksResponse = await fetch('/api/tasks/today');
        const tasksData = await tasksResponse.json();
        setTodayTasks(tasksData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const weeklyProgress = stats.weekly_total > 0
    ? (stats.weekly_completed / stats.weekly_total) * 100
    : 0;

  const monthlyProgress = stats.monthly_total > 0
    ? (stats.monthly_completed / stats.monthly_total) * 100
    : 0;

  const chartData = [
    { name: 'Weekly', completed: stats.weekly_completed, total: stats.weekly_total },
    { name: 'Monthly', completed: stats.monthly_completed, total: stats.monthly_total },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Points Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Points
              </Typography>
              <Typography variant="h3" color="primary">
                {stats.total_points}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Weekly Progress Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weekly Progress
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ flexGrow: 1, mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={weeklyProgress}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {Math.round(weeklyProgress)}%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {stats.weekly_completed} of {stats.weekly_total} tasks completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Progress Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Progress
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ flexGrow: 1, mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={monthlyProgress}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {Math.round(monthlyProgress)}%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {stats.monthly_completed} of {stats.monthly_total} tasks completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Progress Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Progress Overview
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completed" fill="#2196f3" name="Completed" />
                    <Bar dataKey="total" fill="#e0e0e0" name="Total" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Tasks */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Tasks
              </Typography>
              <List>
                {todayTasks.map((task) => (
                  <ListItem
                    key={task.id}
                    secondaryAction={
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          // Implement task completion logic
                        }}
                      >
                        Complete
                      </Button>
                    }
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={task.is_completed}
                        onChange={() => {
                          // Implement task completion logic
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={task.title}
                      secondary={`${format(new Date(task.start_time), 'HH:mm')} - ${format(
                        new Date(task.end_time),
                        'HH:mm'
                      )}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 