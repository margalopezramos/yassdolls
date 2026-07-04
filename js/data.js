// ============================================================
// YASS.DOLLS — data.js
// Thin wrapper around Supabase calls used across every page.
// ============================================================

const MAIN_ARTISTS = ['Ariana Grande', 'Olivia Rodrigo', 'Sabrina Carpenter', 'Taylor Swift'];

/** Fetch every doll in the catalog, ordered by artist then id. */
async function fetchAllDolls() {
  const { data, error } = await supabaseClient
    .from('dolls')
    .select('*')
    .order('artist', { ascending: true })
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching dolls:', error);
    return [];
  }
  return data || [];
}

/** Fetch a single doll by its id. */
async function fetchDollById(id) {
  const { data, error } = await supabaseClient
    .from('dolls')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching doll:', error);
    return null;
  }
  return data;
}

/** Fetch other dolls from the same artist (for "You might also like"). */
async function fetchRelatedDolls(artist, excludeId, limit = 4) {
  const { data, error } = await supabaseClient
    .from('dolls')
    .select('*')
    .eq('artist', artist)
    .neq('id', excludeId)
    .limit(limit);

  if (error) {
    console.error('Error fetching related dolls:', error);
    return [];
  }
  return data || [];
}

/** Fetch reviews for a given doll. */
async function fetchReviews(dollId) {
  const { data, error } = await supabaseClient
    .from('reviews')
    .select('*')
    .eq('doll_id', dollId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
  return data || [];
}

/** Group a flat list of dolls into { "Ariana Grande": [...], ..., "Others": [...] } */
function groupDollsByArtist(dolls) {
  const groups = {};
  MAIN_ARTISTS.forEach(a => { groups[a] = []; });
  groups['Others'] = [];

  dolls.forEach(doll => {
    if (MAIN_ARTISTS.includes(doll.artist)) {
      groups[doll.artist].push(doll);
    } else {
      groups['Others'].push(doll);
    }
  });
  return groups;
}
