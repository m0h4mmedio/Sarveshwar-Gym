import { AppData, Lead, MembershipPlan, Facility, GalleryItem, SiteContent } from '../types';
import { initialData } from '../data/defaultData';

const TOKEN_KEY = 'sf_admin_token';

export const api = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  async getContent(): Promise<{
    memberships: MembershipPlan[];
    facilities: Facility[];
    gallery: GalleryItem[];
    content: SiteContent;
    lastPriceUpdate: string;
  }> {
    try {
      const res = await fetch('/api/content');
      if (!res.ok) throw new Error('Failed to fetch content');
      return await res.json();
    } catch (err) {
      console.warn('API error, using initial data fallback', err);
      return {
        memberships: initialData.memberships,
        facilities: initialData.facilities,
        gallery: initialData.gallery,
        content: initialData.content,
        lastPriceUpdate: initialData.lastPriceUpdate,
      };
    }
  },

  async submitLead(lead: {
    name: string;
    phone: string;
    planId?: string;
    planTitle?: string;
    planType?: 'cardio' | 'nonCardio';
    goal?: string;
    notes?: string;
  }): Promise<{ success: boolean; lead: Lead }> {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to submit enquiry');
    }
    return await res.json();
  },

  // Admin APIs
  async login(password: string): Promise<{ success: boolean; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Incorrect administrative password');
    }
    const data = await res.json();
    this.setToken(data.token);
    return data;
  },

  async verifyAuth(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getAdminAll(): Promise<AppData & { totalLeads: number; activePlans: number }> {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');

    const res = await fetch('/api/admin/all', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) this.clearToken();
      throw new Error('Failed to fetch admin data');
    }
    return await res.json();
  },

  async updateMemberships(memberships: MembershipPlan[]): Promise<any> {
    const token = this.getToken();
    const res = await fetch('/api/admin/memberships', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ memberships }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to update memberships');
    }
    return await res.json();
  },

  async updateFacilities(facilities: Facility[]): Promise<any> {
    const token = this.getToken();
    const res = await fetch('/api/admin/facilities', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ facilities }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to update facilities');
    }
    return await res.json();
  },

  async updateContent(content: SiteContent): Promise<any> {
    const token = this.getToken();
    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to update content');
    }
    return await res.json();
  },

  async updateGallery(gallery: GalleryItem[]): Promise<any> {
    const token = this.getToken();
    const res = await fetch('/api/admin/gallery', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ gallery }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to update gallery');
    }
    return await res.json();
  },

  async updateLeadStatus(id: string, status: Lead['status'], notes?: string): Promise<any> {
    const token = this.getToken();
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, notes }),
    });
    if (!res.ok) throw new Error('Failed to update lead');
    return await res.json();
  },

  async deleteLead(id: string): Promise<any> {
    const token = this.getToken();
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete lead');
    return await res.json();
  },

  async resetData(): Promise<any> {
    const token = this.getToken();
    const res = await fetch('/api/admin/reset', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to reset data');
    return await res.json();
  },
};
