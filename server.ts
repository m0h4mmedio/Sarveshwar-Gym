import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { initialData } from './src/data/defaultData';
import { AppData, MembershipPlan, Facility, GalleryItem, Lead, SiteContent } from './src/types';

const app = express();
const PORT = process.env.PORT || 3000;
const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DB_DIR, 'sarveshwar_db.json');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Load or initialize DB
function loadDB(): AppData {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading DB file, re-initializing with defaults', err);
  }
  saveDB(initialData);
  return initialData;
}

function saveDB(data: AppData) {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Failed to save DB file', err);
  }
}

let db: AppData = loadDB();

app.use(express.json());

// Token secret and active sessions map
const AUTH_SECRET = process.env.ADMIN_SECRET || 'sarveshwar-super-secret-key-mumbai-2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sarveshwar365';
const activeTokens = new Set<string>();

// Helper to authenticate requests
function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: missing authorization token' });
    return;
  }
  const token = authHeader.substring(7);
  if (!activeTokens.has(token)) {
    res.status(403).json({ error: 'Forbidden: invalid or expired session token' });
    return;
  }
  next();
}

// --- Public Endpoints ---

// 1. Get public website content
app.get('/api/content', (_req: Request, res: Response) => {
  res.json({
    memberships: db.memberships.filter(m => m.active),
    facilities: db.facilities.filter(f => f.active),
    gallery: db.gallery.filter(g => g.active),
    content: db.content,
    lastPriceUpdate: db.lastPriceUpdate,
  });
});

// 2. Submit lead / enquiry
app.post('/api/leads', (req: Request, res: Response) => {
  const { name, phone, planId, planTitle, planType, goal, notes } = req.body;
  
  if (!name || !phone) {
    res.status(400).json({ error: 'Name and phone number are required' });
    return;
  }

  // Basic phone validation (allowing digits, optional +91, spaces)
  const cleanedPhone = phone.replace(/[^0-9]/g, '');
  if (cleanedPhone.length < 8) {
    res.status(400).json({ error: 'Please enter a valid phone number' });
    return;
  }

  const newLead: Lead = {
    id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: name.trim(),
    phone: phone.trim(),
    planId: planId || undefined,
    planTitle: planTitle || undefined,
    planType: planType === 'cardio' || planType === 'nonCardio' ? planType : undefined,
    goal: goal ? String(goal).trim() : undefined,
    notes: notes ? String(notes).trim() : undefined,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  db.leads.unshift(newLead);
  saveDB(db);

  res.status(201).json({ success: true, lead: newLead });
});

// --- Auth Endpoints ---

// Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Incorrect administrative password' });
    return;
  }

  const token = crypto.randomBytes(32).toString('hex');
  activeTokens.add(token);
  res.json({ success: true, token, expiresAt: Date.now() + 86400000 });
});

// Verify token
app.get('/api/auth/verify', requireAuth, (_req: Request, res: Response) => {
  res.json({ valid: true, authenticated: true });
});

// Logout
app.post('/api/auth/logout', requireAuth, (req: Request, res: Response) => {
  const token = req.headers.authorization?.substring(7);
  if (token) activeTokens.delete(token);
  res.json({ success: true });
});

// --- Admin Endpoints (Protected) ---

// Get all data for admin
app.get('/api/admin/all', requireAuth, (_req: Request, res: Response) => {
  res.json({
    memberships: db.memberships,
    facilities: db.facilities,
    gallery: db.gallery,
    content: db.content,
    leads: db.leads,
    lastPriceUpdate: db.lastPriceUpdate,
    totalLeads: db.leads.length,
    activePlans: db.memberships.filter(m => m.active).length,
  });
});

// Update membership pricing and configurations
app.put('/api/admin/memberships', requireAuth, (req: Request, res: Response) => {
  const { memberships } = req.body;
  if (!Array.isArray(memberships)) {
    res.status(400).json({ error: 'Invalid payload: memberships must be an array' });
    return;
  }

  // Validate prices
  for (const plan of memberships) {
    if (typeof plan.cardioPrice !== 'number' || plan.cardioPrice < 0 || isNaN(plan.cardioPrice)) {
      res.status(400).json({ error: `Invalid cardio price for plan ${plan.duration || plan.id}. Price cannot be negative.` });
      return;
    }
    if (typeof plan.nonCardioPrice !== 'number' || plan.nonCardioPrice < 0 || isNaN(plan.nonCardioPrice)) {
      res.status(400).json({ error: `Invalid non-cardio price for plan ${plan.duration || plan.id}. Price cannot be negative.` });
      return;
    }
  }

  db.memberships = memberships;
  db.lastPriceUpdate = new Date().toISOString();
  saveDB(db);

  res.json({
    success: true,
    message: 'Membership pricing updated successfully.',
    memberships: db.memberships,
    lastPriceUpdate: db.lastPriceUpdate,
  });
});

// Update facilities
app.put('/api/admin/facilities', requireAuth, (req: Request, res: Response) => {
  const { facilities } = req.body;
  if (!Array.isArray(facilities)) {
    res.status(400).json({ error: 'Invalid payload: facilities must be an array' });
    return;
  }

  db.facilities = facilities;
  saveDB(db);

  res.json({
    success: true,
    message: 'Facilities updated successfully.',
    facilities: db.facilities,
  });
});

// Update website content
app.put('/api/admin/content', requireAuth, (req: Request, res: Response) => {
  const { content } = req.body;
  if (!content || typeof content !== 'object') {
    res.status(400).json({ error: 'Invalid payload: content object required' });
    return;
  }

  db.content = { ...db.content, ...content };
  saveDB(db);

  res.json({
    success: true,
    message: 'Website content updated successfully.',
    content: db.content,
  });
});

// Update gallery
app.put('/api/admin/gallery', requireAuth, (req: Request, res: Response) => {
  const { gallery } = req.body;
  if (!Array.isArray(gallery)) {
    res.status(400).json({ error: 'Invalid payload: gallery must be an array' });
    return;
  }

  db.gallery = gallery;
  saveDB(db);

  res.json({
    success: true,
    message: 'Gallery updated successfully.',
    gallery: db.gallery,
  });
});

// Get leads
app.get('/api/admin/leads', requireAuth, (_req: Request, res: Response) => {
  res.json({ leads: db.leads });
});

// Update lead status
app.patch('/api/admin/leads/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const lead = db.leads.find(l => l.id === id);
  if (!lead) {
    res.status(404).json({ error: 'Lead not found' });
    return;
  }

  if (status && ['new', 'contacted', 'enrolled'].includes(status)) {
    lead.status = status;
  }
  if (notes !== undefined) {
    lead.notes = String(notes);
  }

  saveDB(db);
  res.json({ success: true, lead });
});

// Delete lead
app.delete('/api/admin/leads/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  db.leads = db.leads.filter(l => l.id !== id);
  saveDB(db);
  res.json({ success: true, message: 'Lead deleted' });
});

// Reset database to default
app.post('/api/admin/reset', requireAuth, (_req: Request, res: Response) => {
  db = JSON.parse(JSON.stringify(initialData));
  db.lastPriceUpdate = new Date().toISOString();
  saveDB(db);
  res.json({ success: true, message: 'Reset to initial factory data complete', data: db });
});

// --- Server & Vite Mounting ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`> Sarveshwar Fitness server running on http://localhost:${PORT}`);
  });
}

startServer();
