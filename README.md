# Productivity Plus

A comprehensive productivity application that helps you manage tasks, track goals, maintain a journal, and schedule your time effectively.

## Features

- Task Management
  - Create, edit, and delete tasks
  - Assign points to tasks
  - Mark tasks as complete
  - Track task completion progress

- Goal Tracking
  - Set monthly, quarterly, and yearly goals
  - Link tasks to goals
  - Monitor goal progress
  - Visual progress indicators

- Journal
  - Daily journal entries
  - Rich text editing
  - Date-based organization
  - Search and filter capabilities

- Calendar
  - Visual task scheduling
  - Drag-and-drop interface
  - Multiple view options (day, week, month)
  - Task reminders

- Dashboard
  - Overview of daily tasks
  - Progress tracking
  - Points system
  - Performance statistics

## Tech Stack

### Backend
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- Celery (for task reminders)
- Redis (for Celery backend)

### Frontend
- React
- Material-UI
- React Big Calendar
- Recharts
- Axios

## Prerequisites

- Python 3.8+
- Node.js 14+
- PostgreSQL
- Redis

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/productivity-plus.git
cd productivity-plus
```

2. Set up the backend:
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize database
alembic upgrade head
```

3. Set up the frontend:
```bash
cd frontend
npm install
```

4. Start Redis server:
```bash
redis-server
```

## Running the Application

1. Start the backend server:
```bash
# From the root directory
uvicorn backend.main:app --reload
```

2. Start the Celery worker:
```bash
# From the root directory
celery -A backend.celery_app worker --loglevel=info
```

3. Start the frontend development server:
```bash
# From the frontend directory
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL=postgresql://user:password@localhost:5432/productivity_plus
SECRET_KEY=your-secret-key-here
REDIS_URL=redis://localhost:6379/0
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI for the beautiful UI components
- React Big Calendar for the calendar functionality
- FastAPI for the high-performance backend framework 