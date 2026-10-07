-- Seed script for hackathon_registration database
USE hackathon_registration;

-- Add a mock participant
INSERT INTO participants (full_name, email, phone, college_name, department, year, student_id)
VALUES ('John Doe', 'john.doe@example.com', '9876543210', 'Tech Innovation University', 'Computer Science', 3, 'STU-2026-001')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- Add a mock team
INSERT INTO teams (team_name, team_leader_id, track, problem_statement, technology_stack)
VALUES ('Alpha Devs', 1, 'Web Technology', 'Building a high-throughput smart grid dashboard.', 'Next.js, TailwindCSS, Express, MySQL')
ON DUPLICATE KEY UPDATE team_name=VALUES(team_name);

-- Map the leader in team_members
INSERT INTO team_members (team_id, participant_id, role)
VALUES (1, 1, 'leader')
ON DUPLICATE KEY UPDATE role=VALUES(role);

-- Create a mock registration record
INSERT INTO registrations (registration_id, team_id, status)
VALUES ('HACK-2026-01', 1, 'confirmed')
ON DUPLICATE KEY UPDATE registration_id=VALUES(registration_id);
