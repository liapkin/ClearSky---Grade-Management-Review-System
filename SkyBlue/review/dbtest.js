const db = require('./models'); // από τον φάκελο που δημιούργησε το sequelize-auto

async function run() {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Η σύνδεση ήταν επιτυχής.');

    // Παράδειγμα: πάρε όλους τους μαθητές
    const students = await db.students.findAll();
    students.forEach(student => {
      console.log(`${student.name} ${student.surname} (${student.email})`);
    });

  } catch (error) {
    console.error('❌ Σφάλμα σύνδεσης:', error);
    return;
  }

  try {
    // Χρήση include για JOIN - βρίσκουμε το grade με id=7 και τα σχετικά reviews
    const grade = await db.grades.findOne({
      where: { id: 7 },
      include: [{ model: db.reviews, as: "reviews" }]
  });

    if (grade) {
      
      // Εμφάνιση των reviews
      if (grade.reviews && grade.reviews.length > 0) {
        grade.reviews.forEach(review => {
          console.log(`Review ID: ${review.id}, Grade ID: ${review.grade_id}, State: ${review.state}`);
        });
      } else {
        console.log('No reviews found for this grade.');
      }
    } else {
      console.log('Grade with id=7 not found.');
    }

  } catch (error) {
    console.error('❌ Σφάλμα κατά την ανάκτηση βαθμών ή κριτικών:', error);
  }
  
  finally {
    await db.sequelize.close();
    console.log('🔒 Η σύνδεση έκλεισε.');
  }

  return;
};

run();