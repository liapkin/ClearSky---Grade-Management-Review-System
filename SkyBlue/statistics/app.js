const express = require('express');
const axios = require('axios');
const requestGrades = require('./requestGrades');
const requestEnrolledExams = require('./requestEnrolledExams');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/statistics/stats', async (req, res) => {
    const student_id = 1; 
    const { examination_id } = req.query;
  
    try {
        if (examination_id) {

            const grades = await requestGrades(examination_id);

            if (grades.length === 0) {
                return res.status(404).json({ message: `No grades found for student_id: ${student_id}` });
            }

            const passed = grades.filter(g => g.value >= 5).length;
            const passRate = (passed / grades.length) * 100;

            const distribution = {
                '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0
            }; 

            grades.forEach(({ value }) => {
                const score = Math.floor(value);
                if (score == 0) distribution['0']++;
                else if (score == 1) distribution['1']++;
                else if (score == 2) distribution['2']++;
                else if (score == 3) distribution['3']++;
                else if (score == 4) distribution['4']++;
                else if (score == 5) distribution['5']++;
                else if (score == 6) distribution['6']++;
                else if (score == 7) distribution['7']++;
                else if (score == 8) distribution['8']++;
                else if (score == 9) distribution['9']++;
                else distribution['10']++;
            });

            return res.json({
                student_id: student_id,
                examination_id: examination_id,
                students_passed: passed,
                pass_rate: passRate.toFixed(2) + '%',
                distribution: distribution
            });
        }

        const enrolled_exams = await requestEnrolledExams(student_id);

        const examIds = enrolled_exams.map(e => e.examination_id);
        const results = [];
        for (const id of examIds) {
            try {
                const response = await axios.get(`http://statistics:3000/statistics/stats`, {
                    params: {
                        // student_id,
                        examination_id: id
                    }
                });
                results.push({ examination_id: id, data: response.data });
            } catch (err) {
                results.push({ examination_id: id, error: err.message });
            }
        }

        res.json({ student_id: student_id, statistics: results });



    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

