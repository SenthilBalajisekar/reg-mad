const http = require('http');
const https = require('https');

// Target API endpoint URL (tries live Render backend first, falls back to localhost)
const LIVE_API_URL = process.env.API_URL || 'https://mad-reg-backend.onrender.com/api/registrations';
const LOCAL_API_URL = 'http://localhost:5000/api/registrations';

const tracks = [
  "Cross-Platform Mobile Apps",
  "AI-Powered Mobile Solutions",
  "Real-Time Utility & Smart City Apps",
  "Mobile Security & Data Privacy",
  "Social Impact & SDG Mobile Apps"
];

const techStacks = [
  "Flutter & Firebase",
  "React Native & Node.js",
  "Android Kotlin & Supabase",
  "Swift iOS & Python API",
  "Next.js PWA & MySQL"
];

const departments = [
  "Computer Science & Engineering",
  "Information Technology",
  "Artificial Intelligence & Machine Learning",
  "Electronics & Communication Engineering",
  "Data Science & Cyber Security"
];

const firstNames = ["Aarav", "Ananya", "Rohan", "Priya", "Vikram", "Sneha", "Karthik", "Divya", "Siddharth", "Meera", "Rahul", "Kavya", "Arjun", "Neha", "Aditya", "Riya", "Varun", "Pooja", "Vishal", "Swati"];
const lastNames = ["Sharma", "Verma", "Patel", "Reddy", "Nair", "Iyer", "Kumar", "Singh", "Joshi", "Gupta", "Balaji", "Rao", "Deshmukh", "Chowdhury", "Pillai", "Subramanian", "Menon", "Kaur", "Dutta", "Das"];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeRegistrationPayload(index) {
  const paddedIndex = String(index).padStart(3, '0');
  const teamName = `Team Apex ${paddedIndex}`;
  
  const leaderName = `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`;
  const leaderEmail = `leader_${paddedIndex}_${Date.now()}@sample.test`;
  const leaderPhone = `98765${String(10000 + index).slice(1)}`;
  const leaderStudentId = `REG2026L${paddedIndex}`;

  const member1Name = `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`;
  const member1Email = `member1_${paddedIndex}_${Date.now()}@sample.test`;
  const member1Phone = `98764${String(10000 + index).slice(1)}`;
  const member1StudentId = `REG2026M1${paddedIndex}`;

  const member2Name = `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`;
  const member2Email = `member2_${paddedIndex}_${Date.now()}@sample.test`;
  const member2Phone = `98763${String(10000 + index).slice(1)}`;
  const member2StudentId = `REG2026M2${paddedIndex}`;

  return {
    teamName: teamName,
    track: getRandomItem(tracks),
    problemStatement: "Building an automated smart mobile application for community impact based on UN Sustainable Development Goals.",
    technologyStack: getRandomItem(techStacks),
    leader: {
      fullName: leaderName,
      email: leaderEmail,
      phone: leaderPhone,
      collegeName: "Sathyabama Institute of Science and Technology",
      department: getRandomItem(departments),
      year: Math.floor(Math.random() * 4) + 1,
      studentId: leaderStudentId
    },
    members: [
      {
        fullName: member1Name,
        email: member1Email,
        phone: member1Phone,
        collegeName: "Sathyabama Institute of Science and Technology",
        department: getRandomItem(departments),
        year: Math.floor(Math.random() * 4) + 1,
        studentId: member1StudentId
      },
      {
        fullName: member2Name,
        email: member2Email,
        phone: member2Phone,
        collegeName: "Sathyabama Institute of Science and Technology",
        department: getRandomItem(departments),
        year: Math.floor(Math.random() * 4) + 1,
        studentId: member2StudentId
      }
    ]
  };
}

function sendRequest(apiUrl, payload) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(apiUrl);
    const postData = JSON.stringify(payload);

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const reqDriver = urlObj.protocol === 'https:' ? https : http;

    const req = reqDriver.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(parsed.error || `HTTP ${res.statusCode}: ${body}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(postData);
    req.end();
  });
}

async function runTestRegistrations() {
  console.log("🚀 Starting 100 Sample Registrations Test...\n");

  // Determine target API endpoint
  let targetUrl = LIVE_API_URL;
  try {
    const testPayload = makeRegistrationPayload(0);
    console.log(`Checking target backend connection at: ${targetUrl}`);
    await sendRequest(targetUrl, testPayload);
    console.log("✅ Live Render Backend connection verified!\n");
  } catch (err) {
    console.log(`⚠️ Live Render API returned or unavailable (${err.message}). Trying Local Backend...`);
    targetUrl = LOCAL_API_URL;
  }

  let successCount = 0;
  let failCount = 0;
  const createdRegIds = [];

  for (let i = 1; i <= 100; i++) {
    const payload = makeRegistrationPayload(i);
    try {
      const res = await sendRequest(targetUrl, payload);
      successCount++;
      createdRegIds.push(res.registrationId);
      console.log(`[${String(i).padStart(3, '0')}/100] ✅ Registered: ${payload.teamName} -> Reg ID: ${res.registrationId}`);
    } catch (err) {
      failCount++;
      console.error(`[${String(i).padStart(3, '0')}/100] ❌ Failed: ${payload.teamName} -> ${err.message}`);
    }

    // Brief delay between requests
    await new Promise(r => setTimeout(r, 120));
  }

  console.log("\n================================================");
  console.log("📊 100 SAMPLE REGISTRATION TEST SUMMARY");
  console.log("================================================");
  console.log(`Total Requests Sent : 100`);
  console.log(`Successful Signups : ${successCount}`);
  console.log(`Failed Signups     : ${failCount}`);
  if (createdRegIds.length > 0) {
    console.log(`First Generated ID : ${createdRegIds[0]}`);
    console.log(`Last Generated ID  : ${createdRegIds[createdRegIds.length - 1]}`);
  }
  console.log("================================================\n");
}

runTestRegistrations();
