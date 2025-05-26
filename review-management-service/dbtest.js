const db = require('./models'); // από τον φάκελο που δημιούργησε το sequelize-auto

async function run() {
  try {
    // Ελέγχει σύνδεση
    await db.sequelize.authenticate();
    console.log('✅ Η σύνδεση ήταν επιτυχής.');

    // Παράδειγμα: πάρε όλους τους μαθητές
    const students = await db.students.findAll();
    students.forEach(student => {
      console.log(`${student.name} ${student.surname} (${student.email})`);
    });

  } catch (error) {
    console.error('❌ Σφάλμα σύνδεσης:', error);
  }
}

run