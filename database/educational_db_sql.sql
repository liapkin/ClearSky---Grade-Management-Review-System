-- Δημιουργία βάσης δεδομένων
CREATE DATABASE IF NOT EXISTS educational_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE educational_system;

-- Πίνακας Διαπιστευτηρίων (Credentials)
CREATE TABLE IF NOT EXISTS credentials (
    id INT(10) NOT NULL AUTO_INCREMENT,
    user_id INT(10) NOT NULL,
    role INT(10) NOT NULL,
    username INT(10) NOT NULL,
    password INT(10) NOT NULL,
    created_at INT(10) NOT NULL,
    PRIMARY KEY (id)
);

-- Πίνακας Ιδρυμάτων (Institutions)
CREATE TABLE IF NOT EXISTS institutions (
    id INT(10) NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    tokens INT(10) NOT NULL,
    PRIMARY KEY (id)
);

-- Πίνακας Αντιπροσώπων (Representatives)
CREATE TABLE IF NOT EXISTS representatives (
    id INT(10) NOT NULL AUTO_INCREMENT,
    institution_id INT(10) NOT NULL,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE
);

-- Πίνακας Tokens
CREATE TABLE IF NOT EXISTS tokens (
    id INT(10) NOT NULL AUTO_INCREMENT,
    user_id INT(10) NOT NULL,
    token INT(10) NOT NULL,
    expires_at INT(10) NOT NULL,
    created_at INT(10) NOT NULL,
    PRIMARY KEY (id)
);

-- Πίνακας Μαθητών (Students)
CREATE TABLE IF NOT EXISTS students (
    id INT(10) NOT NULL AUTO_INCREMENT,
    institution_id INT(10) NOT NULL,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_email (email)
);

-- Πίνακας Καθηγητών (Teachers)
CREATE TABLE IF NOT EXISTS teachers (
    id INT(10) NOT NULL AUTO_INCREMENT,
    institution_id INT(10) NOT NULL,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_teacher_email (email)
);

-- Πίνακας Εξετάσεων (Examinations)
CREATE TABLE IF NOT EXISTS examinations (
    id INT(10) NOT NULL AUTO_INCREMENT,
    teacher_id INT(10) NOT NULL,
    course VARCHAR(255) NOT NULL,
    semester VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
);

-- Πίνακας Βαθμών (Grades)
CREATE TABLE IF NOT EXISTS grades (
    id INT(10) NOT NULL AUTO_INCREMENT,
    student_id INT(10) NOT NULL,
    examination_id INT(10) NOT NULL,
    value INT(10) NOT NULL,
    state VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (examination_id) REFERENCES examinations(id) ON DELETE CASCADE
);

-- Πίνακας Αναθεωρήσεων (Reviews)
CREATE TABLE IF NOT EXISTS reviews (
    id INT(10) NOT NULL AUTO_INCREMENT,
    grade_id INT(10) NOT NULL,
    request_message VARCHAR(255) NOT NULL,
    response_message VARCHAR(255) NOT NULL,
    state INT(10) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (grade_id) REFERENCES grades(id) ON DELETE CASCADE
);

-- Πίνακας Αναρτήσεων (Uploads)
CREATE TABLE IF NOT EXISTS uploads (
    id INT(10) NOT NULL AUTO_INCREMENT,
    uid VARCHAR(255) NOT NULL,
    file VARCHAR(255) NOT NULL,
    xlsx LONGBLOB,
    PRIMARY KEY (id)
);

-- Δημιουργία ευρετηρίων για βελτίωση απόδοσης
CREATE INDEX IF NOT EXISTS idx_students_institution ON students(institution_id);
CREATE INDEX IF NOT EXISTS idx_teachers_institution ON teachers(institution_id);
CREATE INDEX IF NOT EXISTS idx_examinations_teacher ON examinations(teacher_id);
CREATE INDEX IF NOT EXISTS idx_grades_student ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_examination ON grades(examination_id);
CREATE INDEX IF NOT EXISTS idx_reviews_grade ON reviews(grade_id);
CREATE INDEX IF NOT EXISTS idx_representatives_institution ON representatives(institution_id);
CREATE INDEX IF NOT EXISTS idx_tokens_user ON tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_credentials_user ON credentials(user_id);

-- Δείγμα δεδομένων για δοκιμή
INSERT INTO institutions (name, tokens) VALUES 
('Πανεπιστήμιο Αθηνών', 1000),
('Πολυτεχνείο Κρήτης', 800),
('ΤΕΙ Θεσσαλονίκης', 600);

INSERT INTO representatives (institution_id, name, surname) VALUES 
(1, 'Γιάννης', 'Παπαδόπουλος'),
(2, 'Μαρία', 'Γεωργίου'),
(3, 'Νίκος', 'Κωνσταντίνου');

INSERT INTO teachers (institution_id, name, surname, email) VALUES 
(1, 'Δημήτρης', 'Αντωνίου', 'dimitris.antoniou@uoa.gr'),
(1, 'Ελένη', 'Μιχαήλ', 'eleni.michail@uoa.gr'),
(2, 'Κώστας', 'Βασιλείου', 'kostas.vasileiou@tuc.gr');

INSERT INTO students (institution_id, name, surname, email) VALUES 
(1, 'Άννα', 'Σταματίου', 'anna.stamatiou@student.uoa.gr'),
(1, 'Πέτρος', 'Λάμπρου', 'petros.lambrou@student.uoa.gr'),
(2, 'Σοφία', 'Αλεξάνδρου', 'sofia.alexandrou@student.tuc.gr');

INSERT INTO examinations (teacher_id, course, semester) VALUES 
(1, 'Μαθηματικά Ι', 'Χειμερινό 2024'),
(1, 'Στατιστική', 'Εαρινό 2024'),
(2, 'Προγραμματισμός', 'Χειμερινό 2024');

INSERT INTO grades (student_id, examination_id, value, state) VALUES 
(1, 1, 85, 'Οριστικός'),
(2, 1, 92, 'Οριστικός'),
(1, 2, 78, 'Προσωρινός'),
(3, 3, 88, 'Οριστικός');

INSERT INTO reviews (grade_id, request_message, response_message, state) VALUES 
(3, 'Παρακαλώ επανεξέταση του βαθμού', 'Υπό εξέταση', 1),
(1, 'Αίτηση διόρθωσης σφάλματος', 'Εγκρίθηκε', 2);