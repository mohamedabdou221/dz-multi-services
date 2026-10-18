'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitWeddingRequest(formData: FormData) {
  const supabase = await createClient()

  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'Non authentifié' }
    }

    // Extract form data
    const forMyself = formData.get('forMyself') === 'true'
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const weddingDate = formData.get('weddingDate') as string
    const location = formData.get('location') as string
    const weddingType = formData.get('weddingType') as string
    const guests = formData.get('guests') as string
    const description = formData.get('description') as string

    // Build metadata
    const metadata = {
      forMyself,
      firstName,
      lastName,
      email,
      phone,
      weddingDate,
      location,
      weddingType,
      guests,
      description,
    }

    // Call RPC function
    const { data, error } = await supabase.rpc('submit_request', {
      p_client_id: user.id,
      p_service_type: 'WEDDING',
      p_preferred_date: weddingDate,
      p_description: description,
      p_metadata: metadata,
    } as any)

    if (error) {
      console.error('Error submitting request:', error)
      return { error: 'Erreur lors de la soumission' }
    }

    // Revalidate paths
    revalidatePath('/admin/requests')
    revalidatePath('/admin/dashboard')

    return { success: true, requestId: data }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { error: 'Erreur inattendue' }
  }
}
