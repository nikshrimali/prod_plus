import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
  LinearProgress,
  Chip,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import config from '../config';

function Goals() {
  const [goals, setGoals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal_type: 'MONTHLY',
    target_date: new Date(),
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.API_BASE_URL}/api/goals/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const handleOpenDialog = (goal = null) => {
    if (goal) {
      setEditingGoal(goal);
      setFormData({
        title: goal.title,
        description: goal.description,
        goal_type: goal.goal_type,
        target_date: new Date(goal.target_date),
      });
    } else {
      setEditingGoal(null);
      setFormData({
        title: '',
        description: '',
        goal_type: 'MONTHLY',
        target_date: new Date(),
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingGoal(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingGoal
        ? `${config.API_BASE_URL}/api/goals/${editingGoal.id}`
        : `${config.API_BASE_URL}/api/goals/`;
      const method = editingGoal ? 'PUT' : 'POST';

      // Format the data before sending
      const formattedData = {
        ...formData,
        goal_type: formData.goal_type.toLowerCase(),
        target_date: formData.target_date.toISOString()
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      fetchGoals();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.API_BASE_URL}/api/goals/${goalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const getGoalProgress = (goal) => {
    const totalTasks = goal.tasks?.length || 0;
    const completedTasks = goal.tasks?.filter((task) => task.is_completed).length || 0;
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  };

  const getGoalTypeColor = (type) => {
    switch (type) {
      case 'MONTHLY':
        return 'primary';
      case 'QUARTERLY':
        return 'secondary';
      case 'YEARLY':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Goals</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
        >
          Add Goal
        </Button>
      </Box>

      <Grid container spacing={3}>
        {goals.map((goal) => (
          <Grid item xs={12} md={6} lg={4} key={goal.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">{goal.title}</Typography>
                  <Chip
                    label={goal.goal_type}
                    color={getGoalTypeColor(goal.goal_type)}
                    size="small"
                  />
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {goal.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Target Date: {format(new Date(goal.target_date), 'PPP')}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={getGoalProgress(goal)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {goal.tasks?.filter((task) => task.is_completed).length || 0} of{' '}
                    {goal.tasks?.length || 0} tasks completed
                  </Typography>
                </Box>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(goal)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteGoal(goal.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingGoal ? 'Edit Goal' : 'Create New Goal'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Goal Type</InputLabel>
                  <Select
                    value={formData.goal_type}
                    onChange={(e) =>
                      setFormData({ ...formData, goal_type: e.target.value })
                    }
                  >
                    <MenuItem value="MONTHLY">Monthly</MenuItem>
                    <MenuItem value="QUARTERLY">Quarterly</MenuItem>
                    <MenuItem value="YEARLY">Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <DateTimePicker
                  label="Target Date"
                  value={formData.target_date}
                  onChange={(date) =>
                    setFormData({ ...formData, target_date: date })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingGoal ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default Goals; 