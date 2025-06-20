-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Jun 20, 2025 at 12:51 PM
-- Server version: 8.4.5
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `clearsky`
--

-- --------------------------------------------------------

--
-- Table structure for table `credentials`
--

CREATE TABLE `credentials` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `role` int NOT NULL,
  `username` int NOT NULL,
  `password` int NOT NULL,
  `created_at` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `examinations`
--

CREATE TABLE `examinations` (
  `id` int NOT NULL,
  `teacher_id` int NOT NULL,
  `course` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `semester` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `examinations`
--

INSERT INTO `examinations` (`id`, `teacher_id`, `course`, `semester`) VALUES
(4, 4, 'Αλγόριθμοι και Δομές Δεδομένων', 'Χειμερινό 2025'),
(5, 6, 'Μικροοικονομική Θεωρία', 'Χειμερινό 2025'),
(6, 8, 'Ηλεκτρονική Φυσική', 'Χειμερινό 2025'),
(7, 10, 'Δίκτυα Υπολογιστών', 'Χειμερινό 2025'),
(8, 12, 'Μηχανική Λογισμικού', 'Χειμερινό 2025'),
(9, 13, 'ΤΕΧΝΟΛΟΓΙΑ ΛΟΓΙΣΜΙΚΟΥ   (3205)', '2024-2025 ΧΕΙΜ 2024'),
(10, 13, 'ΤΕΧΝΟΛΟΓΙΑ ΛΟΓΙΣΜΙΚΟΥ   (3205)', '2024-2025 ΧΕΙΜ 2024'),
(11, 13, 'ΤΕΧΝΟΛΟΓΙΑ ΛΟΓΙΣΜΙΚΟΥ   (3205)', '2024-2025 ΧΕΙΜ 2024');

-- --------------------------------------------------------

--
-- Table structure for table `grades`
--

CREATE TABLE `grades` (
  `id` int NOT NULL,
  `student_id` int NOT NULL,
  `examination_id` int NOT NULL,
  `value` int NOT NULL,
  `state` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `grades`
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
-- Table structure for table `institutions`
--

CREATE TABLE `institutions` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `tokens` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `institutions`
--

INSERT INTO `institutions` (`id`, `name`, `tokens`) VALUES
(4, 'Πανεπιστήμιο Πειραιώς', 700),
(5, 'Οικονομικό Πανεπιστήμιο Αθηνών', 650),
(6, 'Πανεπιστήμιο Πατρών', 900),
(7, 'Δημοκρίτειο Θράκης', 750),
(8, 'Πανεπιστήμιο Κρήτης', 800);

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `id` int NOT NULL,
  `uid` varchar(255) NOT NULL,
  `teacher_id` int NOT NULL,
  `action` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `logs`
--

INSERT INTO `logs` (`id`, `uid`, `teacher_id`, `action`, `message`, `created_at`) VALUES
(1, '6d8b9249-00ea-41d6-8857-61035de7d90a', 13, 'upload', 'Upload with uid 6d8b9249-00ea-41d6-8857-61035de7d90a by instructor_id: 13', '2025-06-20 12:07:11'),
(2, '2bade137-d093-4309-9fc0-cce7899f7814', 13, 'cancel', 'Upload with uid 2bade137-d093-4309-9fc0-cce7899f7814 has been canceled by instructor_id: 13', '2025-06-20 12:18:09'),
(3, '38c6c227-21e3-49b8-b45b-dba58f0debbf', 13, 'upload', 'Upload with uid 38c6c227-21e3-49b8-b45b-dba58f0debbf by instructor_id: 13', '2025-06-20 12:26:42'),
(4, '38c6c227-21e3-49b8-b45b-dba58f0debbf', 13, 'confirm', 'Grades confirmed by instructor: 13', '2025-06-20 12:33:42');

-- --------------------------------------------------------

--
-- Table structure for table `representatives`
--

CREATE TABLE `representatives` (
  `id` int NOT NULL,
  `institution_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `surname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int NOT NULL,
  `grade_id` int NOT NULL,
  `request_message` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `response_message` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `state` enum('Pending','Accepted','Rejected','') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
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
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int NOT NULL,
  `institution_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `surname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `am` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `institution_id`, `name`, `surname`, `email`, `am`) VALUES
(4, 4, 'Γιώργος', 'Νικολάου', 'g.nikolaou@student.unipi.gr', ''),
(5, 4, 'Ελένη', 'Μανώλη', 'e.manoli@student.unipi.gr', ''),
(6, 5, 'Αντώνης', 'Καλογήρου', 'a.kalogirou@student.aueb.gr', ''),
(7, 5, 'Ρένα', 'Αθανασίου', 'r.athanasiou@student.aueb.gr', ''),
(8, 6, 'Θάνος', 'Κωνσταντίνου', 'th.konstantinou@student.upatras.gr', ''),
(9, 6, 'Μαρίνα', 'Χαρίτου', 'm.charitou@student.upatras.gr', ''),
(10, 7, 'Βασίλης', 'Ξανθόπουλος', 'v.xanthopoulos@student.duth.gr', ''),
(11, 7, 'Χριστίνα', 'Μπέλλου', 'ch.bellou@student.duth.gr', ''),
(12, 8, 'Τάσος', 'Διαμαντής', 't.diamantis@student.uoc.gr', ''),
(13, 8, 'Νίκη', 'Παναγιώτου', 'n.panagiotou@student.uoc.gr', '');

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `id` int NOT NULL,
  `institution_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `surname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teachers`
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
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `token` int NOT NULL,
  `expires_at` int NOT NULL,
  `created_at` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `uploads`
--

CREATE TABLE `uploads` (
  `id` int NOT NULL,
  `uid` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `file` blob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for table `credentials`
--
ALTER TABLE `credentials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_credentials_user` (`user_id`);

--
-- Indexes for table `examinations`
--
ALTER TABLE `examinations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_examinations_teacher` (`teacher_id`);

--
-- Indexes for table `grades`
--
ALTER TABLE `grades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_grades_student` (`student_id`),
  ADD KEY `idx_grades_examination` (`examination_id`);

--
-- Indexes for table `institutions`
--
ALTER TABLE `institutions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `representatives`
--
ALTER TABLE `representatives`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_representatives_institution` (`institution_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_reviews_grade` (`grade_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_email` (`email`),
  ADD KEY `idx_students_institution` (`institution_id`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_teacher_email` (`email`),
  ADD KEY `idx_teachers_institution` (`institution_id`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tokens_user` (`user_id`);

--
-- Indexes for table `uploads`
--
ALTER TABLE `uploads`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `credentials`
--
ALTER TABLE `credentials`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `examinations`
--
ALTER TABLE `examinations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `grades`
--
ALTER TABLE `grades`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `institutions`
--
ALTER TABLE `institutions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `representatives`
--
ALTER TABLE `representatives`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `uploads`
--
ALTER TABLE `uploads`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `examinations`
--
ALTER TABLE `examinations`
  ADD CONSTRAINT `examinations_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `grades`
--
ALTER TABLE `grades`
  ADD CONSTRAINT `grades_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `grades_ibfk_2` FOREIGN KEY (`examination_id`) REFERENCES `examinations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `representatives`
--
ALTER TABLE `representatives`
  ADD CONSTRAINT `representatives_ibfk_1` FOREIGN KEY (`institution_id`) REFERENCES `institutions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`grade_id`) REFERENCES `grades` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`institution_id`) REFERENCES `institutions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `teachers`
--
ALTER TABLE `teachers`
  ADD CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`institution_id`) REFERENCES `institutions` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
