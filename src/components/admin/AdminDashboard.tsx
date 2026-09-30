import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Lock,
  LogOut,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Layers,
  FileText,
  Image as ImageIcon,
  Users,
  MessageSquare,
  Phone,
  Trash2,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Calendar,
  Clock,
  ArrowUpRight,
  QrCode,
  Printer,
} from 'lucide-react';
import { MembershipPlan, Facility, GalleryItem, SiteContent, Lead } from '../../types';
import { api } from '../../utils/api';
import { formatINR, getWhatsAppUrl } from '../../utils/whatsapp';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onDataUpdated: () => void;
}

type TabType = 'pricing' | 'leads' | 'overview' | 'facilities' | 'content' | 'gallery' | 'standee';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onDataUpdated,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('pricing');

  // Loaded admin state
  const [memberships, setMemberships] = useState<MembershipPlan[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [lastPriceUpdate, setLastPriceUpdate] = useState<string>('');

  // Status feedback
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [saveErrorMsg, setSaveErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Search/Filter leads
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<'all' | 'new' | 'contacted' | 'enrolled'>('all');

  // Add lead modal
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    phone: '',
    planTitle: '6 Months (Cardio Included)',
    goal: 'Hypertrophy / Muscle Building',
    notes: 'Walk-in or phone enquiry',
  });

  // Load all admin data
  const loadAdminData = useCallback(async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const data = await api.getAdminAll();
      setMemberships(data.memberships);
      setFacilities(data.facilities);
      setGallery(data.gallery);
      setContent(data.content);
      setLeads(data.leads || []);
      setLastPriceUpdate(data.lastPriceUpdate);
    } catch (err: any) {
      if (!silent) console.error('Failed to load admin data', err);
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  }, []);

  // Check auth on open
  useEffect(() => {
    if (!isOpen) return;
    const checkAuth = async () => {
      setIsLoading(true);
      const valid = await api.verifyAuth();
      if (valid) {
        setIsAuthenticated(true);
        await loadAdminData();
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [isOpen, loadAdminData]);

  // Live real-time polling every 5 seconds when admin modal is open and authenticated
  useEffect(() => {
    if (!isOpen || !isAuthenticated) return;
    const interval = setInterval(() => {
      loadAdminData(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [isOpen, isAuthenticated, loadAdminData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    try {
      await api.login(password);
      setIsAuthenticated(true);
      setPassword('');
      await loadAdminData();
    } catch (err: any) {
      setLoginError(err.message || 'Incorrect administrative password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${api.getToken()}` },
      });
    } catch (e) {
      // ignore
    }
    api.clearToken();
    setIsAuthenticated(false);
  };

  const showNotification = (success: boolean, msg: string) => {
    if (success) {
      setSaveSuccessMsg(msg);
      setSaveErrorMsg('');
      setTimeout(() => setSaveSuccessMsg(''), 4500);
    } else {
      setSaveErrorMsg(msg);
      setSaveSuccessMsg('');
    }
  };

  // --- Save Handlers ---
  const handleSaveMemberships = async () => {
    for (const plan of memberships) {
      if (plan.cardioPrice < 0 || isNaN(plan.cardioPrice)) {
        showNotification(false, `Price for ${plan.duration} With Cardio cannot be negative.`);
        return;
      }
      if (plan.nonCardioPrice < 0 || isNaN(plan.nonCardioPrice)) {
        showNotification(false, `Price for ${plan.duration} Without Cardio cannot be negative.`);
        return;
      }
    }

    setIsSaving(true);
    try {
      const res = await api.updateMemberships(memberships);
      setLastPriceUpdate(res.lastPriceUpdate);
      showNotification(true, '✓ Membership pricing updated successfully & live on website.');
      onDataUpdated();
    } catch (err: any) {
      showNotification(false, err.message || 'Failed to save membership pricing');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveFacilities = async () => {
    setIsSaving(true);
    try {
      await api.updateFacilities(facilities);
      showNotification(true, '✓ Facilities updated successfully.');
      onDataUpdated();
    } catch (err: any) {
      showNotification(false, err.message || 'Failed to save facilities');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveContent = async () => {
    if (!content) return;
    setIsSaving(true);
    try {
      await api.updateContent(content);
      showNotification(true, '✓ Website content & contact info updated successfully.');
      onDataUpdated();
    } catch (err: any) {
      showNotification(false, err.message || 'Failed to save website content');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLeadStatusChange = async (id: string, newStatus: Lead['status']) => {
    try {
      await api.updateLeadStatus(id, newStatus);
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
      );
      showNotification(true, `Lead marked as ${newStatus.toUpperCase()}`);
    } catch (err: any) {
      showNotification(false, 'Failed to update lead status.');
    }
  };

  const handleSaveLeadNote = async (id: string, notes: string) => {
    try {
      const lead = leads.find((l) => l.id === id);
      await api.updateLeadStatus(id, lead?.status || 'new', notes);
      showNotification(true, 'Notes saved.');
    } catch (err: any) {
      showNotification(false, 'Failed to save notes.');
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry record?')) return;
    try {
      await api.deleteLead(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
      showNotification(true, 'Enquiry record removed.');
    } catch (err: any) {
      showNotification(false, 'Failed to delete enquiry.');
    }
  };

  const handleCreateTestLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name || !newLeadForm.phone) {
      alert('Please enter name and phone number.');
      return;
    }
    try {
      const res = await api.submitLead({
        name: newLeadForm.name,
        phone: newLeadForm.phone,
        goal: newLeadForm.goal,
        notes: `${newLeadForm.planTitle} · ${newLeadForm.notes}`,
      });
      setLeads((prev) => [res.lead, ...prev]);
      setShowAddLeadModal(false);
      setNewLeadForm({
        name: '',
        phone: '',
        planTitle: '6 Months (Cardio Included)',
        goal: 'Hypertrophy / Muscle Building',
        notes: 'Walk-in or phone enquiry',
      });
      showNotification(true, '✓ New enquiry logged successfully!');
      onDataUpdated();
    } catch (err: any) {
      alert(err.message || 'Failed to create lead');
    }
  };

  const handleResetFactory = async () => {
    if (!confirm('Reset all pricing and website configurations to initial factory defaults?')) return;
    setIsSaving(true);
    try {
      const res = await api.resetData();
      setMemberships(res.data.memberships);
      setFacilities(res.data.facilities);
      setGallery(res.data.gallery);
      setContent(res.data.content);
      setLeads(res.data.leads);
      setLastPriceUpdate(res.data.lastPriceUpdate);
      showNotification(true, 'Restored initial factory data successfully.');
      onDataUpdated();
    } catch (err: any) {
      showNotification(false, 'Failed to reset data.');
    } finally {
      setIsSaving(false);
    }
  };

  const newLeadsCount = leads.filter((l) => l.status === 'new').length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#040605]/95 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="w-full max-w-7xl bg-[#090e0b] border-2 border-[#26382b] shadow-2xl my-auto min-h-[85vh] max-h-[96vh] flex flex-col overflow-hidden rounded-sm">
        
        {/* TOP HEADER BAR */}
        <div className="px-4 sm:px-8 py-4 bg-[#0f1712] border-b border-[#26382b] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded bg-[#18261e] border border-[#3b5440] flex items-center justify-center text-[#c5a869] shadow-inner shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-['Syne'] font-extrabold text-lg sm:text-xl tracking-wider text-white uppercase">
                  Sarveshwar Fitness
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold bg-[#c5a869] text-[#070908] uppercase tracking-wider">
                  Admin Console
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#95a397] font-medium mt-0.5">
                <span className="inline-block w-2 h-2 rounded-full bg-[#25d366] animate-pulse" />
                <span>Live Database · Instant Website Synchronization</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isAuthenticated && (
              <>
                <button
                  onClick={() => loadAdminData()}
                  disabled={isRefreshing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#18261e] hover:bg-[#22362a] border border-[#2b4231] transition-colors"
                  title="Refresh data from server"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#c5a869]' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-300 hover:text-white bg-red-950/40 hover:bg-red-900/60 border border-red-900/60 transition-colors"
                  title="Log out of admin session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white bg-[#18261e] hover:bg-[#25392d] border border-[#2b4231] transition-colors"
              aria-label="Close Admin Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NOT AUTHENTICATED: LOGIN VIEW */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-16 max-w-md mx-auto w-full text-center my-auto">
            <div className="w-14 h-14 bg-[#142018] border border-[#2b4231] text-[#c5a869] flex items-center justify-center mx-auto mb-5 shadow-lg">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="font-['Syne'] font-extrabold text-2xl uppercase text-white mb-2">
              Staff Portal Access
            </h3>
            <p className="text-sm text-[#95a397] mb-8 leading-relaxed">
              Authenticate with the administrative security key to update membership fees, track lead enquiries, and modify gym details.
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              {loginError && (
                <div className="p-3.5 bg-red-950/80 border border-red-700 text-xs text-red-200 text-left font-medium">
                  {loginError}
                </div>
              )}

              <div className="text-left space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                  Administrator Password
                </label>
                <input
                  type="password"
                  autoFocus
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password..."
                  className="w-full px-4 py-3 bg-[#050706] border-2 border-[#2b4231] focus:border-[#c5a869] text-base text-white outline-none rounded-none font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 text-xs font-bold uppercase tracking-widest text-[#070908] bg-[#c5a869] hover:bg-[#dfc993] transition-colors border border-[#c5a869] disabled:opacity-50 shadow-md font-['Syne']"
              >
                {isLoading ? 'Verifying Credentials...' : 'Unlock Management Console'}
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED CONSOLE VIEW */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* MAIN TAB STRIP */}
            <div className="px-4 sm:px-8 bg-[#0c130f] border-b border-[#26382b] flex items-center justify-between overflow-x-auto shrink-0">
              <div className="flex space-x-1 sm:space-x-3 py-2.5">
                
                {/* 1. PRICING & MEMBERSHIPS TAB */}
                <button
                  onClick={() => setActiveTab('pricing')}
                  className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all ${
                    activeTab === 'pricing'
                      ? 'bg-[#18281e] text-[#c5a869] border-b-2 border-[#c5a869] shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-[#121c16]'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Membership Pricing</span>
                  <span className="px-1.5 py-0.2 bg-[#090e0b] border border-[#26382b] text-[10px] font-mono text-[#c5a869]">
                    4 Plans
                  </span>
                </button>

                {/* 2. LEADS & ENQUIRIES TAB (Prominently Badged) */}
                <button
                  onClick={() => setActiveTab('leads')}
                  className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all ${
                    activeTab === 'leads'
                      ? 'bg-[#18281e] text-[#c5a869] border-b-2 border-[#c5a869] shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-[#121c16]'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Prospect Enquiries</span>
                  {newLeadsCount > 0 ? (
                    <span className="px-2 py-0.5 bg-[#f59e0b] text-[#070908] text-[10px] font-mono font-bold rounded-full animate-bounce">
                      {newLeadsCount} NEW
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 bg-[#090e0b] border border-[#26382b] text-[10px] font-mono text-slate-300">
                      {leads.length}
                    </span>
                  )}
                </button>

                {/* 3. FACILITIES TAB */}
                <button
                  onClick={() => setActiveTab('facilities')}
                  className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all ${
                    activeTab === 'facilities'
                      ? 'bg-[#18281e] text-[#c5a869] border-b-2 border-[#c5a869]'
                      : 'text-slate-300 hover:text-white hover:bg-[#121c16]'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Facilities ({facilities.length})</span>
                </button>

                {/* 4. CONTENT & CONTACT */}
                <button
                  onClick={() => setActiveTab('content')}
                  className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all ${
                    activeTab === 'content'
                      ? 'bg-[#18281e] text-[#c5a869] border-b-2 border-[#c5a869]'
                      : 'text-slate-300 hover:text-white hover:bg-[#121c16]'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Website Info & Timings</span>
                </button>

                {/* 5. OVERVIEW */}
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all ${
                    activeTab === 'overview'
                      ? 'bg-[#18281e] text-[#c5a869] border-b-2 border-[#c5a869]'
                      : 'text-slate-300 hover:text-white hover:bg-[#121c16]'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Overview</span>
                </button>

                {/* 6. RECEPTION QR STANDEE */}
                <button
                  onClick={() => setActiveTab('standee')}
                  className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all ${
                    activeTab === 'standee'
                      ? 'bg-[#18281e] text-[#c5a869] border-b-2 border-[#c5a869]'
                      : 'text-slate-300 hover:text-white hover:bg-[#121c16]'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>Front Desk Standee</span>
                </button>
              </div>

              <button
                onClick={handleResetFactory}
                disabled={isSaving}
                className="hidden md:inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white px-3 py-1.5 bg-[#142018] border border-[#2b4231] transition-colors"
                title="Reset to initial factory data"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Factory Defaults</span>
              </button>
            </div>

            {/* NOTIFICATION TOAST BAR */}
            {saveSuccessMsg && (
              <div className="bg-[#102e1c] border-b border-[#25d366]/40 px-6 py-3 flex items-center gap-3 text-sm text-[#25d366] font-semibold animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}
            {saveErrorMsg && (
              <div className="bg-red-950/90 border-b border-red-700 px-6 py-3 flex items-center gap-3 text-sm text-red-200 font-semibold animate-fadeIn">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>{saveErrorMsg}</span>
              </div>
            )}

            {/* SCROLLABLE MAIN CONTENT BODY */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 bg-[#080d0a]">
              
              {/* ============================================================== */}
              {/* TAB 1: MEMBERSHIP PRICING (SPACIOUS, HIGH-VISIBILITY CARDS)    */}
              {/* ============================================================== */}
              {activeTab === 'pricing' && (
                <div className="space-y-6">
                  
                  {/* Sticky Control Header for Pricing */}
                  <div className="bg-[#121c16] border-2 border-[#2d4533] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-[#c5a869] font-bold uppercase tracking-wider mb-1">
                        <span>Centralized Pricing Studio</span>
                        <span>·</span>
                        <span>INR (₹) Rates</span>
                      </div>
                      <h3 className="font-['Syne'] font-extrabold text-xl sm:text-2xl uppercase text-white">
                        Edit Membership Rates & Durations
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                        Adjust without-cardio and with-cardio prices below. Click <strong className="text-[#c5a869]">"SAVE ALL PRICING CHANGES"</strong> to immediately publish updates to the live website.
                      </p>
                    </div>

                    <button
                      onClick={handleSaveMemberships}
                      disabled={isSaving}
                      className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-[#c5a869] hover:bg-[#dfc993] text-[#070908] text-sm font-extrabold uppercase tracking-widest transition-all border border-[#c5a869] shadow-xl disabled:opacity-50 font-['Syne'] shrink-0 active:translate-y-px"
                    >
                      <Save className="w-5 h-5" />
                      <span>{isSaving ? 'Publishing Changes...' : 'Save All Pricing Changes'}</span>
                    </button>
                  </div>

                  {/* 4 Spacious, High-Contrast Pricing Cards */}
                  <div className="grid grid-cols-1 gap-6">
                    {memberships.map((plan, idx) => (
                      <div
                        key={plan.id}
                        className={`p-6 sm:p-8 border-2 transition-all ${
                          plan.isPopular
                            ? 'border-[#c5a869] bg-[#101a13] shadow-lg shadow-[#c5a869]/5'
                            : 'border-[#26382b] bg-[#0c140f] hover:border-[#3d5a44]'
                        }`}
                      >
                        {/* Plan Header Row */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#223326]">
                          <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded bg-[#18261e] border border-[#2d4533] flex items-center justify-center text-sm font-bold text-[#c5a869] font-mono">
                              0{idx + 1}
                            </span>
                            <div>
                              <h4 className="font-['Syne'] font-extrabold text-2xl text-white uppercase tracking-wide">
                                {plan.duration} Plan
                              </h4>
                              <span className="text-xs text-[#95a397] font-mono">
                                ID: {plan.id}
                              </span>
                            </div>
                          </div>

                          {/* Quick Controls: Active, Popular, Badge */}
                          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                            
                            {/* Promotional Badge Input */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono uppercase text-slate-300 font-bold whitespace-nowrap">
                                Badge Tag:
                              </span>
                              <input
                                type="text"
                                value={plan.badge || ''}
                                placeholder="e.g. MEMBER FAVOURITE"
                                onChange={(e) => {
                                  const updated = [...memberships];
                                  updated[idx].badge = e.target.value;
                                  setMemberships(updated);
                                }}
                                className="px-3 py-1.5 bg-[#050806] border border-[#2d4533] focus:border-[#c5a869] text-xs font-bold text-white outline-none w-44 font-mono"
                              />
                            </div>

                            {/* Popular Toggle */}
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-200 cursor-pointer bg-[#142018] px-3 py-2 border border-[#2d4533] select-none">
                              <input
                                type="checkbox"
                                checked={!!plan.isPopular}
                                onChange={(e) => {
                                  const updated = [...memberships];
                                  updated[idx].isPopular = e.target.checked;
                                  setMemberships(updated);
                                }}
                                className="w-4 h-4 accent-[#c5a869] cursor-pointer"
                              />
                              <span>Featured Plan</span>
                            </label>

                            {/* Active Toggle */}
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-200 cursor-pointer bg-[#142018] px-3 py-2 border border-[#2d4533] select-none">
                              <input
                                type="checkbox"
                                checked={plan.active}
                                onChange={(e) => {
                                  const updated = [...memberships];
                                  updated[idx].active = e.target.checked;
                                  setMemberships(updated);
                                }}
                                className="w-4 h-4 accent-[#25d366] cursor-pointer"
                              />
                              <span>{plan.active ? 'Visible on Site' : 'Hidden'}</span>
                            </label>

                          </div>
                        </div>

                        {/* Two Big Side-by-Side Price Blocks */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                          
                          {/* BOX 1: WITHOUT CARDIO */}
                          <div className="p-5 bg-[#080d0a] border-2 border-[#2b4231] space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                                1. Without Cardio (Strength Only)
                              </span>
                              <span className="text-sm font-bold text-white font-mono">
                                Live: {formatINR(plan.nonCardioPrice)}
                              </span>
                            </div>

                            <div className="relative">
                              <span className="absolute left-4 top-3 text-lg font-mono font-bold text-slate-400">
                                ₹
                              </span>
                              <input
                                type="number"
                                min="0"
                                step="50"
                                value={plan.nonCardioPrice}
                                onChange={(e) => {
                                  const val = Math.max(0, parseInt(e.target.value) || 0);
                                  const updated = [...memberships];
                                  updated[idx].nonCardioPrice = val;
                                  setMemberships(updated);
                                }}
                                className="w-full pl-9 pr-4 py-3 bg-[#0f1712] border-2 border-[#36523d] focus:border-emerald-400 text-2xl font-mono font-bold text-white outline-none rounded-none shadow-inner"
                              />
                            </div>

                            {/* Quick Step Buttons for Fast Editing */}
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-[11px] font-mono text-[#95a397] uppercase">Adjust:</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...memberships];
                                  updated[idx].nonCardioPrice = Math.max(0, updated[idx].nonCardioPrice - 100);
                                  setMemberships(updated);
                                }}
                                className="px-2.5 py-1 text-xs font-mono font-semibold text-slate-300 bg-[#16231a] hover:bg-[#1f3325] border border-[#2b4231]"
                              >
                                -₹100
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...memberships];
                                  updated[idx].nonCardioPrice = updated[idx].nonCardioPrice + 100;
                                  setMemberships(updated);
                                }}
                                className="px-2.5 py-1 text-xs font-mono font-semibold text-slate-300 bg-[#16231a] hover:bg-[#1f3325] border border-[#2b4231]"
                              >
                                +₹100
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...memberships];
                                  updated[idx].nonCardioPrice = updated[idx].nonCardioPrice + 500;
                                  setMemberships(updated);
                                }}
                                className="px-2.5 py-1 text-xs font-mono font-semibold text-slate-300 bg-[#16231a] hover:bg-[#1f3325] border border-[#2b4231]"
                              >
                                +₹500
                              </button>
                            </div>
                          </div>

                          {/* BOX 2: WITH CARDIO */}
                          <div className="p-5 bg-[#080d0a] border-2 border-[#c5a869]/50 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#c5a869]">
                                2. With Cardio Included (Full Gym)
                              </span>
                              <span className="text-sm font-bold text-[#c5a869] font-mono">
                                Live: {formatINR(plan.cardioPrice)}
                              </span>
                            </div>

                            <div className="relative">
                              <span className="absolute left-4 top-3 text-lg font-mono font-bold text-[#c5a869]">
                                ₹
                              </span>
                              <input
                                type="number"
                                min="0"
                                step="50"
                                value={plan.cardioPrice}
                                onChange={(e) => {
                                  const val = Math.max(0, parseInt(e.target.value) || 0);
                                  const updated = [...memberships];
                                  updated[idx].cardioPrice = val;
                                  setMemberships(updated);
                                }}
                                className="w-full pl-9 pr-4 py-3 bg-[#0f1712] border-2 border-[#c5a869]/70 focus:border-[#dfc993] text-2xl font-mono font-bold text-[#c5a869] outline-none rounded-none shadow-inner"
                              />
                            </div>

                            {/* Quick Step Buttons for Fast Editing */}
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-[11px] font-mono text-[#95a397] uppercase">Adjust:</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...memberships];
                                  updated[idx].cardioPrice = Math.max(0, updated[idx].cardioPrice - 100);
                                  setMemberships(updated);
                                }}
                                className="px-2.5 py-1 text-xs font-mono font-semibold text-slate-300 bg-[#16231a] hover:bg-[#1f3325] border border-[#2b4231]"
                              >
                                -₹100
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...memberships];
                                  updated[idx].cardioPrice = updated[idx].cardioPrice + 100;
                                  setMemberships(updated);
                                }}
                                className="px-2.5 py-1 text-xs font-mono font-semibold text-slate-300 bg-[#16231a] hover:bg-[#1f3325] border border-[#2b4231]"
                              >
                                +₹100
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...memberships];
                                  updated[idx].cardioPrice = updated[idx].cardioPrice + 500;
                                  setMemberships(updated);
                                }}
                                className="px-2.5 py-1 text-xs font-mono font-semibold text-slate-300 bg-[#16231a] hover:bg-[#1f3325] border border-[#2b4231]"
                              >
                                +₹500
                              </button>
                            </div>
                          </div>

                        </div>

                        {/* Features Editor Collapsible */}
                        <div className="mt-6 pt-5 border-t border-[#1d2b20]">
                          <details className="group">
                            <summary className="cursor-pointer text-xs font-mono font-bold uppercase text-[#c5a869] hover:text-white transition-colors flex items-center justify-between">
                              <span>▶ Edit Bullet Points & Facilities Included in {plan.duration}</span>
                              <span className="text-slate-400 font-sans text-xs">Click to expand</span>
                            </summary>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-3 border-t border-[#18261e]">
                              <div>
                                <label className="block text-[11px] font-mono text-slate-300 mb-1.5 uppercase font-bold">
                                  With Cardio Inclusions (1 per line)
                                </label>
                                <textarea
                                  rows={5}
                                  value={plan.cardioFeatures.join('\n')}
                                  onChange={(e) => {
                                    const lines = e.target.value.split('\n').filter(Boolean);
                                    const updated = [...memberships];
                                    updated[idx].cardioFeatures = lines;
                                    setMemberships(updated);
                                  }}
                                  className="w-full p-3 bg-[#050706] border border-[#2b4231] focus:border-[#c5a869] text-xs text-white font-mono leading-relaxed outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-mono text-slate-300 mb-1.5 uppercase font-bold">
                                  Without Cardio Inclusions (1 per line)
                                </label>
                                <textarea
                                  rows={5}
                                  value={plan.nonCardioFeatures.join('\n')}
                                  onChange={(e) => {
                                    const lines = e.target.value.split('\n').filter(Boolean);
                                    const updated = [...memberships];
                                    updated[idx].nonCardioFeatures = lines;
                                    setMemberships(updated);
                                  }}
                                  className="w-full p-3 bg-[#050706] border border-[#2b4231] focus:border-[#c5a869] text-xs text-white font-mono leading-relaxed outline-none"
                                />
                              </div>
                            </div>
                          </details>
                        </div>

                      </div>
                    ))}
                  </div>

                  {/* Bottom Save Bar */}
                  <div className="p-5 bg-[#121c16] border border-[#2d4533] flex items-center justify-between">
                    <span className="text-xs text-slate-300">
                      Prices are saved to disk and updated across all visitor devices.
                    </span>
                    <button
                      onClick={handleSaveMemberships}
                      disabled={isSaving}
                      className="px-6 py-3 bg-[#c5a869] hover:bg-[#dfc993] text-[#070908] text-xs font-bold uppercase tracking-wider transition-colors border border-[#c5a869] font-['Syne']"
                    >
                      Save Pricing Changes
                    </button>
                  </div>

                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 2: PROSPECT ENQUIRIES & LEADS (REALTIME DISPLAY)           */}
              {/* ============================================================== */}
              {activeTab === 'leads' && (
                <div className="space-y-6">
                  
                  {/* Top Bar for Leads */}
                  <div className="bg-[#121c16] border-2 border-[#2d4533] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-[#c5a869] font-bold uppercase tracking-wider mb-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#25d366] animate-pulse" />
                        <span>Live Lead Inbox · Auto-Syncing</span>
                      </div>
                      <h3 className="font-['Syne'] font-extrabold text-xl sm:text-2xl uppercase text-white">
                        Prospective Member Enquiries ({leads.length})
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                        Real-time visitor trial requests & WhatsApp submissions. Direct click to call or chat.
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => loadAdminData()}
                        disabled={isRefreshing}
                        className="inline-flex items-center gap-2 px-4 py-3 bg-[#18261e] hover:bg-[#23382c] text-white text-xs font-bold uppercase tracking-wider border border-[#2d4533] transition-colors"
                      >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#c5a869]' : ''}`} />
                        <span>Sync Now</span>
                      </button>

                      <button
                        onClick={() => setShowAddLeadModal(true)}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-[#c5a869] hover:bg-[#dfc993] text-[#070908] text-xs font-bold uppercase tracking-widest transition-colors font-['Syne']"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Log Walk-in Lead</span>
                      </button>
                    </div>
                  </div>

                  {/* Filter & Search Controls */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0c140f] p-3.5 border border-[#26382b]">
                    
                    {/* Status Filter Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                      <button
                        onClick={() => setLeadStatusFilter('all')}
                        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                          leadStatusFilter === 'all'
                            ? 'bg-[#c5a869] text-[#070908]'
                            : 'bg-[#142018] text-slate-300 hover:text-white'
                        }`}
                      >
                        All ({leads.length})
                      </button>
                      <button
                        onClick={() => setLeadStatusFilter('new')}
                        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                          leadStatusFilter === 'new'
                            ? 'bg-amber-500 text-[#070908]'
                            : 'bg-[#142018] text-amber-300 hover:text-white'
                        }`}
                      >
                        New ({leads.filter((l) => l.status === 'new').length})
                      </button>
                      <button
                        onClick={() => setLeadStatusFilter('contacted')}
                        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                          leadStatusFilter === 'contacted'
                            ? 'bg-blue-500 text-white'
                            : 'bg-[#142018] text-blue-300 hover:text-white'
                        }`}
                      >
                        Contacted ({leads.filter((l) => l.status === 'contacted').length})
                      </button>
                      <button
                        onClick={() => setLeadStatusFilter('enrolled')}
                        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                          leadStatusFilter === 'enrolled'
                            ? 'bg-emerald-500 text-[#070908]'
                            : 'bg-[#142018] text-emerald-300 hover:text-white'
                        }`}
                      >
                        Enrolled ({leads.filter((l) => l.status === 'enrolled').length})
                      </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative min-w-[240px]">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search name, phone, or goal..."
                        value={leadSearch}
                        onChange={(e) => setLeadSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-[#050806] border border-[#2b4231] focus:border-[#c5a869] text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Leads List / Cards */}
                  <div className="space-y-4">
                    {leads
                      .filter((lead) => {
                        if (leadStatusFilter !== 'all' && lead.status !== leadStatusFilter) return false;
                        if (leadSearch) {
                          const q = leadSearch.toLowerCase();
                          return (
                            lead.name.toLowerCase().includes(q) ||
                            lead.phone.includes(q) ||
                            (lead.goal && lead.goal.toLowerCase().includes(q)) ||
                            (lead.notes && lead.notes.toLowerCase().includes(q))
                          );
                        }
                        return true;
                      })
                      .map((lead) => {
                        const waMsg = `Hi ${lead.name}, this is Sarveshwar Fitness Kurla West! Thank you for your interest in our gym. How can we help you get started?`;
                        const waDirectUrl = getWhatsAppUrl(lead.phone, waMsg);

                        return (
                          <div
                            key={lead.id}
                            className={`p-5 sm:p-6 border-2 transition-all ${
                              lead.status === 'new'
                                ? 'bg-[#111914] border-amber-600/70 shadow-md'
                                : 'bg-[#0c140f] border-[#223326]'
                            }`}
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1f2d22]">
                              
                              {/* Left: Prospect Details */}
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-3">
                                  <h4 className="font-['Syne'] font-extrabold text-xl text-white">
                                    {lead.name}
                                  </h4>
                                  
                                  {/* Status Indicator Badge */}
                                  <span
                                    className={`px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${
                                      lead.status === 'new'
                                        ? 'bg-amber-400 text-black'
                                        : lead.status === 'contacted'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-emerald-400 text-black'
                                    }`}
                                  >
                                    {lead.status.toUpperCase()}
                                  </span>

                                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-[#c5a869]" />
                                    {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                  <a
                                    href={`tel:${lead.phone}`}
                                    className="font-mono text-base font-bold text-[#c5a869] hover:underline flex items-center gap-1.5 bg-[#16231a] px-3 py-1 border border-[#2b4231]"
                                  >
                                    <Phone className="w-3.5 h-3.5 text-[#c5a869]" />
                                    <span>{lead.phone}</span>
                                  </a>

                                  {lead.goal && (
                                    <span className="text-xs text-slate-300 bg-[#16211a] px-3 py-1 border border-[#26382b]">
                                      🎯 {lead.goal}
                                    </span>
                                  )}

                                  {lead.notes && (
                                    <span className="text-xs text-slate-300 bg-[#16211a] px-3 py-1 border border-[#26382b]">
                                      📋 {lead.notes}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Right: Quick Action Controls */}
                              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                                
                                {/* One-Click WhatsApp Button */}
                                <a
                                  href={waDirectUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25d366] hover:bg-[#20ba5a] text-[#070908] text-xs font-extrabold uppercase tracking-wider transition-colors shadow-sm"
                                  title="Chat on WhatsApp"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                  <span>WhatsApp</span>
                                </a>

                                {/* Call Button */}
                                <a
                                  href={`tel:${lead.phone}`}
                                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#18261e] hover:bg-[#23382c] text-white text-xs font-bold uppercase tracking-wider border border-[#2d4533] transition-colors"
                                  title="Call prospect"
                                >
                                  <Phone className="w-4 h-4 text-[#c5a869]" />
                                  <span>Call</span>
                                </a>

                                {/* Status Switcher */}
                                <select
                                  value={lead.status}
                                  onChange={(e) => handleLeadStatusChange(lead.id, e.target.value as any)}
                                  className="px-3 py-2.5 bg-[#050806] border border-[#2d4533] text-xs font-bold uppercase tracking-wider text-white outline-none cursor-pointer"
                                >
                                  <option value="new">Status: NEW</option>
                                  <option value="contacted">Status: CONTACTED</option>
                                  <option value="enrolled">Status: ENROLLED</option>
                                </select>

                                {/* Delete button */}
                                <button
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className="p-2.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-900/60 transition-colors"
                                  title="Delete enquiry record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                            </div>
                          </div>
                        );
                      })}

                    {leads.length === 0 && (
                      <div className="p-12 text-center border-2 border-dashed border-[#26382b] bg-[#0c140f] space-y-3">
                        <Users className="w-12 h-12 text-slate-500 mx-auto" />
                        <h4 className="font-['Syne'] font-bold text-lg text-white uppercase">
                          No Enquiries Logged Yet
                        </h4>
                        <p className="text-xs text-slate-400 max-w-md mx-auto">
                          When prospective members fill out the contact or trial forms on the website, their details appear here in real-time.
                        </p>
                        <button
                          onClick={() => setShowAddLeadModal(true)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c5a869] text-[#070908] text-xs font-bold uppercase tracking-wider mt-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add a Test Enquiry</span>
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 3: FACILITIES MANAGEMENT                                   */}
              {/* ============================================================== */}
              {activeTab === 'facilities' && (
                <div className="space-y-6">
                  <div className="bg-[#121c16] border-2 border-[#2d4533] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-['Syne'] font-extrabold text-xl sm:text-2xl uppercase text-white">
                        Gym Equipment & Floor Facilities
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1">
                        Edit titles, descriptions, categories, and visibility for facilities in Section 02.
                      </p>
                    </div>

                    <button
                      onClick={handleSaveFacilities}
                      disabled={isSaving}
                      className="px-6 py-3 bg-[#c5a869] hover:bg-[#dfc993] text-[#070908] text-xs font-bold uppercase tracking-wider transition-colors border border-[#c5a869] font-['Syne']"
                    >
                      Save Facilities
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {facilities.map((fac, idx) => (
                      <div key={fac.id} className="p-5 bg-[#0c140f] border-2 border-[#26382b] space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-[#c5a869] uppercase">
                            Facility #{idx + 1}
                          </span>
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={fac.active}
                              onChange={(e) => {
                                const updated = [...facilities];
                                updated[idx].active = e.target.checked;
                                setFacilities(updated);
                              }}
                              className="w-4 h-4 accent-[#25d366]"
                            />
                            <span>Active</span>
                          </label>
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                            Facility Title
                          </label>
                          <input
                            type="text"
                            value={fac.title}
                            onChange={(e) => {
                              const updated = [...facilities];
                              updated[idx].title = e.target.value;
                              setFacilities(updated);
                            }}
                            className="w-full px-3 py-2 bg-[#050806] border border-[#2b4231] focus:border-[#c5a869] text-sm font-bold text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                            Tag / Category
                          </label>
                          <input
                            type="text"
                            value={fac.tag}
                            onChange={(e) => {
                              const updated = [...facilities];
                              updated[idx].tag = e.target.value;
                              setFacilities(updated);
                            }}
                            className="w-full px-3 py-2 bg-[#050806] border border-[#2b4231] focus:border-[#c5a869] text-xs font-mono text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                            Description
                          </label>
                          <textarea
                            rows={3}
                            value={fac.description}
                            onChange={(e) => {
                              const updated = [...facilities];
                              updated[idx].description = e.target.value;
                              setFacilities(updated);
                            }}
                            className="w-full p-3 bg-[#050806] border border-[#2b4231] focus:border-[#c5a869] text-xs text-white leading-relaxed outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 4: SITE CONTENT & HOURS                                    */}
              {/* ============================================================== */}
              {activeTab === 'content' && content && (
                <div className="space-y-6">
                  <div className="bg-[#121c16] border-2 border-[#2d4533] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-['Syne'] font-extrabold text-xl sm:text-2xl uppercase text-white">
                        Gym Contact, Address & Timings
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1">
                        Updates here reflect directly across header, contact section, and footer.
                      </p>
                    </div>

                    <button
                      onClick={handleSaveContent}
                      disabled={isSaving}
                      className="px-6 py-3 bg-[#c5a869] hover:bg-[#dfc993] text-[#070908] text-xs font-bold uppercase tracking-wider transition-colors border border-[#c5a869] font-['Syne']"
                    >
                      Save Information
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact & Hours */}
                    <div className="p-6 bg-[#0c140f] border-2 border-[#26382b] space-y-4">
                      <h4 className="font-['Syne'] font-extrabold text-sm uppercase text-[#c5a869]">
                        Direct Contact & Timings
                      </h4>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                          Display Phone Number
                        </label>
                        <input
                          type="text"
                          value={content.contact.phone}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              contact: { ...content.contact, phone: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2.5 bg-[#050806] border border-[#2b4231] focus:border-[#c5a869] text-sm font-bold text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                          WhatsApp Mobile Number
                        </label>
                        <input
                          type="text"
                          value={content.contact.whatsapp}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              contact: { ...content.contact, whatsapp: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2.5 bg-[#050806] border border-[#2b4231] focus:border-[#c5a869] text-sm font-bold text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                          Dedicated Ladies Hours
                        </label>
                        <input
                          type="text"
                          value={content.contact.ladiesHours}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              contact: { ...content.contact, ladiesHours: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2.5 bg-[#050806] border border-[#2b4231] focus:border-[#c5a869] text-sm font-bold text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                          Gym Address
                        </label>
                        <textarea
                          rows={3}
                          value={content.contact.address}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              contact: { ...content.contact, address: e.target.value },
                            })
                          }
                          className="w-full p-3 bg-[#050806] border border-[#2b4231] focus:border-[#c5a869] text-xs text-white leading-relaxed outline-none"
                        />
                      </div>
                    </div>

                    {/* About Copy */}
                    <div className="p-6 bg-[#0c140f] border-2 border-[#26382b] space-y-4">
                      <h4 className="font-['Syne'] font-extrabold text-sm uppercase text-[#c5a869]">
                        Hero & About Slogans
                      </h4>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                          Hero Subtitle
                        </label>
                        <textarea
                          rows={3}
                          value={content.heroSubhead}
                          onChange={(e) => setContent({ ...content, heroSubhead: e.target.value })}
                          className="w-full p-3 bg-[#050806] border border-[#2b4231] focus:border-[#c5a869] text-xs text-white leading-relaxed outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                          About Section Heading
                        </label>
                        <input
                          type="text"
                          value={content.aboutTitle}
                          onChange={(e) => setContent({ ...content, aboutTitle: e.target.value })}
                          className="w-full px-3 py-2.5 bg-[#050806] border border-[#2b4231] focus:border-[#c5a869] text-sm font-bold text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                          About Paragraph 1
                        </label>
                        <textarea
                          rows={4}
                          value={content.aboutParagraph1}
                          onChange={(e) => setContent({ ...content, aboutParagraph1: e.target.value })}
                          className="w-full p-3 bg-[#050806] border border-[#2b4231] focus:border-[#c5a869] text-xs text-white leading-relaxed outline-none"
                        />
                      </div>
                    </div>

                    {/* Mentor & Chhatrapati Award Heritage */}
                    <div className="p-6 bg-[#0c140f] border-2 border-[#26382b] space-y-4 md:col-span-2">
                      <h4 className="font-['Syne'] font-extrabold text-sm uppercase text-[#c5a869] flex items-center gap-2">
                        <span>Chhatrapati Award Mentor Details</span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                            Mentor Name
                          </label>
                          <input
                            type="text"
                            value={content.mentor?.name || ''}
                            onChange={(e) =>
                              setContent({
                                ...content,
                                mentor: { ...content.mentor, name: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2.5 bg-[#050806] border border-[#2b4231] focus:border-[#c5a869] text-sm font-bold text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                            Honorific / Title
                          </label>
                          <input
                            type="text"
                            value={content.mentor?.honorific || ''}
                            onChange={(e) =>
                              setContent({
                                ...content,
                                mentor: { ...content.mentor, honorific: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2.5 bg-[#050806] border border-[#2b4231] focus:border-[#c5a869] text-sm font-bold text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                            Award Ceremony Title
                          </label>
                          <input
                            type="text"
                            value={content.mentor?.award || ''}
                            onChange={(e) =>
                              setContent({
                                ...content,
                                mentor: { ...content.mentor, award: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2.5 bg-[#050806] border border-[#2b4231] focus:border-[#c5a869] text-sm font-bold text-white outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                            Mentor Headshot Image URL
                          </label>
                          <input
                            type="text"
                            value={content.mentor?.portraitImage || ''}
                            onChange={(e) =>
                              setContent({
                                ...content,
                                mentor: { ...content.mentor, portraitImage: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2.5 bg-[#050806] border border-[#2b4231] focus:border-[#c5a869] text-sm text-white font-mono outline-none"
                            placeholder="/images/pravin-sakpal-headshot.jpg"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                            Award Ceremony Photo URL
                          </label>
                          <input
                            type="text"
                            value={content.mentor?.awardImage || ''}
                            onChange={(e) =>
                              setContent({
                                ...content,
                                mentor: { ...content.mentor, awardImage: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2.5 bg-[#050806] border border-[#2b4231] focus:border-[#c5a869] text-sm text-white font-mono outline-none"
                            placeholder="/images/pravin-award-cropped.jpg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                          Mentor Biography / Guidance Philosophy
                        </label>
                        <textarea
                          rows={3}
                          value={content.mentor?.bio || ''}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              mentor: { ...content.mentor, bio: e.target.value },
                            })
                          }
                          className="w-full p-3 bg-[#050806] border border-[#2b4231] focus:border-[#c5a869] text-xs text-white leading-relaxed outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 5: OVERVIEW & SYSTEM STATUS                                */}
              {/* ============================================================== */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-6 bg-[#0c140f] border-2 border-[#26382b]">
                      <span className="text-xs font-mono font-bold uppercase text-[#95a397]">
                        Active Plans
                      </span>
                      <div className="font-['Syne'] text-4xl font-extrabold text-white mt-2">
                        {memberships.filter((m) => m.active).length}
                      </div>
                      <span className="text-xs text-[#c5a869] mt-1 block">
                        4 Durations × 2 Categories
                      </span>
                    </div>

                    <div className="p-6 bg-[#0c140f] border-2 border-[#26382b]">
                      <span className="text-xs font-mono font-bold uppercase text-[#95a397]">
                        Total Inquiries
                      </span>
                      <div className="font-['Syne'] text-4xl font-extrabold text-[#c5a869] mt-2">
                        {leads.length}
                      </div>
                      <span className="text-xs text-slate-300 mt-1 block">
                        {newLeadsCount} awaiting response
                      </span>
                    </div>

                    <div className="p-6 bg-[#0c140f] border-2 border-[#26382b]">
                      <span className="text-xs font-mono font-bold uppercase text-[#95a397]">
                        Pricing Update
                      </span>
                      <div className="font-mono text-sm font-bold text-white mt-2 truncate">
                        {lastPriceUpdate ? new Date(lastPriceUpdate).toLocaleDateString('en-IN') : 'Live'}
                      </div>
                      <span className="text-xs text-slate-300 mt-1 block">
                        Synced with sarveshwar_db.json
                      </span>
                    </div>

                    <div className="p-6 bg-[#0c140f] border-2 border-[#26382b]">
                      <span className="text-xs font-mono font-bold uppercase text-[#95a397]">
                        Server State
                      </span>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="w-3 h-3 rounded-full bg-[#25d366] animate-pulse" />
                        <span className="font-['Syne'] text-base font-bold text-white uppercase">
                          Operational
                        </span>
                      </div>
                      <span className="text-xs text-[#95a397] mt-1 block">
                        Kurla West, Mumbai 400070
                      </span>
                    </div>
                  </div>

                  <div className="p-6 bg-[#121c16] border border-[#2d4533] space-y-3">
                    <h4 className="font-['Syne'] font-extrabold text-base uppercase text-white">
                      Quick Admin Shortcuts
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setActiveTab('pricing')}
                        className="px-5 py-2.5 bg-[#c5a869] text-[#070908] text-xs font-bold uppercase tracking-wider font-['Syne']"
                      >
                        Adjust Membership Rates →
                      </button>
                      <button
                        onClick={() => setActiveTab('leads')}
                        className="px-5 py-2.5 bg-[#18261e] hover:bg-[#23382c] text-white text-xs font-bold uppercase tracking-wider border border-[#2d4533]"
                      >
                        View Customer Inquiries ({leads.length}) →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 6: FRONT DESK & RECEPTION QR STANDEE                       */}
              {/* ============================================================== */}
              {activeTab === 'standee' && (
                <div className="space-y-6">
                  {/* Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#0c140f] border-2 border-[#26382b]">
                    <div>
                      <h4 className="font-['Syne'] font-extrabold text-base uppercase text-white">
                        Reception Counter QR Standee & Rate Card
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Keep this open on a reception counter tablet, or print a laminated copy for walk-in visitors.
                      </p>
                    </div>

                    <button
                      onClick={() => window.print()}
                      className="px-5 py-2.5 bg-[#c5a869] hover:bg-[#dfc993] text-[#070908] text-xs font-bold uppercase tracking-wider font-['Syne'] flex items-center gap-2 self-start sm:self-auto shadow-md"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Standee Card</span>
                    </button>
                  </div>

                  {/* Physical Standee Preview Card (Print-ready) */}
                  <div className="max-w-2xl mx-auto bg-[#070908] border-2 border-[#c5a869] p-8 sm:p-10 shadow-2xl relative text-center space-y-6 text-[#f2f3ee]">
                    {/* Header */}
                    <div className="border-b border-[#26382b] pb-6 space-y-2">
                      <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-[#c5a869]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c5a869]" />
                        <span>OFFICIAL GYM SCHEDULE & TARIFF</span>
                      </div>
                      <h2 className="font-['Syne'] font-black text-3xl sm:text-4xl uppercase tracking-tight text-white">
                        SARVESHWAR FITNESS
                      </h2>
                      <p className="text-xs text-[#95a397] font-mono">
                        Near Police Station, 216/1 Takia Ward, Sarveshwar Mandir Road, Kurla West, Mumbai 400070
                      </p>
                    </div>

                    {/* QR Code & Direct Scan */}
                    <div className="bg-[#0c140f] border border-[#26382b] p-5 flex flex-col sm:flex-row items-center justify-center gap-6">
                      <div className="bg-white p-3 border border-[#c5a869]/40 shadow-inner shrink-0">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : 'https://sarveshwarfitness.com')}&margin=0`}
                          alt="Sarveshwar Fitness QR Code"
                          className="w-32 h-32"
                          loading="lazy"
                        />
                      </div>
                      <div className="text-left space-y-1.5">
                        <span className="text-[10px] font-mono tracking-wider uppercase text-[#c5a869] font-bold block">
                          Instant Mobile Access
                        </span>
                        <h4 className="font-['Syne'] font-bold text-base uppercase text-white">
                          Scan With Any Phone Camera
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          • View full training facilities & floor videos<br />
                          • Check coach profiles & state awards<br />
                          • Directly connect with trainers on WhatsApp
                        </p>
                      </div>
                    </div>

                    {/* Live Membership Fees Table */}
                    <div className="space-y-3 text-left">
                      <div className="flex items-center justify-between border-b border-[#26382b] pb-1.5">
                        <h4 className="font-['Syne'] font-bold text-xs uppercase text-[#c5a869]">
                          Transparent Membership Tariffs
                        </h4>
                        <span className="text-[10px] font-mono text-[#95a397]">
                          All Taxes & Floor Trainer Support Included
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {memberships.filter((m) => m.active).map((plan) => (
                          <div key={plan.id} className="p-3 bg-[#0d1410] border border-[#26382b]">
                            <span className="text-[11px] font-bold uppercase text-white block">
                              {plan.duration}
                            </span>
                            <div className="mt-2 text-xs font-mono space-y-1">
                              <div className="text-slate-300">
                                Cardio: <strong className="text-[#c5a869]">{formatINR(plan.cardioPrice)}</strong>
                              </div>
                              <div className="text-slate-400">
                                Strength: <strong>{formatINR(plan.nonCardioPrice)}</strong>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Crucial Hours & Rules */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2 border-t border-[#26382b]">
                      <div className="p-3.5 bg-[#121c16] border border-[#2d4533]">
                        <span className="text-[10px] font-mono uppercase text-[#c5a869] font-bold block">
                          Dedicated Ladies Hours
                        </span>
                        <p className="text-xs font-bold text-white mt-1">
                          1:00 PM – 4:00 PM (Mon – Sat)
                        </p>
                        <span className="text-[10px] text-slate-300 block mt-0.5">
                          Exclusively for female lifters with female coach guidance.
                        </span>
                      </div>

                      <div className="p-3.5 bg-[#121c16] border border-[#2d4533]">
                        <span className="text-[10px] font-mono uppercase text-[#c5a869] font-bold block">
                          Floor Training Rules
                        </span>
                        <p className="text-xs font-bold text-white mt-1">
                          Clean Towel & Clean Shoes Mandatory
                        </p>
                        <span className="text-[10px] text-slate-300 block mt-0.5">
                          Strict hygiene. Re-rack weights after every exercise set.
                        </span>
                      </div>
                    </div>

                    {/* Footer Contact */}
                    <div className="pt-2 text-xs font-mono text-slate-400">
                      Front Desk Enquiries / WhatsApp: <strong className="text-white">+91 84336 50068</strong>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* MODAL: ADD WALK-IN / TEST LEAD */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0c140f] border-2 border-[#c5a869] p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#223326]">
              <h4 className="font-['Syne'] font-extrabold text-lg uppercase text-white">
                Log Walk-In / Phone Lead
              </h4>
              <button
                onClick={() => setShowAddLeadModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTestLead} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={newLeadForm.name}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                  placeholder="e.g. Sameer Khan"
                  className="w-full px-3 py-2 bg-[#050806] border border-[#2b4231] focus:border-[#c5a869] text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={newLeadForm.phone}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                  placeholder="e.g. 98201 54321"
                  className="w-full px-3 py-2 bg-[#050806] border border-[#2b4231] focus:border-[#c5a869] text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                  Interested Plan
                </label>
                <select
                  value={newLeadForm.planTitle}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, planTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-[#050806] border border-[#2b4231] focus:border-[#c5a869] text-xs text-white outline-none"
                >
                  <option value="1 Month (Cardio Included)">1 Month (Cardio Included)</option>
                  <option value="1 Month (Without Cardio)">1 Month (Without Cardio)</option>
                  <option value="3 Months (Cardio Included)">3 Months (Cardio Included)</option>
                  <option value="3 Months (Without Cardio)">3 Months (Without Cardio)</option>
                  <option value="6 Months (Cardio Included)">6 Months (Cardio Included)</option>
                  <option value="6 Months (Without Cardio)">6 Months (Without Cardio)</option>
                  <option value="12 Months (Cardio Included)">12 Months (Cardio Included)</option>
                  <option value="12 Months (Without Cardio)">12 Months (Without Cardio)</option>
                  <option value="Ladies Special Hours Inquiry">Ladies Special Hours (1 PM - 4 PM)</option>
                  <option value="Personal Training Inquiry">Personal Training 1-on-1</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                  Fitness Objective / Notes
                </label>
                <input
                  type="text"
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  placeholder="e.g. Inquired about evening slot"
                  className="w-full px-3 py-2 bg-[#050806] border border-[#2b4231] focus:border-[#c5a869] text-xs text-white outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#c5a869] text-[#070908] text-xs font-bold uppercase tracking-wider font-['Syne']"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
