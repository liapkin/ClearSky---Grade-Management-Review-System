-- Εισαγωγή 5 νέων ιδρυμάτων
INSERT INTO institutions (name, tokens) VALUES 
('Πανεπιστήμιο Πειραιώς', 700),
('Οικονομικό Πανεπιστήμιο Αθηνών', 650),
('Πανεπιστήμιο Πατρών', 900),
('Δημοκρίτειο Θράκης', 750),
('Πανεπιστήμιο Κρήτης', 800);

-- Εισαγωγή καθηγητών για κάθε ίδρυμα (2 ανά ίδρυμα)
INSERT INTO teachers (institution_id, name, surname, email) VALUES
(4, 'Αλέξανδρος', 'Ιωάννου', 'a.ioannou@unipi.gr'),
(4, 'Κατερίνα', 'Σταθάκη', 'k.stathaki@unipi.gr'),
(5, 'Μιχάλης', 'Παπαγεωργίου', 'm.papageorgiou@aueb.gr'),
(5, 'Ιφιγένεια', 'Δημητροπούλου', 'i.dimitropoulou@aueb.gr'),
(6, 'Νικόλαος', 'Χατζηδάκης', 'n.chatzidakis@upatras.gr'),
(6, 'Ευαγγελία', 'Σωτηρίου', 'e.sotiriou@upatras.gr'),
(7, 'Χρήστος', 'Αναγνωστόπουλος', 'ch.anagnostopoulos@duth.gr'),
(7, 'Αγγελική', 'Ράπτη', 'a.rapti@duth.gr'),
(8, 'Στέφανος', 'Μαυρίδης', 's.mavridis@uoc.gr'),
(8, 'Λουκία', 'Ζαφειρίου', 'l.zafeiriou@uoc.gr');

-- Εισαγωγή μαθητών για κάθε ίδρυμα (2 ανά ίδρυμα)
INSERT INTO students (institution_id, name, surname, email) VALUES
(4, 'Γιώργος', 'Νικολάου', 'g.nikolaou@student.unipi.gr'),
(4, 'Ελένη', 'Μανώλη', 'e.manoli@student.unipi.gr'),
(5, 'Αντώνης', 'Καλογήρου', 'a.kalogirou@student.aueb.gr'),
(5, 'Ρένα', 'Αθανασίου', 'r.athanasiou@student.aueb.gr'),
(6, 'Θάνος', 'Κωνσταντίνου', 'th.konstantinou@student.upatras.gr'),
(6, 'Μαρίνα', 'Χαρίτου', 'm.charitou@student.upatras.gr'),
(7, 'Βασίλης', 'Ξανθόπουλος', 'v.xanthopoulos@student.duth.gr'),
(7, 'Χριστίνα', 'Μπέλλου', 'ch.bellou@student.duth.gr'),
(8, 'Τάσος', 'Διαμαντής', 't.diamantis@student.uoc.gr'),
(8, 'Νίκη', 'Παναγιώτου', 'n.panagiotou@student.uoc.gr');

-- Δημιουργία εξετάσεων (μία ανά ίδρυμα) και ανάθεση σε έναν από τους καθηγητές του ιδρύματος
INSERT INTO examinations (teacher_id, course, semester) VALUES
(4, 'Αλγόριθμοι και Δομές Δεδομένων', 'Χειμερινό 2025'),  -- για institution 4
(6, 'Μικροοικονομική Θεωρία', 'Χειμερινό 2025'),           -- για institution 5
(8, 'Ηλεκτρονική Φυσική', 'Χειμερινό 2025'),               -- για institution 6
(10, 'Δίκτυα Υπολογιστών', 'Χειμερινό 2025'),              -- για institution 7
(12, 'Μηχανική Λογισμικού', 'Χειμερινό 2025');             -- για institution 8

-- Grades for institution 4 (examination_id = 4)
INSERT INTO grades (student_id, examination_id, value, state) VALUES
(4, 4, 8, 0),
(5, 4, 9, 0);

-- Grades for institution 5 (examination_id = 5)
INSERT INTO grades (student_id, examination_id, value, state) VALUES
(6, 5, 7, 0),
(7, 5, 8, 0);

-- Grades for institution 6 (examination_id = 6)
INSERT INTO grades (student_id, examination_id, value, state) VALUES
(8, 6, 6, 0),
(9, 6, 7, 0);

-- Grades for institution 7 (examination_id = 7)
INSERT INTO grades (student_id, examination_id, value, state) VALUES
(10, 7, 9, 0),
(11, 7, 10, 0);

-- Grades for institution 8 (examination_id = 8)
INSERT INTO grades (student_id, examination_id, value, state) VALUES
(12, 8, 7, 0),
(13, 8, 8, 0);