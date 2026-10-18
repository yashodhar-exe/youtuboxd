const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.resolve(__dirname, 'src/database/database.db');
const db = new Database(dbPath, { verbose: console.log });

async function seedUser() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('youtuboxd', salt);

    const stmt = db.prepare('INSERT OR IGNORE INTO users (username, email, password) VALUES (?, ?, ?)');
    stmt.run('yashodhar.exe', 'yashodhar@example.com', hashedPassword);
    console.log('User yashodhar.exe created successfully with password youtuboxd');
  } catch (err) {
    console.error('Error seeding user:', err);
  } finally {
    db.close();
  }
}

seedUser();
