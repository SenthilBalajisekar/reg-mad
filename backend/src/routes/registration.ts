import { Router, Request, Response } from "express";
import pool from "../config/database";
import { EVENT_CONFIG } from "../config/event";
import { ResultSetHeader, RowDataPacket } from "mysql2";

const router = Router();

// Endpoint: POST /api/registrations (Full Transaction Sign-Up)
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { teamName, track, problemStatement, technologyStack, leader, members } = req.body;

  // 1. Inputs validation
  if (!teamName || !leader) {
    res.status(400).json({ error: "Please complete team name and leader details." });
    return;
  }

  // Set default values for 3-step registration workflow
  const finalTrack = track || "Website Development";
  const finalProblemStatement = problemStatement || "To build the website based on the SDG goals. The Problem Statement will be given on the spot.";
  const finalTechStack = technologyStack || "Website Development";

  // Validate leader fields
  const leaderName = leader.fullName;
  const leaderEmail = leader.email;
  const leaderPhone = leader.phone;
  const leaderStudentId = leader.studentId;
  const leaderCollege = "";
  const leaderDept = leader.department || "Computer Science & Engineering";
  const leaderYear = leader.year || 1;

  if (!leaderName || !leaderEmail || !leaderPhone || !leaderStudentId) {
    res.status(400).json({ error: "Please complete all leader details (Name, Email, Phone, Student ID)." });
    return;
  }

  // Validate team size constraints (leader + members)
  const totalMembers = 1 + (members ? members.length : 0);
  if (totalMembers < EVENT_CONFIG.minTeamSize || totalMembers > EVENT_CONFIG.maxTeamSize) {
    res.status(400).json({ 
      error: `Team size must be between ${EVENT_CONFIG.minTeamSize} and ${EVENT_CONFIG.maxTeamSize} members.` 
    });
    return;
  }

  // Compile all participant emails and student IDs for check
  const allEmails = [leaderEmail];
  const allStudentIds = [leaderStudentId];

  if (members && members.length > 0) {
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.fullName || !m.email || !m.phone || !m.studentId) {
        res.status(400).json({ error: `Please fill all details for Team Member ${i + 1}.` });
        return;
      }
      m.collegeName = "";
      m.department = m.department || leaderDept;
      m.year = m.year || leaderYear;

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
  const connection = await pool.getConnection();

  try {
    // 2. Start Transaction
    await connection.beginTransaction();

    // 3. Uniqueness Checks in Database
    // Check Team Name
    const [teamCheck] = await connection.query<RowDataPacket[]>(
      "SELECT id FROM teams WHERE team_name = ?",
      [teamName]
    );
    if (teamCheck.length > 0) {
      res.status(400).json({ error: `Team name '${teamName}' is already taken.` });
      await connection.rollback();
      return;
    }

    // Check Duplicate Emails
    const [emailCheck] = await connection.query<RowDataPacket[]>(
      "SELECT email, full_name FROM participants WHERE email IN (?)",
      [allEmails]
    );
    if (emailCheck.length > 0) {
      res.status(400).json({ 
        error: `Email '${emailCheck[0].email}' (${emailCheck[0].full_name}) is already registered.` 
      });
      await connection.rollback();
      return;
    }

    // Check Duplicate Student IDs
    const [studentIdCheck] = await connection.query<RowDataPacket[]>(
      "SELECT student_id, full_name FROM participants WHERE student_id IN (?)",
      [allStudentIds]
    );
    if (studentIdCheck.length > 0) {
      res.status(400).json({ 
        error: `Student ID '${studentIdCheck[0].student_id}' (${studentIdCheck[0].full_name}) is already registered.` 
      });
      await connection.rollback();
      return;
    }

    // 4. Create Leader Participant
    const [leaderResult] = await connection.query<ResultSetHeader>(
      `INSERT INTO participants (full_name, email, phone, college_name, department, year, student_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [leaderName, leaderEmail, leaderPhone, "", leaderDept, leaderYear, leaderStudentId]
    );
    const leaderParticipantId = leaderResult.insertId;

    // Create Team
    const [teamResult] = await connection.query<ResultSetHeader>(
      `INSERT INTO teams (team_name, team_leader_id, track, problem_statement, technology_stack) 
       VALUES (?, ?, ?, ?, ?)`,
      [teamName, leaderParticipantId, finalTrack, finalProblemStatement, finalTechStack]
    );
    const teamId = teamResult.insertId;

    // Link Leader in team_members
    await connection.query(
      `INSERT INTO team_members (team_id, participant_id, role) VALUES (?, ?, 'leader')`,
      [teamId, leaderParticipantId]
    );

    // 5. Create other Members
    if (members && members.length > 0) {
      for (const m of members) {
        const [mResult] = await connection.query<ResultSetHeader>(
          `INSERT INTO participants (full_name, email, phone, college_name, department, year, student_id) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [m.fullName, m.email, m.phone, "", m.department || leaderDept, m.year || leaderYear, m.studentId]
        );
        const mParticipantId = mResult.insertId;

        await connection.query(
          `INSERT INTO team_members (team_id, participant_id, role) VALUES (?, ?, 'member')`,
          [teamId, mParticipantId]
        );
      }
    }

    // 6. Create Registration Row & Format sequential Registration ID
    // We insert a temporary registration key first, get the record auto-increment ID,
    // and then update it to HACK-2026-XXXXX.
    const tempRegId = `TEMP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const [regResult] = await connection.query<ResultSetHeader>(
      "INSERT INTO registrations (registration_id, team_id, status) VALUES (?, ?, 'confirmed')",
      [tempRegId, teamId]
    );
    const registrationPrimaryKey = regResult.insertId;
    const formattedRegId = `HACK-2026-${String(registrationPrimaryKey).padStart(5, "0")}`;

    await connection.query(
      "UPDATE registrations SET registration_id = ? WHERE id = ?",
      [formattedRegId, registrationPrimaryKey]
    );

    // 7. Commit Transaction
    await connection.commit();

    // Success response
    res.status(201).json({
      success: true,
      message: "Registration completed successfully!",
      registrationId: formattedRegId,
      teamName: teamName
    });

  } catch (error: any) {
    await connection.rollback();
    console.error("Error in registration transaction:", error);
    res.status(500).json({ error: "Registration failed. Server or database error occurred." });
  } finally {
    connection.release();
  }
});

// Endpoint: GET /api/registrations/:registrationId (Fetch Details)
router.get("/:registrationId", async (req: Request, res: Response): Promise<void> => {
  const { registrationId } = req.params;

  try {
    // Get registration row
    const [regRows] = await pool.query<RowDataPacket[]>(
      `SELECT r.registration_id, r.status, r.registered_at, r.team_id 
       FROM registrations r 
       WHERE r.registration_id = ?`,
      [registrationId]
    );

    if (regRows.length === 0) {
      res.status(404).json({ error: `Registration ID '${registrationId}' not found.` });
      return;
    }

    const reg = regRows[0];

    // Get team row
    const [teamRows] = await pool.query<RowDataPacket[]>(
      `SELECT t.id, t.team_name, t.track, t.problem_statement, t.technology_stack, t.team_leader_id 
       FROM teams t 
       WHERE t.id = ?`,
      [reg.team_id]
    );

    const team = teamRows[0];

    // Get team members (with participant details)
    const [memberRows] = await pool.query<RowDataPacket[]>(
      `SELECT p.id, p.full_name, p.email, p.phone, p.department, p.year, p.student_id, tm.role 
       FROM team_members tm
       JOIN participants p ON tm.participant_id = p.id
       WHERE tm.team_id = ?
       ORDER BY tm.role DESC, p.full_name ASC`, // leader first
      [reg.team_id]
    );

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
  } catch (error) {
    console.error("Error fetching registration:", error);
    res.status(500).json({ error: "Failed to fetch registration details." });
  }
});

// Endpoint: GET /api/stats (Admin Ready Analytics Dashboard Statistics)
router.get("/dashboard/stats", async (req: Request, res: Response): Promise<void> => {
  try {
    const [totalReg] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) as count FROM registrations");
    const [totalPart] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) as count FROM participants");
    const [totalTeams] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) as count FROM teams");
    
    // Count teams per track
    const [trackBreakdown] = await pool.query<RowDataPacket[]>(
      "SELECT track, COUNT(*) as count FROM teams GROUP BY track"
    );

    // List recent registrations
    const [recentRegs] = await pool.query<RowDataPacket[]>(
      `SELECT r.registration_id, t.team_name, t.track, r.status, r.registered_at 
       FROM registrations r
       JOIN teams t ON r.team_id = t.id
       ORDER BY r.registered_at DESC
       LIMIT 5`
    );

    res.status(200).json({
      totalRegistrations: totalReg[0].count,
      totalParticipants: totalPart[0].count,
      totalTeams: totalTeams[0].count,
      tracks: trackBreakdown,
      recentRegistrations: recentRegs
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: "Failed to fetch stats dashboard info." });
  }
});

// Endpoint: DELETE /api/registrations/reset/all (Clear ALL registered teams)
router.delete("/reset/all", async (req: Request, res: Response): Promise<void> => {
  const connection = await pool.getConnection();
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
  } catch (error) {
    console.error("Error resetting registered teams:", error);
    res.status(500).json({ error: "Failed to reset registration database tables." });
  } finally {
    connection.release();
  }
});

// Endpoint: DELETE /api/registrations/:registrationId (Delete a specific team by ID)
router.delete("/:registrationId", async (req: Request, res: Response): Promise<void> => {
  const { registrationId } = req.params;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [regRows] = await connection.query<RowDataPacket[]>(
      "SELECT team_id FROM registrations WHERE registration_id = ?",
      [registrationId]
    );

    if (regRows.length === 0) {
      res.status(404).json({ error: `Registration ID '${registrationId}' not found.` });
      await connection.rollback();
      return;
    }

    const teamId = regRows[0].team_id;

    // Get participant IDs in the team
    const [members] = await connection.query<RowDataPacket[]>(
      "SELECT participant_id FROM team_members WHERE team_id = ?",
      [teamId]
    );
    const participantIds = members.map(m => m.participant_id);

    // Delete relationships and records
    await connection.query("DELETE FROM registrations WHERE team_id = ?", [teamId]);
    await connection.query("DELETE FROM team_members WHERE team_id = ?", [teamId]);
    await connection.query("DELETE FROM teams WHERE id = ?", [teamId]);

    if (participantIds.length > 0) {
      await connection.query("DELETE FROM participants WHERE id IN (?)", [participantIds]);
    }

    await connection.commit();

    res.status(200).json({
      success: true,
      message: `Team with Registration ID '${registrationId}' has been deleted.`
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting registration:", error);
    res.status(500).json({ error: "Failed to delete team registration." });
  } finally {
    connection.release();
  }
});

export default router;
