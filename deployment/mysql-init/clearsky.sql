-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Jun 22, 2025 at 03:24 PM
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
  `course` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `semester` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
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
(12, 4, 'ΤΕΧΝΟΛΟΓΙΑ ΛΟΓΙΣΜΙΚΟΥ   (3205)', '2024-2025 ΧΕΙΜ 2024');

-- --------------------------------------------------------

--
-- Table structure for table `grades`
--

CREATE TABLE `grades` (
  `id` int NOT NULL,
  `student_id` int NOT NULL,
  `examination_id` int NOT NULL,
  `value` int NOT NULL,
  `state` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
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
(16, 13, 8, 8, '0'),
(17, 14, 12, 6, 'Open'),
(18, 15, 12, 5, 'Open'),
(19, 16, 12, 5, 'Open'),
(20, 17, 12, 6, 'Open'),
(21, 18, 12, 7, 'Open'),
(22, 19, 12, 6, 'Open'),
(23, 20, 12, 6, 'Open'),
(24, 21, 12, 5, 'Open'),
(25, 22, 12, 6, 'Open'),
(26, 23, 12, 6, 'Open'),
(27, 24, 12, 5, 'Open'),
(28, 25, 12, 6, 'Open'),
(29, 26, 12, 6, 'Open'),
(30, 27, 12, 6, 'Open'),
(31, 28, 12, 6, 'Open'),
(32, 29, 12, 7, 'Open'),
(33, 30, 12, 5, 'Open'),
(34, 31, 12, 7, 'Open'),
(35, 32, 12, 6, 'Open'),
(36, 33, 12, 6, 'Open'),
(37, 34, 12, 6, 'Open'),
(38, 35, 12, 7, 'Open'),
(39, 36, 12, 6, 'Open'),
(40, 37, 12, 6, 'Open'),
(41, 38, 12, 6, 'Open'),
(42, 39, 12, 6, 'Open'),
(43, 40, 12, 6, 'Open'),
(44, 41, 12, 6, 'Open'),
(45, 42, 12, 7, 'Open'),
(46, 43, 12, 6, 'Open'),
(47, 44, 12, 5, 'Open'),
(48, 45, 12, 6, 'Open'),
(49, 46, 12, 6, 'Open'),
(50, 47, 12, 5, 'Open'),
(51, 48, 12, 6, 'Open'),
(52, 49, 12, 5, 'Open'),
(53, 50, 12, 6, 'Open'),
(54, 51, 12, 7, 'Open'),
(55, 52, 12, 6, 'Open'),
(56, 53, 12, 6, 'Open'),
(57, 54, 12, 5, 'Open'),
(58, 55, 12, 7, 'Open'),
(59, 56, 12, 5, 'Open'),
(60, 57, 12, 7, 'Open'),
(61, 58, 12, 6, 'Open'),
(62, 59, 12, 6, 'Open'),
(63, 60, 12, 5, 'Open'),
(64, 61, 12, 7, 'Open'),
(65, 62, 12, 7, 'Open'),
(66, 63, 12, 5, 'Open'),
(67, 64, 12, 6, 'Open'),
(68, 65, 12, 6, 'Open'),
(69, 66, 12, 6, 'Open'),
(70, 67, 12, 6, 'Open'),
(71, 68, 12, 5, 'Open'),
(72, 69, 12, 7, 'Open'),
(73, 70, 12, 6, 'Open'),
(74, 71, 12, 6, 'Open'),
(75, 72, 12, 5, 'Open'),
(76, 73, 12, 6, 'Open'),
(77, 74, 12, 5, 'Open'),
(78, 75, 12, 6, 'Open'),
(79, 76, 12, 6, 'Open'),
(80, 77, 12, 6, 'Open'),
(81, 78, 12, 5, 'Open'),
(82, 79, 12, 6, 'Open'),
(83, 80, 12, 6, 'Open'),
(84, 81, 12, 6, 'Open'),
(85, 82, 12, 6, 'Open'),
(86, 83, 12, 6, 'Open'),
(87, 84, 12, 6, 'Open'),
(88, 85, 12, 6, 'Open'),
(89, 86, 12, 7, 'Open'),
(90, 87, 12, 6, 'Open'),
(91, 88, 12, 6, 'Open'),
(92, 89, 12, 6, 'Open'),
(93, 90, 12, 6, 'Open'),
(94, 91, 12, 6, 'Open'),
(95, 92, 12, 6, 'Open'),
(96, 93, 12, 6, 'Open'),
(97, 94, 12, 5, 'Open'),
(98, 95, 12, 6, 'Open'),
(99, 96, 12, 6, 'Open'),
(100, 97, 12, 6, 'Open'),
(101, 98, 12, 7, 'Open'),
(102, 99, 12, 6, 'Open'),
(103, 100, 12, 6, 'Open'),
(104, 101, 12, 7, 'Open'),
(105, 102, 12, 5, 'Open'),
(106, 103, 12, 7, 'Open'),
(107, 104, 12, 5, 'Open'),
(108, 105, 12, 6, 'Open'),
(109, 106, 12, 5, 'Open'),
(110, 107, 12, 6, 'Open'),
(111, 108, 12, 5, 'Open'),
(112, 109, 12, 6, 'Open'),
(113, 110, 12, 6, 'Open'),
(114, 111, 12, 6, 'Open'),
(115, 112, 12, 6, 'Open'),
(116, 113, 12, 5, 'Open'),
(117, 114, 12, 6, 'Open');

-- --------------------------------------------------------

--
-- Table structure for table `institutions`
--

CREATE TABLE `institutions` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `tokens` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `institutions`
--

INSERT INTO `institutions` (`id`, `name`, `tokens`) VALUES
(1, 'ΕΘΝΙΚΟ ΜΕΤΣΟΒΙΟ ΠΟΛΥΤΕΧΝΕΙΟ', 1000),
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
(4, '38c6c227-21e3-49b8-b45b-dba58f0debbf', 13, 'confirm', 'Grades confirmed by instructor: 13', '2025-06-20 12:33:42'),
(5, '8aba2c04-317b-48ba-b440-9c6298f7c71d', 4, 'upload', 'Upload with uid 8aba2c04-317b-48ba-b440-9c6298f7c71d by instructor_id: 4', '2025-06-22 11:36:33'),
(6, '8aba2c04-317b-48ba-b440-9c6298f7c71d', 4, 'confirm', 'Grades confirmed by instructor: 4', '2025-06-22 11:36:57'),
(7, 'c6128a2a-8fa8-4f88-a074-75cc74fe65c3', 4, 'upload', 'Upload with uid c6128a2a-8fa8-4f88-a074-75cc74fe65c3 by instructor_id: 4', '2025-06-22 14:58:37');

-- --------------------------------------------------------

--
-- Table structure for table `representatives`
--

CREATE TABLE `representatives` (
  `id` int NOT NULL,
  `institution_id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `surname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int NOT NULL,
  `grade_id` int NOT NULL,
  `request_message` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `response_message` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `state` enum('Pending','Accepted','Rejected','') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Pending'
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
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `surname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `am` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
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
(13, 8, 'Νίκη', 'Παναγιώτου', 'n.panagiotou@student.uoc.gr', ''),
(14, 1, 'ΧΡΙΣΤΙΝΑ', 'ΝΙΚΟΛΑΪΔΗΣ', 'el84610@mail.ntua.gr', '03184610'),
(15, 1, 'ΠΑΝΑΓΙΩΤΗΣ', 'ΑΛΕΞΑΝΔΡΟΥ', 'el84620@mail.ntua.gr', '03184620'),
(16, 1, 'ΣΟΦΙΑ', 'ΒΑΣΙΛΕΙΟΥ', 'el84621@mail.ntua.gr', '03184621'),
(17, 1, 'ΙΩΑΝΝΗΣ', 'ΛΑΜΠΡΟΠΟΥΛΟΣ', 'el84625@mail.ntua.gr', '03184625'),
(18, 1, 'ΧΡΗΣΤΟΣ', 'ΔΗΜΗΤΡΙΟΥ', 'el70676@mail.ntua.gr', '03170676'),
(19, 1, 'ΓΕΩΡΓΙΑ', 'ΣΠΥΡΙΔΩΝΟΣ', 'el84618@mail.ntua.gr', '03184618'),
(20, 1, 'ΝΙΚΟΛΑΟΣ', 'ΚΑΡΑΜΑΝΟΣ', 'el80915@mail.ntua.gr', '03180915'),
(21, 1, 'ΓΙΩΡΓΟΣ', 'ΒΑΣΙΛΕΙΟΥ', 'el68190@mail.ntua.gr', '03168190'),
(22, 1, 'ΧΡΗΣΤΟΣ', 'ΝΙΚΟΛΑΪΔΗΣ', 'el81137@mail.ntua.gr', '03181137'),
(23, 1, 'ΣΟΦΙΑ', 'ΑΛΕΞΑΝΔΡΟΥ', 'el81872@mail.ntua.gr', '03181872'),
(24, 1, 'ΧΡΗΣΤΟΣ', 'ΚΑΡΑΓΙΑΝΝΗΣ', 'el81873@mail.ntua.gr', '03181873'),
(25, 1, 'ΣΟΦΙΑ', 'ΑΛΕΞΑΝΔΡΟΥ', 'el80098@mail.ntua.gr', '03180098'),
(26, 1, 'ΑΓΓΕΛΙΚΗ', 'ΒΑΣΙΛΕΙΟΥ', 'el80877@mail.ntua.gr', '03180877'),
(27, 1, 'ΠΑΝΑΓΙΩΤΗΣ', 'ΠΑΠΑΔΟΠΟΥΛΟΣ', 'el81697@mail.ntua.gr', '03181697'),
(28, 1, 'ΓΙΩΡΓΟΣ', 'ΔΗΜΗΤΡΙΟΥ', 'el78558@mail.ntua.gr', '03178558'),
(29, 1, 'ΑΓΓΕΛΙΚΗ', 'ΝΙΚΟΛΑΪΔΗΣ', 'el81097@mail.ntua.gr', '03181097'),
(30, 1, 'ΓΕΩΡΓΙΑ', 'ΘΕΟΔΩΡΟΥ', 'el80860@mail.ntua.gr', '03180860'),
(31, 1, 'ΜΑΡΙΑ', 'ΣΤΑΥΡΙΑΝΟΣ', 'el75501@mail.ntua.gr', '03175501'),
(32, 1, 'ΑΝΔΡΕΑΣ', 'ΣΤΑΥΡΙΑΝΟΣ', 'el80489@mail.ntua.gr', '03180489'),
(33, 1, 'ΘΕΟΔΩΡΟΣ', 'ΓΕΩΡΓΙΑΔΗΣ', 'el81875@mail.ntua.gr', '03181875'),
(34, 1, 'ΕΙΡΗΝΗ', 'ΠΑΠΑΔΟΠΟΥΛΟΣ', 'el80103@mail.ntua.gr', '03180103'),
(35, 1, 'ΚΑΤΕΡΙΝΑ', 'ΝΙΚΟΛΑΪΔΗΣ', 'el79110@mail.ntua.gr', '03179110'),
(36, 1, 'ΘΕΟΔΩΡΟΣ', 'ΠΑΠΑΓΕΩΡΓΙΟΥ', 'el81218@mail.ntua.gr', '03181218'),
(37, 1, 'ΜΑΡΙΑ', 'ΚΑΡΑΓΙΑΝΝΗΣ', 'el81100@mail.ntua.gr', '03181100'),
(38, 1, 'ΝΙΚΟΛΑΟΣ', 'ΑΝΑΣΤΑΣΙΟΥ', 'el81199@mail.ntua.gr', '03181199'),
(39, 1, 'ΚΩΝΣΤΑΝΤΙΝΟΣ', 'ΑΝΑΣΤΑΣΙΟΥ', 'el81130@mail.ntua.gr', '03181130'),
(40, 1, 'ΙΩΑΝΝΗΣ', 'ΠΑΠΑΔΟΠΟΥΛΟΣ', 'el80881@mail.ntua.gr', '03180881'),
(41, 1, 'ΕΙΡΗΝΗ', 'ΚΑΡΑΓΙΑΝΝΗΣ', 'el81243@mail.ntua.gr', '03181243'),
(42, 1, 'ΙΩΑΝΝΗΣ', 'ΠΑΠΑΓΕΩΡΓΙΟΥ', 'el81497@mail.ntua.gr', '03181497'),
(43, 1, 'ΚΑΤΕΡΙΝΑ', 'ΠΑΠΑΝΙΚΟΛΑΟΥ', 'el81191@mail.ntua.gr', '03181191'),
(44, 1, 'ΣΤΑΥΡΟΣ', 'ΑΛΕΞΑΝΔΡΟΥ', 'el81174@mail.ntua.gr', '03181174'),
(45, 1, 'ΓΕΩΡΓΙΑ', 'ΠΑΠΑΔΟΠΟΥΛΟΣ', 'el76729@mail.ntua.gr', '03176729'),
(46, 1, 'ΚΩΝΣΤΑΝΤΙΝΟΣ', 'ΠΑΠΑΝΙΚΟΛΑΟΥ', 'el80289@mail.ntua.gr', '03180289'),
(47, 1, 'ΧΡΙΣΤΙΝΑ', 'ΓΕΩΡΓΙΑΔΗΣ', 'el80167@mail.ntua.gr', '03180167'),
(48, 1, 'ΑΓΓΕΛΙΚΗ', 'ΠΑΝΑΓΙΩΤΙΔΗΣ', 'el67772@mail.ntua.gr', '03167772'),
(49, 1, 'ΘΕΟΔΩΡΟΣ', 'ΠΑΝΑΓΙΩΤΙΔΗΣ', 'el69745@mail.ntua.gr', '03169745'),
(50, 1, 'ΔΗΜΗΤΡΗΣ', 'ΑΝΑΣΤΑΣΙΟΥ', 'el81138@mail.ntua.gr', '03181138'),
(51, 1, 'ΝΙΚΟΛΑΟΣ', 'ΚΩΝΣΤΑΝΤΙΝΙΔΗΣ', 'el80885@mail.ntua.gr', '03180885'),
(52, 1, 'ΧΡΗΣΤΟΣ', 'ΓΕΩΡΓΙΑΔΗΣ', 'el81686@mail.ntua.gr', '03181686'),
(53, 1, 'ΓΕΩΡΓΙΑ', 'ΣΤΑΥΡΙΑΝΟΣ', 'el79565@mail.ntua.gr', '03179565'),
(54, 1, 'ΣΟΦΙΑ', 'ΧΑΤΖΗΝΙΚΟΛΑΟΥ', 'el64670@mail.ntua.gr', '03164670'),
(55, 1, 'ΑΝΝΑ', 'ΚΑΡΑΓΙΑΝΝΗΣ', 'el81145@mail.ntua.gr', '03181145'),
(56, 1, 'ΒΑΣΙΛΙΚΗ', 'ΚΩΝΣΤΑΝΤΙΝΙΔΗΣ', 'el80116@mail.ntua.gr', '03180116'),
(57, 1, 'ΑΝΝΑ', 'ΧΑΤΖΗΝΙΚΟΛΑΟΥ', 'el81213@mail.ntua.gr', '03181213'),
(58, 1, 'ΝΙΚΟΛΑΟΣ', 'ΑΝΑΣΤΑΣΙΟΥ', 'el76809@mail.ntua.gr', '03176809'),
(59, 1, 'ΠΑΝΑΓΙΩΤΗΣ', 'ΝΙΚΟΛΑΪΔΗΣ', 'el72573@mail.ntua.gr', '03172573'),
(60, 1, 'ΣΟΦΙΑ', 'ΚΩΝΣΤΑΝΤΙΝΙΔΗΣ', 'el81122@mail.ntua.gr', '03181122'),
(61, 1, 'ΓΕΩΡΓΙΑ', 'ΑΝΑΣΤΑΣΙΟΥ', 'el79907@mail.ntua.gr', '03179907'),
(62, 1, 'ΘΕΟΔΩΡΟΣ', 'ΧΑΤΖΗΝΙΚΟΛΑΟΥ', 'el80303@mail.ntua.gr', '03180303'),
(63, 1, 'ΧΡΗΣΤΟΣ', 'ΓΕΩΡΓΙΑΔΗΣ', 'el70803@mail.ntua.gr', '03170803'),
(64, 1, 'ΜΑΡΙΑ', 'ΠΑΠΑΝΙΚΟΛΑΟΥ', 'el81957@mail.ntua.gr', '03181957'),
(65, 1, 'ΠΑΝΑΓΙΩΤΗΣ', 'ΑΝΑΣΤΑΣΙΟΥ', 'el81123@mail.ntua.gr', '03181123'),
(66, 1, 'ΧΡΗΣΤΟΣ', 'ΘΕΟΔΩΡΟΥ', 'el61673@mail.ntua.gr', '03161673'),
(67, 1, 'ΔΗΜΗΤΡΗΣ', 'ΧΑΤΖΗΝΙΚΟΛΑΟΥ', 'el80140@mail.ntua.gr', '03180140'),
(68, 1, 'ΔΗΜΗΤΡΗΣ', 'ΚΩΝΣΤΑΝΤΙΝΙΔΗΣ', 'el81871@mail.ntua.gr', '03181871'),
(69, 1, 'ΕΙΡΗΝΗ', 'ΠΑΠΑΝΙΚΟΛΑΟΥ', 'el80189@mail.ntua.gr', '03180189'),
(70, 1, 'ΜΑΡΙΑ', 'ΛΑΜΠΡΟΠΟΥΛΟΣ', 'el81170@mail.ntua.gr', '03181170'),
(71, 1, 'ΑΝΔΡΕΑΣ', 'ΚΑΡΑΓΙΑΝΝΗΣ', 'el81881@mail.ntua.gr', '03181881'),
(72, 1, 'ΝΙΚΟΛΑΟΣ', 'ΚΩΝΣΤΑΝΤΙΝΙΔΗΣ', 'el81665@mail.ntua.gr', '03181665'),
(73, 1, 'ΒΑΣΙΛΙΚΗ', 'ΧΑΤΖΗΝΙΚΟΛΑΟΥ', 'el81158@mail.ntua.gr', '03181158'),
(74, 1, 'ΘΕΟΔΩΡΟΣ', 'ΛΑΜΠΡΟΠΟΥΛΟΣ', 'el79982@mail.ntua.gr', '03179982'),
(75, 1, 'ΑΝΝΑ', 'ΔΗΜΗΤΡΙΟΥ', 'el81266@mail.ntua.gr', '03181266'),
(76, 1, 'ΕΙΡΗΝΗ', 'ΑΝΑΣΤΑΣΙΟΥ', 'el80290@mail.ntua.gr', '03180290'),
(77, 1, 'ΔΗΜΗΤΡΗΣ', 'ΚΑΡΑΜΑΝΟΣ', 'el81959@mail.ntua.gr', '03181959'),
(78, 1, 'ΑΓΓΕΛΙΚΗ', 'ΑΝΑΣΤΑΣΙΟΥ', 'el81200@mail.ntua.gr', '03181200'),
(79, 1, 'ΘΕΟΔΩΡΟΣ', 'ΚΩΝΣΤΑΝΤΙΝΙΔΗΣ', 'el81507@mail.ntua.gr', '03181507'),
(80, 1, 'ΕΙΡΗΝΗ', 'ΑΝΔΡΕΟΥ', 'el79988@mail.ntua.gr', '03179988'),
(81, 1, 'ΧΡΙΣΤΙΝΑ', 'ΚΑΡΑΜΑΝΟΣ', 'el69746@mail.ntua.gr', '03169746'),
(82, 1, 'ΙΩΑΝΝΗΣ', 'ΚΑΡΑΓΙΑΝΝΗΣ', 'el78296@mail.ntua.gr', '03178296'),
(83, 1, 'ΚΩΝΣΤΑΝΤΙΝΟΣ', 'ΠΑΠΑΝΙΚΟΛΑΟΥ', 'el81884@mail.ntua.gr', '03181884'),
(84, 1, 'ΘΕΟΔΩΡΟΣ', 'ΑΝΑΣΤΑΣΙΟΥ', 'el79279@mail.ntua.gr', '03179279'),
(85, 1, 'ΑΝΝΑ', 'ΧΑΤΖΗΝΙΚΟΛΑΟΥ', 'el79943@mail.ntua.gr', '03179943'),
(86, 1, 'ΚΑΤΕΡΙΝΑ', 'ΘΕΟΔΩΡΟΥ', 'el81167@mail.ntua.gr', '03181167'),
(87, 1, 'ΘΕΟΔΩΡΟΣ', 'ΠΑΠΑΓΕΩΡΓΙΟΥ', 'el81178@mail.ntua.gr', '03181178'),
(88, 1, 'ΕΛΕΝΗ', 'ΘΕΟΔΩΡΟΥ', 'el80248@mail.ntua.gr', '03180248'),
(89, 1, 'ΑΝΔΡΕΑΣ', 'ΣΤΑΥΡΙΑΝΟΣ', 'el79172@mail.ntua.gr', '03179172'),
(90, 1, 'ΣΤΑΥΡΟΣ', 'ΑΝΔΡΕΟΥ', 'el80206@mail.ntua.gr', '03180206'),
(91, 1, 'ΧΡΗΣΤΟΣ', 'ΓΕΩΡΓΙΑΔΗΣ', 'el81886@mail.ntua.gr', '03181886'),
(92, 1, 'ΔΗΜΗΤΡΗΣ', 'ΣΠΥΡΙΔΩΝΟΣ', 'el77236@mail.ntua.gr', '03177236'),
(93, 1, 'ΑΓΓΕΛΙΚΗ', 'ΧΑΤΖΗΝΙΚΟΛΑΟΥ', 'el81154@mail.ntua.gr', '03181154'),
(94, 1, 'ΔΗΜΗΤΡΗΣ', 'ΠΑΠΑΔΟΠΟΥΛΟΣ', 'el81778@mail.ntua.gr', '03181778'),
(95, 1, 'ΕΙΡΗΝΗ', 'ΣΠΥΡΙΔΩΝΟΣ', 'el81887@mail.ntua.gr', '03181887'),
(96, 1, 'ΚΑΤΕΡΙΝΑ', 'ΧΑΤΖΗΝΙΚΟΛΑΟΥ', 'el80216@mail.ntua.gr', '03180216'),
(97, 1, 'ΧΡΗΣΤΟΣ', 'ΑΝΑΣΤΑΣΙΟΥ', 'el81095@mail.ntua.gr', '03181095'),
(98, 1, 'ΒΑΣΙΛΙΚΗ', 'ΠΑΠΑΓΕΩΡΓΙΟΥ', 'el81964@mail.ntua.gr', '03181964'),
(99, 1, 'ΑΓΓΕΛΙΚΗ', 'ΑΛΕΞΑΝΔΡΟΥ', 'el81140@mail.ntua.gr', '03181140'),
(100, 1, 'ΚΑΤΕΡΙΝΑ', 'ΚΑΡΑΜΑΝΟΣ', 'el80210@mail.ntua.gr', '03180210'),
(101, 1, 'ΓΕΩΡΓΙΑ', 'ΔΗΜΗΤΡΙΟΥ', 'el80891@mail.ntua.gr', '03180891'),
(102, 1, 'ΑΝΝΑ', 'ΔΗΜΗΤΡΙΟΥ', 'el81925@mail.ntua.gr', '03181925'),
(103, 1, 'ΑΝΔΡΕΑΣ', 'ΓΕΩΡΓΙΑΔΗΣ', 'el78996@mail.ntua.gr', '03178996'),
(104, 1, 'ΝΙΚΟΛΑΟΣ', 'ΝΙΚΟΛΑΪΔΗΣ', 'el81189@mail.ntua.gr', '03181189'),
(105, 1, 'ΧΡΙΣΤΙΝΑ', 'ΠΑΠΑΔΟΠΟΥΛΟΣ', 'el81066@mail.ntua.gr', '03181066'),
(106, 1, 'ΑΓΓΕΛΙΚΗ', 'ΒΑΣΙΛΕΙΟΥ', 'el79090@mail.ntua.gr', '03179090'),
(107, 1, 'ΔΗΜΗΤΡΗΣ', 'ΣΤΑΥΡΙΑΝΟΣ', 'el80069@mail.ntua.gr', '03180069'),
(108, 1, 'ΠΑΝΑΓΙΩΤΗΣ', 'ΔΗΜΗΤΡΙΟΥ', 'el80213@mail.ntua.gr', '03180213'),
(109, 1, 'ΜΑΡΙΑ', 'ΚΩΝΣΤΑΝΤΙΝΙΔΗΣ', 'el80281@mail.ntua.gr', '03180281'),
(110, 1, 'ΒΑΣΙΛΙΚΗ', 'ΒΑΣΙΛΕΙΟΥ', 'el81928@mail.ntua.gr', '03181928'),
(111, 1, 'ΔΗΜΗΤΡΗΣ', 'ΒΑΣΙΛΕΙΟΥ', 'el81121@mail.ntua.gr', '03181121'),
(112, 1, 'ΘΕΟΔΩΡΟΣ', 'ΠΑΝΑΓΙΩΤΙΔΗΣ', 'el81489@mail.ntua.gr', '03181489'),
(113, 1, 'ΠΑΝΑΓΙΩΤΗΣ', 'ΑΝΔΡΕΟΥ', 'el81857@mail.ntua.gr', '03181857'),
(114, 1, 'ΝΙΚΟΛΑΟΣ', 'ΧΑΤΖΗΝΙΚΟΛΑΟΥ', 'el81110@mail.ntua.gr', '03181110');

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `id` int NOT NULL,
  `institution_id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `surname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
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
  `uid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `file` blob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `uploads`
--

--
-- Indexes for dumped tables
--

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `grades`
--
ALTER TABLE `grades`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT for table `institutions`
--
ALTER TABLE `institutions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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
