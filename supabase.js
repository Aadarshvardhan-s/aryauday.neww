// ============================================================
// ARYAUDAY - Supabase Configuration
// Replace these values with your actual Supabase credentials
// ============================================================

const SUPABASE_URL = 'https://ejwsbxenhpekkiqoffwr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_M2OPaNxgPl1GDZmRrbagfg_ViOpi9ht';

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// AUTH HELPERS
// ============================================================

const Auth = {
  async signUp(email, password, fullName) {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
    if (error) throw error;
    if (data.user) {
      await supabaseClient.from('users').insert({
        id: data.user.id,
        full_name: fullName,
        email: email,
        role: 'user'
      });
    }
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  },

  async resetPassword(email) {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/pages/reset-password.html'
    });
    if (error) throw error;
  },

  async getSession() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    return session;
  },

  async getUser() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user;
  },

  onAuthStateChange(callback) {
    return supabaseClient.auth.onAuthStateChange(callback);
  }
};

// ============================================================
// DATABASE HELPERS
// ============================================================

const DB = {
  // VOLUNTEERS
  async insertVolunteer(data) {
    const { data: result, error } = await supabaseClient
      .from('volunteers')
      .insert([data])
      .select();
    if (error) throw error;
    return result;
  },

  async getVolunteers(search = '', limit = 50, offset = 0) {
    let query = supabaseClient
      .from('volunteers')
      .select('*', { count: 'exact' })
      .order('submitted_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (search) {
      query = query.or(`fullname.ilike.%${search}%,email.ilike.%${search}%,helping_area.ilike.%${search}%`);
    }
    const { data, error, count } = await query;
    if (error) throw error;
    return { data, count };
  },

  async deleteVolunteer(id) {
    const { error } = await supabaseClient.from('volunteers').delete().eq('id', id);
    if (error) throw error;
  },

  // CONTACTS
  async insertContact(data) {
    const { data: result, error } = await supabaseClient
      .from('contacts')
      .insert([data])
      .select();
    if (error) throw error;
    return result;
  },

  async getContacts(search = '', limit = 50, offset = 0) {
    let query = supabaseClient
      .from('contacts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%`);
    }
    const { data, error, count } = await query;
    if (error) throw error;
    return { data, count };
  },

  async deleteContact(id) {
    const { error } = await supabaseClient.from('contacts').delete().eq('id', id);
    if (error) throw error;
  },

  // USERS
  async getUsers(search = '', limit = 50, offset = 0) {
    let query = supabaseClient
      .from('users')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }
    const { data, error, count } = await query;
    if (error) throw error;
    return { data, count };
  },

  async deleteUser(id) {
    const { error } = await supabaseClient.from('users').delete().eq('id', id);
    if (error) throw error;
  },

  // DONATIONS
  async insertDonation(data) {
    const { data: result, error } = await supabaseClient
      .from('donations')
      .insert([data])
      .select();
    if (error) throw error;
    return result;
  },

  async getDonations(search = '', limit = 50, offset = 0) {
    let query = supabaseClient
      .from('donations')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (search) {
      query = query.or(`donor_name.ilike.%${search}%,email.ilike.%${search}%`);
    }
    const { data, error, count } = await query;
    if (error) throw error;
    return { data, count };
  },

  // Check admin role
  async isAdmin(userId) {
    const { data, error } = await supabaseClient
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();
    if (error) return false;
    return data?.role === 'admin';
  }
};

// Export globally
window.supabaseClient = supabaseClient;
window.Auth = Auth;
window.DB = DB;