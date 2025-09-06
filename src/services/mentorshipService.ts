import { supabase } from '@/lib/supabase';

export const mentorshipService = {
  async sendMentorshipRequest(mentorId: string, message: string) {
    const { data, error } = await supabase
      .from('mentorship_requests')
      .insert([
        {
          mentor_id: mentorId,
          message,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getMentorshipRequests() {
    const { data, error } = await supabase
      .from('mentorship_requests')
      .select(`
        *,
        artisan_profile:profiles!mentorship_requests_artisan_id_fkey(*),
        mentor_profile:profiles!mentorship_requests_mentor_id_fkey(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async updateRequestStatus(requestId: string, status: 'accepted' | 'rejected') {
    const { error } = await supabase
      .from('mentorship_requests')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (error) throw error;
  }
};