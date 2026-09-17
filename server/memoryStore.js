import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data', 'memories.json');

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

export function getAllMemories() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const list = JSON.parse(raw || '[]');
    // Sort by created_at desc or memory_date desc
    return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  } catch (error) {
    console.error('[MemoryStore] Error reading memories:', error);
    return [];
  }
}

export function addMemory(record) {
  ensureDataFile();
  const list = getAllMemories();
  const newMemory = {
    id: record.id,
    type: record.type || 'photo',
    object_key: record.object_key,
    thumbnail_key: record.thumbnail_key,
    title: record.title || '',
    description: record.description || '',
    memory_date: record.memory_date || '',
    mime_type: record.mime_type || '',
    file_size: record.file_size || 0,
    width: record.width || 0,
    height: record.height || 0,
    duration: record.duration || 0,
    created_at: record.created_at || new Date().toISOString()
  };

  list.unshift(newMemory);
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
  return newMemory;
}

export function getMemoryById(id) {
  const list = getAllMemories();
  return list.find(m => m.id === id) || null;
}

export function deleteMemory(id) {
  ensureDataFile();
  const list = getAllMemories();
  const index = list.findIndex(m => m.id === id);
  if (index !== -1) {
    const removed = list.splice(index, 1)[0];
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return removed;
  }
  return null;
}
