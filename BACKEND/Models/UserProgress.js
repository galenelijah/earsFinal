// User Progress Schema
/*
Example document structure:
{
  email: "user@example.com",
  courses: [
    {
      title: "Computer Science Fundamentals",
      overall_progress: 30,
      last_accessed: "2024-03-14T12:00:00Z",
      modules: [
        {
          id: "cs_module1",
          title: "Introduction to Computer Science",
          status: "in-progress", // not-started, in-progress, completed
          progress: 60,
          last_position: 0, // scroll position
          completed_at: null,
          quiz_score: null
        }
      ]
    }
  ]
}
*/

const validateProgress = (progress) => {
  if (typeof progress !== 'number' || progress < 0 || progress > 100) {
    throw new Error('Progress must be a number between 0 and 100');
  }
  return true;
};

const validateStatus = (status) => {
  const validStatuses = ['not-started', 'in-progress', 'completed'];
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status. Must be one of: ' + validStatuses.join(', '));
  }
  return true;
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.includes(email)) {
    throw new Error('Invalid email format');
  }
  return true;
};

const validateModuleId = (moduleId) => {
  if (typeof moduleId !== 'string' || moduleId.trim().length === 0) {
    throw new Error('Module ID must be a non-empty string');
  }
  return true;
};

module.exports = {
  validateProgress,
  validateStatus,
  validateEmail,
  validateModuleId
}; 