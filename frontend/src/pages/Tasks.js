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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import config from '../config';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    points: 0,
    due_date: new Date(),
    start_time: new Date(),
    end_time: new Date(),
    goal_id: '',
  });

  useEffect(() => {
    fetchTasks();
    fetchGoals();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.API_BASE_URL}/api/tasks/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
      setError('');
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks. Please try again later.');
    }
  };

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
      setError('');
    } catch (error) {
      console.error('Error fetching goals:', error);
      setError('Failed to fetch goals. Please try again later.');
    }
  };

  const handleOpenDialog = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        points: task.points,
        due_date: new Date(task.due_date),
        start_time: new Date(task.start_time),
        end_time: new Date(task.end_time),
        goal_id: task.goal_id || '',
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        points: 0,
        due_date: new Date(),
        start_time: new Date(),
        end_time: new Date(),
        goal_id: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTask(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingTask
        ? `${config.API_BASE_URL}/api/tasks/${editingTask.id}`
        : `${config.API_BASE_URL}/api/tasks/`;
      const method = editingTask ? 'PUT' : 'POST';

      // Format dates to ISO strings
      const formattedData = {
        ...formData,
        due_date: formData.due_date.toISOString(),
        start_time: formData.start_time.toISOString(),
        end_time: formData.end_time.toISOString(),
        goal_id: formData.goal_id || null, // Convert empty string to null
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

      fetchTasks();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving task:', error);
      setError(error.message || 'Error saving task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.API_BASE_URL}/api/tasks/${taskId}/complete`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchTasks();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Tasks</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
        >
          Add Task
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} md={6} lg={4} key={task.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">{task.title}</Typography>
                  <Chip
                    label={task.is_completed ? 'Completed' : 'Pending'}
                    color={task.is_completed ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {task.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Due: {format(new Date(task.due_date), 'PPP')}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Time: {format(new Date(task.start_time), 'HH:mm')} -{' '}
                  {format(new Date(task.end_time), 'HH:mm')}
                </Typography>
                <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                  Points: {task.points}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(task)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  {!task.is_completed && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleCompleteTask(task.id)}
                    >
                      Complete
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTask ? 'Edit Task' : 'Create New Task'}
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Points"
                  value={formData.points}
                  onChange={(e) =>
                    setFormData({ ...formData, points: parseInt(e.target.value) })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Goal</InputLabel>
                  <Select
                    value={formData.goal_id}
                    onChange={(e) =>
                      setFormData({ ...formData, goal_id: e.target.value })
                    }
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {goals.map((goal) => (
                      <MenuItem key={goal.id} value={goal.id}>
                        {goal.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <DateTimePicker
                  label="Due Date"
                  value={formData.due_date}
                  onChange={(date) =>
                    setFormData({ ...formData, due_date: date })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Start Time"
                  value={formData.start_time}
                  onChange={(date) =>
                    setFormData({ ...formData, start_time: date })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="End Time"
                  value={formData.end_time}
                  onChange={(date) =>
                    setFormData({ ...formData, end_time: date })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingTask ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default Tasks; 