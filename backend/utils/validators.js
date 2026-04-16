const validateExam = (data) => {
  const { title, duration, passing_score, start_time, end_time } = data;
  if (!title || !duration || !passing_score || !start_time || !end_time) {
    return 'All fields are required';
  }
  if (duration <= 0) return 'Duration must be positive';
  if (passing_score < 0 || passing_score > 100) return 'Passing score must be between 0 and 100';
  return null;
};

const validateQuestion = (data) => {
  const { type, question_text, correct_answer, marks } = data;
  if (!type || !question_text || !correct_answer || marks === undefined) {
    return 'Missing required question fields';
  }
  if (!['MCQ', 'SHORT', 'CODING'].includes(type)) {
    return 'Invalid question type';
  }
  return null;
};

module.exports = { validateExam, validateQuestion };
