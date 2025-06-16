-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Εξυπηρετητής: 127.0.0.1
-- Χρόνος δημιουργίας: 16 Ιουν 2025 στις 16:12:57
-- Έκδοση διακομιστή: 10.4.32-MariaDB
-- Έκδοση PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Βάση δεδομένων: `clearsky`
--

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `credentials`
--

CREATE TABLE `credentials` (
  `id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  `role` int(10) NOT NULL,
  `username` int(10) NOT NULL,
  `password` int(10) NOT NULL,
  `created_at` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `examinations`
--

CREATE TABLE `examinations` (
  `id` int(10) NOT NULL,
  `teacher_id` int(10) NOT NULL,
  `course` varchar(255) NOT NULL,
  `semester` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `examinations`
--

INSERT INTO `examinations` (`id`, `teacher_id`, `course`, `semester`) VALUES
(4, 4, 'Αλγόριθμοι και Δομές Δεδομένων', 'Χειμερινό 2025'),
(5, 6, 'Μικροοικονομική Θεωρία', 'Χειμερινό 2025'),
(6, 8, 'Ηλεκτρονική Φυσική', 'Χειμερινό 2025'),
(7, 10, 'Δίκτυα Υπολογιστών', 'Χειμερινό 2025'),
(8, 12, 'Μηχανική Λογισμικού', 'Χειμερινό 2025');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `grades`
--

CREATE TABLE `grades` (
  `id` int(10) NOT NULL,
  `student_id` int(10) NOT NULL,
  `examination_id` int(10) NOT NULL,
  `value` int(10) NOT NULL,
  `state` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `grades`
--

INSERT INTO `grades` (`id`, `student_id`, `examination_id`, `value`, `state`) VALUES
(7, 4, 4, 9, '1'),
(8, 5, 4, 9, '0'),
(9, 6, 5, 7, '0'),
(10, 7, 5, 8, '0'),
(11, 8, 6, 6, '0'),
(12, 9, 6, 7, '0'),
(13, 10, 7, 9, '0'),
(14, 11, 7, 10, '0'),
(15, 12, 8, 7, '0'),
(16, 13, 8, 8, '0');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `institutions`
--

CREATE TABLE `institutions` (
  `id` int(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `tokens` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `institutions`
--

INSERT INTO `institutions` (`id`, `name`, `tokens`) VALUES
(4, 'Πανεπιστήμιο Πειραιώς', 700),
(5, 'Οικονομικό Πανεπιστήμιο Αθηνών', 650),
(6, 'Πανεπιστήμιο Πατρών', 900),
(7, 'Δημοκρίτειο Θράκης', 750),
(8, 'Πανεπιστήμιο Κρήτης', 800);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `uid` varchar(255) NOT NULL,
  `instructor_id` int(11) NOT NULL,
  `action` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `representatives`
--

CREATE TABLE `representatives` (
  `id` int(10) NOT NULL,
  `institution_id` int(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `reviews`
--

CREATE TABLE `reviews` (
  `id` int(10) NOT NULL,
  `grade_id` int(10) NOT NULL,
  `request_message` varchar(255) NOT NULL,
  `response_message` varchar(255) NOT NULL,
  `state` enum('Pending','Accepted','Rejected','') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `reviews`
--

INSERT INTO `reviews` (`id`, `grade_id`, `request_message`, `response_message`, `state`) VALUES
(3, 7, 'I deserve something better', '', ''),
(4, 7, 'I deserve something better', '', 'Pending'),
(5, 7, 'I deserve something better', '', 'Pending'),
(6, 7, 'I deserve something better', '', 'Pending'),
(7, 7, 'I deserve something better', '', 'Pending'),
(8, 7, 'I deserve something better', 'You were totally right.', ''),
(9, 8, 'I deserve something much better', '', 'Pending'),
(10, 8, 'I deserve something much better', '', 'Pending'),
(11, 8, 'I deserve something much better', '', 'Pending');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `students`
--

CREATE TABLE `students` (
  `id` int(10) NOT NULL,
  `institution_id` int(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `students`
--

INSERT INTO `students` (`id`, `institution_id`, `name`, `surname`, `email`) VALUES
(4, 4, 'Γιώργος', 'Νικολάου', 'g.nikolaou@student.unipi.gr'),
(5, 4, 'Ελένη', 'Μανώλη', 'e.manoli@student.unipi.gr'),
(6, 5, 'Αντώνης', 'Καλογήρου', 'a.kalogirou@student.aueb.gr'),
(7, 5, 'Ρένα', 'Αθανασίου', 'r.athanasiou@student.aueb.gr'),
(8, 6, 'Θάνος', 'Κωνσταντίνου', 'th.konstantinou@student.upatras.gr'),
(9, 6, 'Μαρίνα', 'Χαρίτου', 'm.charitou@student.upatras.gr'),
(10, 7, 'Βασίλης', 'Ξανθόπουλος', 'v.xanthopoulos@student.duth.gr'),
(11, 7, 'Χριστίνα', 'Μπέλλου', 'ch.bellou@student.duth.gr'),
(12, 8, 'Τάσος', 'Διαμαντής', 't.diamantis@student.uoc.gr'),
(13, 8, 'Νίκη', 'Παναγιώτου', 'n.panagiotou@student.uoc.gr');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `teachers`
--

CREATE TABLE `teachers` (
  `id` int(10) NOT NULL,
  `institution_id` int(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `teachers`
--

INSERT INTO `teachers` (`id`, `institution_id`, `name`, `surname`, `email`) VALUES
(4, 4, 'Αλέξανδρος', 'Ιωάννου', 'a.ioannou@unipi.gr'),
(5, 4, 'Κατερίνα', 'Σταθάκη', 'k.stathaki@unipi.gr'),
(6, 5, 'Μιχάλης', 'Παπαγεωργίου', 'm.papageorgiou@aueb.gr'),
(7, 5, 'Ιφιγένεια', 'Δημητροπούλου', 'i.dimitropoulou@aueb.gr'),
(8, 6, 'Νικόλαος', 'Χατζηδάκης', 'n.chatzidakis@upatras.gr'),
(9, 6, 'Ευαγγελία', 'Σωτηρίου', 'e.sotiriou@upatras.gr'),
(10, 7, 'Χρήστος', 'Αναγνωστόπουλος', 'ch.anagnostopoulos@duth.gr'),
(11, 7, 'Αγγελική', 'Ράπτη', 'a.rapti@duth.gr'),
(12, 8, 'Στέφανος', 'Μαυρίδης', 's.mavridis@uoc.gr'),
(13, 8, 'Λουκία', 'Ζαφειρίου', 'l.zafeiriou@uoc.gr');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `tokens`
--

CREATE TABLE `tokens` (
  `id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  `token` int(10) NOT NULL,
  `expires_at` int(10) NOT NULL,
  `created_at` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `uploads`
--

CREATE TABLE `uploads` (
  `id` int(10) NOT NULL,
  `uid` varchar(255) NOT NULL,
  `file` blob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Ευρετήρια για άχρηστους πίνακες
--

--
-- Ευρετήρια για πίνακα `credentials`
--
ALTER TABLE `credentials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_credentials_user` (`user_id`);

--
-- Ευρετήρια για πίνακα `examinations`
--
ALTER TABLE `examinations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_examinations_teacher` (`teacher_id`);

--
-- Ευρετήρια για πίνακα `grades`
--
ALTER TABLE `grades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_grades_student` (`student_id`),
  ADD KEY `idx_grades_examination` (`examination_id`);

--
-- Ευρετήρια για πίνακα `institutions`
--
ALTER TABLE `institutions`
  ADD PRIMARY KEY (`id`);

--
-- Ευρετήρια για πίνακα `representatives`
--
ALTER TABLE `representatives`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_representatives_institution` (`institution_id`);

--
-- Ευρετήρια για πίνακα `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_reviews_grade` (`grade_id`);

--
-- Ευρετήρια για πίνακα `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_email` (`email`),
  ADD KEY `idx_students_institution` (`institution_id`);

--
-- Ευρετήρια για πίνακα `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_teacher_email` (`email`),
  ADD KEY `idx_teachers_institution` (`institution_id`);

--
-- Ευρετήρια για πίνακα `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tokens_user` (`user_id`);

--
-- Ευρετήρια για πίνακα `uploads`
--
ALTER TABLE `uploads`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT για άχρηστους πίνακες
--

--
-- AUTO_INCREMENT για πίνακα `credentials`
--
ALTER TABLE `credentials`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT για πίνακα `examinations`
--
ALTER TABLE `examinations`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT για πίνακα `grades`
--
ALTER TABLE `grades`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT για πίνακα `institutions`
--
ALTER TABLE `institutions`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT για πίνακα `representatives`
--
ALTER TABLE `representatives`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT για πίνακα `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT για πίνακα `students`
--
ALTER TABLE `students`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT για πίνακα `teachers`
--
ALTER TABLE `teachers`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT για πίνακα `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT για πίνακα `uploads`
--
ALTER TABLE `uploads`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

--
-- Περιορισμοί για άχρηστους πίνακες
--

--
-- Περιορισμοί για πίνακα `examinations`
--
ALTER TABLE `examinations`
  ADD CONSTRAINT `examinations_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE;

--
-- Περιορισμοί για πίνακα `grades`
--
ALTER TABLE `grades`
  ADD CONSTRAINT `grades_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `grades_ibfk_2` FOREIGN KEY (`examination_id`) REFERENCES `examinations` (`id`) ON DELETE CASCADE;

--
-- Περιορισμοί για πίνακα `representatives`
--
ALTER TABLE `representatives`
  ADD CONSTRAINT `representatives_ibfk_1` FOREIGN KEY (`institution_id`) REFERENCES `institutions` (`id`) ON DELETE CASCADE;

--
-- Περιορισμοί για πίνακα `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`grade_id`) REFERENCES `grades` (`id`) ON DELETE CASCADE;

--
-- Περιορισμοί για πίνακα `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`institution_id`) REFERENCES `institutions` (`id`) ON DELETE CASCADE;

--
-- Περιορισμοί για πίνακα `teachers`
--
ALTER TABLE `teachers`
  ADD CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`institution_id`) REFERENCES `institutions` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
