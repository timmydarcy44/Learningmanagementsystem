import { SupabaseClient } from '@supabase/supabase-js';

export async function updateOrInsert(
  sb: SupabaseClient,
  table: string,
  keys: Record<string, any>,
  data: Record<string, any>
) {
  console.log(`[TRACE] updateOrInsert starting for table ${table}`, { keys, data });
  
  // SELECT
  let sel = sb.from(table).select('*').limit(1);
  for (const [k, v] of Object.entries(keys)) {
    sel = sel.eq(k, v as any);
  }
  const { data: existing, error: selErr } = await sel.maybeSingle();
  
  if (selErr) {
    console.error(`[ERROR] updateOrInsert select failed for table ${table}:`, selErr);
    throw selErr;
  }

  if (existing) {
    console.log(`[TRACE] updateOrInsert found existing record in ${table}, updating`);
    // UPDATE
    let upd = sb.from(table).update(data);
    for (const [k, v] of Object.entries(keys)) {
      upd = upd.eq(k, v as any);
    }
    const { error: updErr } = await upd;
    
    if (updErr) {
      console.error(`[ERROR] updateOrInsert update failed for table ${table}:`, updErr);
      throw updErr;
    }
    
    console.log(`[TRACE] updateOrInsert update successful for table ${table}`);
    return { action: 'update' as const };
  } else {
    console.log(`[TRACE] updateOrInsert no existing record in ${table}, inserting`);
    // INSERT
    const payload = { ...keys, ...data };
    const { error: insErr } = await sb.from(table).insert(payload);
    
    if (insErr) {
      console.error(`[ERROR] updateOrInsert insert failed for table ${table}:`, insErr);
      throw insErr;
    }
    
    console.log(`[TRACE] updateOrInsert insert successful for table ${table}`);
    return { action: 'insert' as const };
  }
}

// Legacy function for backward compatibility
export async function upsertByKeys<T extends Record<string, any>>(
  sb: SupabaseClient,
  table: string,
  keys: Record<string, any>,     // ex: { org_id, user_id } ou { bucket, object_name }
  data: Record<string, any>      // le reste des colonnes à écrire
) {
  return updateOrInsert(sb, table, keys, data);
}
