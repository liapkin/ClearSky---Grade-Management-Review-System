const db = require('./models'); // από τον φάκελο που δημιούργησε το sequelize-auto

async function run() {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Η σύνδεση με τη βάση δεδομένων ήταν επιτυχής.');

    // Ανάκτηση όλων των ιδρυμάτων
    const institutions = await db.institutions.findAll();
    console.log('\n📘 Ιδρύματα:');
    institutions.forEach(inst => {
      console.log(`- [${inst.id}] ${inst.name}`);
    });

    // Ανάκτηση όλων των χρηστών με τα ιδρύματά τους
    const students = await db.students.findAll({ include: { model: db.institutions, as: 'institution' } });
    console.log('\n👥 Χρήστες:');
    students.forEach(student => {
      console.log(`- [${student.id}] ${student.first_name} ${student.last_name} (${student.email}) - Ρόλος: ${student.role} - Ίδρυμα: ${student.institution?.name || 'N/A'}`);
    });

    // Αναζήτηση χρήστη με συγκεκριμένο ID
    const studentId = 1;
    const student = await db.students.findByPk(studentId);
    if (student) {
      console.log(`\n🔎 Χρήστης με ID=${studentId}: ${student.first_name} ${student.last_name}, Ρόλος: ${student.role}`);
    } else {
      console.log(`\n❌ Δεν βρέθηκε χρήστης με ID=${studentId}`);
    }

  } catch (error) {
    console.error('❌ Σφάλμα σύνδεσης ή ανάκτησης δεδομένων:', error);
  } finally {
    await db.sequelize.close();
    console.log('🔒 Η σύνδεση έκλεισε.');
  }

  return;
}

run();
