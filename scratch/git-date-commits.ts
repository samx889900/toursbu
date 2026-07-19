import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

function run(cmd: string) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { encoding: 'utf-8' }).trim();
}

const gitStatus = run('git -c color.status=false status --porcelain');
if (!gitStatus) {
  console.log('No changes to commit.');
  process.exit(0);
}

const files = gitStatus.split('\n').filter(Boolean).map(line => {
  // Strip ANSI color codes just in case
  const cleanLine = line.replace(/\x1B\[\d+m/g, '');
  // Match the first two characters as status, then a space, then the path
  const match = cleanLine.match(/^.{2}\s+(.+)$/);
  if (!match) return cleanLine.trim().split(/\s+/).pop() || '';
  
  let file = match[1];
  if (file.startsWith('"') && file.endsWith('"')) {
    file = file.slice(1, -1);
  }
  const actualFile = file.includes(' -> ') ? file.split(' -> ')[1] : file;
  return actualFile;
}).filter(Boolean);

const dateGroups: Record<string, string[]> = {};

for (const file of files) {
  if (!fs.existsSync(file)) {
    // File might be deleted
    console.log(`File deleted, grouping with today: ${file}`);
    const today = new Date().toISOString().split('T')[0];
    if (!dateGroups[today]) dateGroups[today] = [];
    dateGroups[today].push(file);
    continue;
  }
  
  const stats = fs.statSync(file);
  const mtime = stats.mtime;
  const dateStr = mtime.toISOString().split('T')[0]; // YYYY-MM-DD
  
  if (!dateGroups[dateStr]) {
    dateGroups[dateStr] = [];
  }
  dateGroups[dateStr].push(file);
}

// Ensure sorting by date ascending so we commit older changes first
const sortedDates = Object.keys(dateGroups).sort();

for (const date of sortedDates) {
  console.log(`\nProcessing date: ${date}`);
  const groupFiles = dateGroups[date];
  
  for (const file of groupFiles) {
    run(`git add "${file}"`);
  }
  
  const isoDate = `${date}T12:00:00Z`;
  
  try {
    run(`git -c user.name="Vikram" -c user.email="vikrammadhad@gmail.com" commit -m "Updates on ${date}" --date="${isoDate}"`);
  } catch (e: any) {
    console.log(`Failed to commit for ${date}, might be empty:`, e.message);
  }
}

console.log('\nPushing to origin...');
try {
  run('git push');
  console.log('Successfully pushed!');
} catch (e: any) {
  console.log('Failed to push:', e.message);
}
