"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../config/database"));
const event_1 = require("../config/event");
const router = (0, express_1.Router)();
// Endpoint: POST /api/registrations (Full Transaction Sign-Up)
router.post("/", async (req, res) => {
    const { teamName, track, problemStatement, technologyStack, leader, members } = req.body;
    // 2. Inputs validation
    if (!teamName || !leader) {
        res.status(400).json({ error: "Please complete team name and leader details." });
        return;
    }
    // Set default values for 3-step registration workflow
    const finalTrack = track || "Mobile App Development";
    const finalProblemStatement = problemStatement || "To build the mobile app based on the SDG goals. The Problem Statement will be given on the spot.";
    const finalTechStack = technologyStack || "Mobile App Development";
    // Validate leader fields
    const leaderName = leader.fullName;
    const leaderEmail = leader.email;
    const leaderPhone = leader.phone;
    const leaderStudentId = leader.studentId;
    const leaderCollege = "";
    const leaderDept = leader.department;
    const leaderYear = Number(leader.year) || 1;
    if (!leaderName || !leaderEmail || !leaderPhone || !leaderStudentId || !leaderDept) {
        res.status(400).json({ error: "Please complete all leader details (Name, Email, Phone, Student ID, Department, Year)." });
        return;
    }
    // Validate team size constraints (leader + members)
    const totalMembers = 1 + (members ? members.length : 0);
    if (totalMembers < event_1.EVENT_CONFIG.minTeamSize || totalMembers > event_1.EVENT_CONFIG.maxTeamSize) {
        res.status(400).json({
            error: `Team size must be between ${event_1.EVENT_CONFIG.minTeamSize} and ${event_1.EVENT_CONFIG.maxTeamSize} members.`
        });
        return;
    }
    // Compile all participant emails and student IDs for check
    const allEmails = [leaderEmail];
    const allStudentIds = [leaderStudentId];
    if (members && members.length > 0) {
        for (let i = 0; i < members.length; i++) {
            const m = members[i];
            if (!m.fullName || !m.email || !m.phone || !m.studentId || !m.department || !m.year) {
                res.status(400).json({ error: `Please fill all details (including Department and Year) for Team Member ${i + 1}.` });
                return;
            }
            m.collegeName = "";
            m.department = m.department;
            m.year = Number(m.year) || 1;
            allEmails.push(m.email);
            allStudentIds.push(m.studentId);
        }
    }
    // Check for duplicate emails/student IDs in the incoming list itself
    if (new Set(allEmails).size !== allEmails.length) {
        res.status(400).json({ error: "Duplicate email addresses detected in team details." });
        return;
    }
    if (new Set(allStudentIds).size !== allStudentIds.length) {
        res.status(400).json({ error: "Duplicate Student IDs detected in team details." });
        return;
    }
    // Get DB connection
    const connection = await database_1.default.getConnection();
    try {
        // 2. Start Transaction
        await connection.beginTransaction();
        // 3. Uniqueness Checks in Database
        // Check Team Name
        const [teamCheck] = await connection.query("SELECT id FROM teams WHERE team_name = ?", [teamName]);
        if (teamCheck.length > 0) {
            res.status(400).json({ error: `Team name '${teamName}' is already taken.` });
            await connection.rollback();
            return;
        }
        // Check Duplicate Emails
        const emailPlaceholders = allEmails.map(() => "?").join(",");
        const [emailCheck] = await connection.query(`SELECT email, full_name FROM participants WHERE email IN (${emailPlaceholders})`, allEmails);
        if (emailCheck.length > 0) {
            res.status(400).json({
                error: `Email '${emailCheck[0].email}' (${emailCheck[0].full_name}) is already registered.`
            });
            await connection.rollback();
            return;
        }
        // Check Duplicate Student IDs
        const studentIdPlaceholders = allStudentIds.map(() => "?").join(",");
        const [studentIdCheck] = await connection.query(`SELECT student_id, full_name FROM participants WHERE student_id IN (${studentIdPlaceholders})`, allStudentIds);
        if (studentIdCheck.length > 0) {
            res.status(400).json({
                error: `Student ID '${studentIdCheck[0].student_id}' (${studentIdCheck[0].full_name}) is already registered.`
            });
            await connection.rollback();
            return;
        }
        // 4. Create Leader Participant
        const [leaderResult] = await connection.query(`INSERT INTO participants (full_name, email, phone, college_name, department, year, student_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`, [leaderName, leaderEmail, leaderPhone, "", leaderDept, leaderYear, leaderStudentId]);
        const leaderParticipantId = leaderResult.insertId;
        // Create Team
        const [teamResult] = await connection.query(`INSERT INTO teams (team_name, team_leader_id, track, problem_statement, technology_stack) 
       VALUES (?, ?, ?, ?, ?)`, [teamName, leaderParticipantId, finalTrack, finalProblemStatement, finalTechStack]);
        const teamId = teamResult.insertId;
        // Link Leader in team_members
        await connection.query(`INSERT INTO team_members (team_id, participant_id, role) VALUES (?, ?, 'leader')`, [teamId, leaderParticipantId]);
        // 5. Create other Members
        if (members && members.length > 0) {
            for (const m of members) {
                const [mResult] = await connection.query(`INSERT INTO participants (full_name, email, phone, college_name, department, year, student_id) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`, [m.fullName, m.email, m.phone, "", m.department || leaderDept, m.year || leaderYear, m.studentId]);
                const mParticipantId = mResult.insertId;
                await connection.query(`INSERT INTO team_members (team_id, participant_id, role) VALUES (?, ?, 'member')`, [teamId, mParticipantId]);
            }
        }
        // 6. Create Registration Row & Format sequential Registration ID
        // We insert a temporary registration key first, get the record auto-increment ID,
        // and then update it to HACK-2026-XXXXX.
        const tempRegId = `TEMP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const [regResult] = await connection.query("INSERT INTO registrations (registration_id, team_id, status) VALUES (?, ?, 'confirmed')", [tempRegId, teamId]);
        const registrationPrimaryKey = regResult.insertId;
        const formattedRegId = `HACK-2026-${String(registrationPrimaryKey).padStart(5, "0")}`;
        await connection.query("UPDATE registrations SET registration_id = ? WHERE id = ?", [formattedRegId, registrationPrimaryKey]);
        // 7. Commit Transaction
        await connection.commit();
        // Success response
        res.status(201).json({
            success: true,
            message: "Registration completed successfully!",
            registrationId: formattedRegId,
            teamName: teamName
        });
    }
    catch (error) {
        await connection.rollback();
        console.error("Error in registration transaction:", error);
        res.status(500).json({ error: error.message || "Registration failed. Server or database error occurred." });
    }
    finally {
        connection.release();
    }
});
// Endpoint: POST /api/registrations/admin/login
router.post("/admin/login", async (req, res) => {
    const { password } = req.body;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "009213";
    if (password === ADMIN_PASSWORD || password === "009213") {
        res.status(200).json({
            success: true,
            token: "mac-admin-valid-token-2026",
            message: "Admin authentication successful."
        });
    }
    else {
        res.status(401).json({ error: "Invalid admin password." });
    }
});
// Endpoint: GET /api/registrations/admin/all (Fetch all registered teams with leader & members)
router.get("/admin/all", async (req, res) => {
    try {
        const [teams] = await database_1.default.query(`SELECT r.registration_id, r.status, r.registered_at, 
              t.id as team_id, t.team_name, t.track, t.problem_statement, t.technology_stack
       FROM registrations r
       JOIN teams t ON r.team_id = t.id
       ORDER BY r.registered_at DESC`);
        const fullRegistrations = [];
        for (const team of teams) {
            const [members] = await database_1.default.query(`SELECT p.id, p.full_name, p.email, p.phone, p.department, p.year, p.student_id, tm.role
         FROM team_members tm
         JOIN participants p ON tm.participant_id = p.id
         WHERE tm.team_id = ?
         ORDER BY tm.role DESC, p.full_name ASC`, [team.team_id]);
            const leader = members.find(m => m.role === "leader") || members[0];
            const otherMembers = members.filter(m => m.role !== "leader");
            fullRegistrations.push({
                registrationId: team.registration_id,
                status: team.status,
                registeredAt: team.registered_at,
                teamName: team.team_name,
                track: team.track,
                problemStatement: team.problem_statement,
                technologyStack: team.technology_stack,
                leader: leader ? {
                    id: leader.id,
                    fullName: leader.full_name,
                    email: leader.email,
                    phone: leader.phone,
                    department: leader.department,
                    year: leader.year,
                    studentId: leader.student_id
                } : null,
                members: otherMembers.map(m => ({
                    id: m.id,
                    fullName: m.full_name,
                    email: m.email,
                    phone: m.phone,
                    department: m.department,
                    year: m.year,
                    studentId: m.student_id
                })),
                totalMembersCount: members.length
            });
        }
        res.status(200).json({
            totalTeams: fullRegistrations.length,
            registrations: fullRegistrations
        });
    }
    catch (error) {
        console.error("Error fetching all admin registrations:", error);
        res.status(500).json({ error: "Failed to fetch registrations for admin." });
    }
});
// Endpoint: GET /api/registrations/:registrationId (Fetch Details)
router.get("/:registrationId", async (req, res) => {
    const { registrationId } = req.params;
    try {
        // Get registration row
        const [regRows] = await database_1.default.query(`SELECT r.registration_id, r.status, r.registered_at, r.team_id 
       FROM registrations r 
       WHERE r.registration_id = ?`, [registrationId]);
        if (regRows.length === 0) {
            res.status(404).json({ error: `Registration ID '${registrationId}' not found.` });
            return;
        }
        const reg = regRows[0];
        // Get team row
        const [teamRows] = await database_1.default.query(`SELECT t.id, t.team_name, t.track, t.problem_statement, t.technology_stack, t.team_leader_id 
       FROM teams t 
       WHERE t.id = ?`, [reg.team_id]);
        const team = teamRows[0];
        // Get team members (with participant details)
        const [memberRows] = await database_1.default.query(`SELECT p.id, p.full_name, p.email, p.phone, p.department, p.year, p.student_id, tm.role 
       FROM team_members tm
       JOIN participants p ON tm.participant_id = p.id
       WHERE tm.team_id = ?
       ORDER BY tm.role DESC, p.full_name ASC`, // leader first
        [reg.team_id]);
        res.status(200).json({
            registrationId: reg.registration_id,
            status: reg.status,
            registeredAt: reg.registered_at,
            team: {
                id: team.id,
                teamName: team.team_name,
                track: team.track,
                problemStatement: team.problem_statement,
                technologyStack: team.technology_stack,
                leaderId: team.team_leader_id
            },
            members: memberRows.map(m => ({
                fullName: m.full_name,
                email: m.email,
                phone: m.phone,
                collegeName: m.college_name,
                department: m.department,
                year: m.year,
                studentId: m.student_id,
                role: m.role
            }))
        });
    }
    catch (error) {
        console.error("Error fetching registration:", error);
        res.status(500).json({ error: "Failed to fetch registration details." });
    }
});
// Endpoint: GET /api/stats (Admin Ready Analytics Dashboard Statistics)
router.get("/dashboard/stats", async (req, res) => {
    try {
        const [totalReg] = await database_1.default.query("SELECT COUNT(*) as count FROM registrations");
        const [totalPart] = await database_1.default.query("SELECT COUNT(*) as count FROM participants");
        const [totalTeams] = await database_1.default.query("SELECT COUNT(*) as count FROM teams");
        // Count teams per track
        const [trackBreakdown] = await database_1.default.query("SELECT track, COUNT(*) as count FROM teams GROUP BY track");
        // List recent registrations
        const [recentRegs] = await database_1.default.query(`SELECT r.registration_id, t.team_name, t.track, r.status, r.registered_at 
       FROM registrations r
       JOIN teams t ON r.team_id = t.id
       ORDER BY r.registered_at DESC
       LIMIT 5`);
        res.status(200).json({
            totalRegistrations: totalReg[0].count,
            totalParticipants: totalPart[0].count,
            totalTeams: totalTeams[0].count,
            tracks: trackBreakdown,
            recentRegistrations: recentRegs
        });
    }
    catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ error: "Failed to fetch stats dashboard info." });
    }
});
// Endpoint: POST /api/registrations/admin/login
router.post("/admin/login", async (req, res) => {
    const { password } = req.body;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "009213";
    if (password === ADMIN_PASSWORD || password === "009213") {
        res.status(200).json({
            success: true,
            token: "mac-admin-valid-token-2026",
            message: "Admin authentication successful."
        });
    }
    else {
        res.status(401).json({ error: "Invalid admin password." });
    }
});
// Endpoint: GET /api/registrations/admin/all (Fetch all registered teams with leader & members)
router.get("/admin/all", async (req, res) => {
    try {
        const [teams] = await database_1.default.query(`SELECT r.registration_id, r.status, r.registered_at, 
              t.id as team_id, t.team_name, t.track, t.problem_statement, t.technology_stack, t.team_leader_id
       FROM registrations r
       JOIN teams t ON r.team_id = t.id
       ORDER BY r.registered_at DESC`);
        const fullRegistrations = [];
        for (const team of teams) {
            const [members] = await database_1.default.query(`SELECT p.id, p.full_name, p.email, p.phone, p.department, p.year, p.student_id, tm.role 
         FROM team_members tm
         JOIN participants p ON tm.participant_id = p.id
         WHERE tm.team_id = ?
         ORDER BY tm.role DESC, p.full_name ASC`, [team.team_id]);
            const leader = members.find(m => m.role === "leader") || members[0];
            const otherMembers = members.filter(m => m.role !== "leader");
            fullRegistrations.push({
                registrationId: team.registration_id,
                status: team.status,
                registeredAt: team.registered_at,
                teamName: team.team_name,
                track: team.track,
                problemStatement: team.problem_statement,
                technologyStack: team.technology_stack,
                leader: leader ? {
                    id: leader.id,
                    fullName: leader.full_name,
                    email: leader.email,
                    phone: leader.phone,
                    department: leader.department,
                    year: leader.year,
                    studentId: leader.student_id
                } : null,
                members: otherMembers.map(m => ({
                    id: m.id,
                    fullName: m.full_name,
                    email: m.email,
                    phone: m.phone,
                    department: m.department,
                    year: m.year,
                    studentId: m.student_id
                })),
                totalMembersCount: members.length
            });
        }
        res.status(200).json({
            totalTeams: fullRegistrations.length,
            registrations: fullRegistrations
        });
    }
    catch (error) {
        console.error("Error fetching all admin registrations:", error);
        res.status(500).json({ error: "Failed to fetch registrations for admin." });
    }
});
// Endpoint: DELETE /api/registrations/reset/all (Clear ALL registered teams)
router.delete("/reset/all", async (req, res) => {
    const connection = await database_1.default.getConnection();
    try {
        await connection.query("SET FOREIGN_KEY_CHECKS = 0");
        await connection.query("TRUNCATE TABLE registrations");
        await connection.query("TRUNCATE TABLE team_members");
        await connection.query("TRUNCATE TABLE teams");
        await connection.query("TRUNCATE TABLE participants");
        await connection.query("SET FOREIGN_KEY_CHECKS = 1");
        res.status(200).json({
            success: true,
            message: "All registered teams and participants have been successfully cleared."
        });
    }
    catch (error) {
        console.error("Error resetting registered teams:", error);
        res.status(500).json({ error: "Failed to reset registration database tables." });
    }
    finally {
        connection.release();
    }
});
// Endpoint: DELETE /api/registrations/:registrationId (Delete a specific team by ID)
router.delete("/:registrationId", async (req, res) => {
    const { registrationId } = req.params;
    const connection = await database_1.default.getConnection();
    try {
        await connection.beginTransaction();
        const [regRows] = await connection.query("SELECT team_id FROM registrations WHERE registration_id = ?", [registrationId]);
        if (regRows.length === 0) {
            res.status(404).json({ error: `Registration ID '${registrationId}' not found.` });
            await connection.rollback();
            return;
        }
        const teamId = regRows[0].team_id;
        // Get participant IDs in the team
        const [members] = await connection.query("SELECT participant_id FROM team_members WHERE team_id = ?", [teamId]);
        const participantIds = members.map(m => m.participant_id);
        // Delete relationships and records
        await connection.query("DELETE FROM registrations WHERE team_id = ?", [teamId]);
        await connection.query("DELETE FROM team_members WHERE team_id = ?", [teamId]);
        await connection.query("DELETE FROM teams WHERE id = ?", [teamId]);
        if (participantIds.length > 0) {
            const placeholders = participantIds.map(() => "?").join(",");
            await connection.query(`DELETE FROM participants WHERE id IN (${placeholders})`, participantIds);
        }
        await connection.commit();
        res.status(200).json({
            success: true,
            message: `Team with Registration ID '${registrationId}' and all its participants have been deleted from database.`
        });
    }
    catch (error) {
        await connection.rollback();
        console.error("Error deleting registration:", error);
        res.status(500).json({ error: "Failed to delete team registration." });
    }
    finally {
        connection.release();
    }
});
// Endpoint: DELETE /api/registrations/participant/:participantId (Remove an individual member from DB)
router.delete("/participant/:participantId", async (req, res) => {
    const { participantId } = req.params;
    const connection = await database_1.default.getConnection();
    try {
        await connection.beginTransaction();
        const [members] = await connection.query("SELECT team_id, role FROM team_members WHERE participant_id = ?", [participantId]);
        if (members.length === 0) {
            res.status(404).json({ error: "Participant record not found in database." });
            await connection.rollback();
            return;
        }
        const { role } = members[0];
        if (role === "leader") {
            res.status(400).json({ error: "Cannot delete team leader individually. Remove the whole team instead." });
            await connection.rollback();
            return;
        }
        await connection.query("DELETE FROM team_members WHERE participant_id = ?", [participantId]);
        await connection.query("DELETE FROM participants WHERE id = ?", [participantId]);
        await connection.commit();
        res.status(200).json({
            success: true,
            message: "Participant deleted successfully from database."
        });
    }
    catch (error) {
        await connection.rollback();
        console.error("Error deleting participant from database:", error);
        res.status(500).json({ error: "Failed to delete participant from database." });
    }
    finally {
        connection.release();
    }
});
exports.default = router;
