CREATE DATABASE IF NOT EXISTS hackathon_registration;
USE hackathon_registration;

-- Table for participants/students
CREATE TABLE IF NOT EXISTS participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    college_name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    student_id VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for hackathon teams
CREATE TABLE IF NOT EXISTS teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(255) NOT NULL UNIQUE,
    team_leader_id INT NULL,
    track VARCHAR(100) NOT NULL,
    problem_statement TEXT NOT NULL,
    technology_stack VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_leader_id) REFERENCES participants(id) ON DELETE SET NULL
);

-- Table to map participants into their teams
CREATE TABLE IF NOT EXISTS team_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    participant_id INT NOT NULL,
    role VARCHAR(50) DEFAULT 'member', -- 'leader' or 'member'
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_team_participant (team_id, participant_id),
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);

-- Table for formal registration records
CREATE TABLE IF NOT EXISTS registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_id VARCHAR(100) NOT NULL UNIQUE,
    team_id INT NOT NULL UNIQUE,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'confirmed',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);
