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
    const users = await db.users.findAll({ include: { model: db.institutions, as: 'institution' } });
    console.log('\n👥 Χρήστες:');
    users.forEach(user => {
      console.log(`- [${user.id}] ${user.first_name} ${user.last_name} (${user.email}) - Ρόλος: ${user.role} - Ίδρυμα: ${user.institution?.name || 'N/A'}`);
    });

    // Αναζήτηση χρήστη με συγκεκριμένο ID
    const userId = 1;
    const user = await db.users.findByPk(userId);
    if (user) {
      console.log(`\n🔎 Χρήστης με ID=${userId}: ${user.first_name} ${user.last_name}, Ρόλος: ${user.role}`);
    } else {
      console.log(`\n❌ Δεν βρέθηκε χρήστης με ID=${userId}`);
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
