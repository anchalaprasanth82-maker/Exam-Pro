const xlsx = require('xlsx');
const db = require('../config/db');

const importQuestionsFromExcel = async (examId, filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet);

  const imported = [];
  const failed = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const { question_text, type, option_a, option_b, option_c, option_d, correct_answer, marks, explanation } = row;

    if (!question_text || !type || !correct_answer || !marks) {
      failed.push({ row: i + 2, reason: 'Missing required fields' });
      continue;
    }

    if (!['MCQ', 'SHORT', 'CODING'].includes(type.toUpperCase())) {
      failed.push({ row: i + 2, reason: 'Invalid question type' });
      continue;
    }

    const options = type.toUpperCase() === 'MCQ' 
      ? JSON.stringify([option_a, option_b, option_c, option_d].filter(Boolean))
      : null;

    try {
      await db.execute({
        sql: 'INSERT INTO questions (exam_id, type, question_text, options, correct_answer, explanation, marks, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        args: [examId, type.toUpperCase(), question_text, options, correct_answer.toString(), explanation || '', marks, i]
      });
      imported.push(row);
    } catch (error) {
      failed.push({ row: i + 2, reason: error.message });
    }
  }

  return { importedCount: imported.length, failed };
};

module.exports = { importQuestionsFromExcel };
