-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- ???p??et?t??: 127.0.0.1
-- ?????? d?µ??????a?: 16 ???? 2025 st?? 16:12:57
-- ??d?s? d?a??µ?st?: 10.4.32-MariaDB
-- ??d?s? PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- ??s? ded?µ????: `clearsky`
--

-- --------------------------------------------------------

--
-- ??µ? p??a?a ??a t?? p??a?a `credentials`
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
-- ??µ? p??a?a ??a t?? p??a?a `examinations`
--

CREATE TABLE `examinations` (
  `id` int(10) NOT NULL,
  `teacher_id` int(10) NOT NULL,
  `course` varchar(255) NOT NULL,
  `semester` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- ?de?asµa ded?µ???? t?? p??a?a `examinations`
--

INSERT INTO `examinations` (`id`, `teacher_id`, `course`, `semester`) VALUES
(4, 4, '???????µ?? ?a? ??µ?? ?ed?µ????', '?e?µe???? 2025'),
(5, 6, '???????????µ??? Te???a', '?e?µe???? 2025'),
(6, 8, '??e?t?????? F?s???', '?e?µe???? 2025'),
(7, 10, '???t?a ?p?????st??', '?e?µe???? 2025'),
(8, 12, '???a???? ????sµ????', '?e?µe???? 2025');

-- --------------------------------------------------------

--
-- ??µ? p??a?a ??a t?? p??a?a `grades`
--

CREATE TABLE `grades` (
  `id` int(10) NOT NULL,
  `student_id` int(10) NOT NULL,
  `examination_id` int(10) NOT NULL,
  `value` int(10) NOT NULL,
  `state` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- ?de?asµa ded?µ???? t?? p??a?a `grades`
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
-- ??µ? p??a?a ??a t?? p??a?a `institutions`
--

CREATE TABLE `institutions` (
  `id` int(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `tokens` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- ?de?asµa ded?µ???? t?? p??a?a `institutions`
--

INSERT INTO `institutions` (`id`, `name`, `tokens`) VALUES
(4, '?a?ep?st?µ?? ?e??a???', 700),
(5, '??????µ??? ?a?ep?st?µ?? ??????', 650),
(6, '?a?ep?st?µ?? ?at???', 900),
(7, '??µ????te?? T?????', 750),
(8, '?a?ep?st?µ?? ???t??', 800);

-- --------------------------------------------------------

--
-- ??µ? p??a?a ??a t?? p??a?a `logs`
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
-- ??µ? p??a?a ??a t?? p??a?a `representatives`
--

CREATE TABLE `representatives` (
  `id` int(10) NOT NULL,
  `institution_id` int(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- ??µ? p??a?a ??a t?? p??a?a `reviews`
--

CREATE TABLE `reviews` (
  `id` int(10) NOT NULL,
  `grade_id` int(10) NOT NULL,
  `request_message` varchar(255) NOT NULL,
  `response_message` varchar(255) NOT NULL,
  `state` enum('Pending','Accepted','Rejected','') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- ?de?asµa ded?µ???? t?? p??a?a `reviews`
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
-- ??µ? p??a?a ??a t?? p??a?a `students`
--

CREATE TABLE `students` (
  `id` int(10) NOT NULL,
  `institution_id` int(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- ?de?asµa ded?µ???? t?? p??a?a `students`
--

INSERT INTO `students` (`id`, `institution_id`, `name`, `surname`, `email`) VALUES
(4, 4, 'G??????', '????????', 'g.nikolaou@student.unipi.gr'),
(5, 4, '?????', '?a????', 'e.manoli@student.unipi.gr'),
(6, 5, '??t????', '?a???????', 'a.kalogirou@student.aueb.gr'),
(7, 5, '???a', '??a?as???', 'r.athanasiou@student.aueb.gr'),
(8, 6, 'T????', '???sta?t????', 'th.konstantinou@student.upatras.gr'),
(9, 6, '?a???a', '?a??t??', 'm.charitou@student.upatras.gr'),
(10, 7, '?as????', '?a???p?????', 'v.xanthopoulos@student.duth.gr'),
(11, 7, '???st??a', '?p?????', 'ch.bellou@student.duth.gr'),
(12, 8, '??s??', '??aµa?t??', 't.diamantis@student.uoc.gr'),
(13, 8, '????', '?a?a???t??', 'n.panagiotou@student.uoc.gr');

-- --------------------------------------------------------

--
-- ??µ? p??a?a ??a t?? p??a?a `teachers`
--

CREATE TABLE `teachers` (
  `id` int(10) NOT NULL,
  `institution_id` int(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- ?de?asµa ded?µ???? t?? p??a?a `teachers`
--

INSERT INTO `teachers` (`id`, `institution_id`, `name`, `surname`, `email`) VALUES
(4, 4, '????a?d???', '???????', 'a.ioannou@unipi.gr'),
(5, 4, '?ate???a', 'Sta????', 'k.stathaki@unipi.gr'),
(6, 5, '???????', '?apa?e??????', 'm.papageorgiou@aueb.gr'),
(7, 5, '?f????e?a', '??µ?t??p?????', 'i.dimitropoulou@aueb.gr'),
(8, 6, '?????a??', '?at??d????', 'n.chatzidakis@upatras.gr'),
(9, 6, '??a??e??a', 'S?t?????', 'e.sotiriou@upatras.gr'),
(10, 7, '???st??', '??a???st?p?????', 'ch.anagnostopoulos@duth.gr'),
(11, 7, '???e????', '??pt?', 'a.rapti@duth.gr'),
(12, 8, 'St?fa???', '?a???d??', 's.mavridis@uoc.gr'),
(13, 8, '?????a', '?afe?????', 'l.zafeiriou@uoc.gr');

-- --------------------------------------------------------

--
-- ??µ? p??a?a ??a t?? p??a?a `tokens`
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
-- ??µ? p??a?a ??a t?? p??a?a `uploads`
--

CREATE TABLE `uploads` (
  `id` int(10) NOT NULL,
  `uid` varchar(255) NOT NULL,
  `file` blob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- ???et???a ??a ????st??? p??a?e?
--

--
-- ???et???a ??a p??a?a `credentials`
--
ALTER TABLE `credentials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_credentials_user` (`user_id`);

--
-- ???et???a ??a p??a?a `examinations`
--
ALTER TABLE `examinations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_examinations_teacher` (`teacher_id`);

--
-- ???et???a ??a p??a?a `grades`
--
ALTER TABLE `grades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_grades_student` (`student_id`),
  ADD KEY `idx_grades_examination` (`examination_id`);

--
-- ???et???a ??a p??a?a `institutions`
--
ALTER TABLE `institutions`
  ADD PRIMARY KEY (`id`);

--
-- ???et???a ??a p??a?a `representatives`
--
ALTER TABLE `representatives`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_representatives_institution` (`institution_id`);

--
-- ???et???a ??a p??a?a `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_reviews_grade` (`grade_id`);

--
-- ???et???a ??a p??a?a `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_email` (`email`),
  ADD KEY `idx_students_institution` (`institution_id`);

--
-- ???et???a ??a p??a?a `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_teacher_email` (`email`),
  ADD KEY `idx_teachers_institution` (`institution_id`);

--
-- ???et???a ??a p??a?a `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tokens_user` (`user_id`);

--
-- ???et???a ??a p??a?a `uploads`
--
ALTER TABLE `uploads`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT ??a ????st??? p??a?e?
--

--
-- AUTO_INCREMENT ??a p??a?a `credentials`
--
ALTER TABLE `credentials`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT ??a p??a?a `examinations`
--
ALTER TABLE `examinations`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT ??a p??a?a `grades`
--
ALTER TABLE `grades`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT ??a p??a?a `institutions`
--
ALTER TABLE `institutions`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT ??a p??a?a `representatives`
--
ALTER TABLE `representatives`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT ??a p??a?a `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT ??a p??a?a `students`
--
ALTER TABLE `students`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT ??a p??a?a `teachers`
--
ALTER TABLE `teachers`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT ??a p??a?a `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT ??a p??a?a `uploads`
--
ALTER TABLE `uploads`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

--
-- ?e?????sµ?? ??a ????st??? p??a?e?
--

--
-- ?e?????sµ?? ??a p??a?a `examinations`
--
ALTER TABLE `examinations`
  ADD CONSTRAINT `examinations_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE;

--
-- ?e?????sµ?? ??a p??a?a `grades`
--
ALTER TABLE `grades`
  ADD CONSTRAINT `grades_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `grades_ibfk_2` FOREIGN KEY (`examination_id`) REFERENCES `examinations` (`id`) ON DELETE CASCADE;

--
-- ?e?????sµ?? ??a p??a?a `representatives`
--
ALTER TABLE `representatives`
  ADD CONSTRAINT `representatives_ibfk_1` FOREIGN KEY (`institution_id`) REFERENCES `institutions` (`id`) ON DELETE CASCADE;

--
-- ?e?????sµ?? ??a p??a?a `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`grade_id`) REFERENCES `grades` (`id`) ON DELETE CASCADE;

--
-- ?e?????sµ?? ??a p??a?a `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`institution_id`) REFERENCES `institutions` (`id`) ON DELETE CASCADE;

--
-- ?e?????sµ?? ??a p??a?a `teachers`
--
ALTER TABLE `teachers`
  ADD CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`institution_id`) REFERENCES `institutions` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;