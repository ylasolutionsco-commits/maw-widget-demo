// Client onboarding questions (owner checklist S10/S11 + B01 discovery) for A01.
// One source for the intake form (browser) and the setup command (node scripts/onboard-client.mjs).
// `need`: 'pilot' = required before a live pilot; 'later' = optional / production.
// Every section ends with a named sign-off so each answer has an owner, a date and an approval status.

export const SECTIONS = [
  { id: 'business', title: 'Your business', fields: [
    { id: 'legal_name', label: 'Legal company name', type: 'text', need: 'pilot' },
    { id: 'trading_name', label: 'Name customers know you by', type: 'text', need: 'pilot', help: 'How the assistant introduces you, e.g. "Ancoats Physio".' },
    { id: 'owner_name', label: 'Business owner (decision maker)', type: 'text', need: 'pilot' },
    { id: 'owner_email', label: 'Owner email', type: 'email', need: 'pilot' },
    { id: 'address', label: 'Clinic address', type: 'textarea', need: 'pilot' },
    { id: 'website', label: 'Website', type: 'url', need: 'pilot' },
    { id: 'website_platform', label: 'What your website runs on', type: 'select', options: ['WordPress', 'Wix', 'Squarespace', 'Shopify', 'Custom', "Don't know"], need: 'later',
      help: 'So we know how to add the chat to your site.' },
  ] },
  { id: 'hours', title: 'Opening hours', fields: [
    { id: 'opening_hours', label: 'Opening hours', type: 'hours', need: 'pilot' },
    { id: 'closures', label: 'Upcoming closure dates', type: 'textarea', need: 'later', help: 'One date per line, YYYY-MM-DD.' },
  ] },
  { id: 'services', title: 'Services and staff', fields: [
    { id: 'services', label: 'Services', type: 'list', need: 'pilot', item: [
      { id: 'name', label: 'Service name', type: 'text' },
      { id: 'duration_minutes', label: 'Length (minutes)', type: 'number' },
      { id: 'price_gbp', label: 'Price (£)', type: 'number' },
      { id: 'preparation', label: 'What to bring / prepare', type: 'text' } ] },
    { id: 'practitioners', label: 'Practitioners', type: 'list', need: 'pilot', item: [
      { id: 'name', label: 'Name and role', type: 'text' },
      { id: 'services', label: 'Services they offer (comma separated, as named above)', type: 'text' } ] },
  ] },
  { id: 'rules', title: 'Booking rules', fields: [
    { id: 'min_notice_minutes', label: 'Shortest notice for a new booking (minutes)', type: 'number', need: 'pilot', default: 120 },
    { id: 'horizon_days', label: 'How far ahead people can book (days)', type: 'number', need: 'pilot', default: 56 },
    { id: 'buffer_minutes', label: 'Gap between appointments (minutes)', type: 'number', need: 'pilot', default: 10 },
    { id: 'cancellation_cutoff_hours', label: 'Cancellation notice required (hours)', type: 'number', need: 'pilot', default: 24 },
  ] },
  { id: 'systems', title: 'Your systems', fields: [
    { id: 'booking_system', label: 'Booking / practice system (product name)', type: 'text', need: 'pilot', help: 'e.g. Cliniko, Jane, WriteUpp, Pabau, TM3, or "paper diary".' },
    { id: 'booking_plan', label: 'Plan / subscription level', type: 'text', need: 'later' },
    { id: 'booking_api_admin', label: 'Who can approve API access for it?', type: 'text', need: 'pilot' },
    { id: 'email_suite', label: 'Email', type: 'select', options: ['Google Workspace', 'Microsoft 365', 'Other', 'None'], need: 'pilot' },
    { id: 'main_phone', label: 'Main clinic phone number', type: 'tel', need: 'pilot', help: "We won't change or move it during the pilot." },
  ] },
  { id: 'people', title: 'Handovers to your team', fields: [
    { id: 'primary_contact', label: 'Who receives handovers (email or mobile)', type: 'text', need: 'pilot' },
    { id: 'backup_contact', label: 'Backup if they don’t respond', type: 'text', need: 'pilot' },
    { id: 'ack_minutes_normal', label: 'How quickly someone should pick up a normal handover (minutes)', type: 'number', need: 'pilot', default: 120 },
    { id: 'ack_minutes_urgent', label: 'How quickly for urgent ones (minutes)', type: 'number', need: 'pilot', default: 5 },
    { id: 'transfer_number', label: 'Number to put phone callers through to a person', type: 'tel', need: 'later' },
    { id: 'urgent_instruction', label: 'What the assistant says for urgent or emergency messages', type: 'textarea', need: 'pilot',
      default: 'If this is a medical emergency, call 999 now. For urgent medical advice, call NHS 111.',
      help: 'Your clinical lead must approve this wording. The assistant says it word for word.' },
    { id: 'callback_promise', label: 'Callback time you promise (leave blank if none)', type: 'text', need: 'later' },
  ] },
  { id: 'knowledge', title: 'Answers the assistant may give', fields: [
    { id: 'faqs', label: 'Questions and approved answers', type: 'list', need: 'pilot',
      help: 'Only these answers are used. Anything else goes to your team. Include parking, payment, what to bring, policies.',
      item: [ { id: 'topic', label: 'Question / topic', type: 'text' }, { id: 'answer', label: 'Approved answer', type: 'textarea' } ] },
  ] },
  { id: 'privacy', title: 'Privacy and data', fields: [
    { id: 'privacy_url', label: 'Link to your privacy notice', type: 'url', need: 'pilot' },
    { id: 'privacy_contact', label: 'Privacy contact / DPO', type: 'text', need: 'pilot' },
    { id: 'transcript_retention', label: 'How long to keep chat and call transcripts', type: 'select',
      options: ['Delete when the conversation ends', '7 days', '30 days', '90 days'], need: 'pilot' },
    { id: 'recordings', label: 'Record phone calls?', type: 'select', options: ['No', 'Yes'], need: 'pilot', default: 'No' },
    { id: 'special_category_basis', label: 'Lawful basis and condition for health data', type: 'textarea', need: 'pilot',
      help: 'Clinic messages can contain health information. Your privacy adviser should confirm this. We cannot self-certify it for you.' },
    { id: 'dpia_status', label: 'Data protection impact assessment (DPIA)', type: 'select', options: ['Not started', 'In progress', 'Completed', 'Not required (adviser confirmed)'], need: 'pilot' },
  ] },
  { id: 'pilot', title: 'Pilot plan and budget', fields: [
    { id: 'pilot_channel', label: 'Start with', type: 'select', options: ['Website chat', 'Phone', 'Both'], need: 'pilot' },
    { id: 'pilot_scope', label: 'What the assistant may do in the pilot', type: 'select',
      options: ['Answer questions only', 'Answer + new bookings', 'Answer + new bookings + cancel/move'], need: 'pilot' },
    { id: 'monthly_budget_gbp', label: 'Monthly usage budget cap (£)', type: 'number', need: 'pilot' },
    { id: 'baseline_calls', label: 'Calls per month today (estimate)', type: 'number', need: 'pilot' },
    { id: 'baseline_bookings', label: 'Bookings per week today', type: 'number', need: 'pilot' },
    { id: 'baseline_missed', label: 'Missed calls per week (if known)', type: 'number', need: 'later' },
    { id: 'baseline_no_shows', label: 'No-show rate % (if known)', type: 'number', need: 'later' },
  ] },
];

export const fieldsOf = (section) => section.fields;

// what's missing before a stage, ignoring sign-offs (checked separately)
export function missing(data, stage = 'pilot') {
  const out = [];
  for (const s of SECTIONS) for (const f of s.fields) {
    if (stage === 'pilot' && f.need !== 'pilot') continue;
    const v = data?.[f.id];
    const empty = v == null || v === '' || (Array.isArray(v) && !v.some((row) => Object.values(row ?? {}).some((x) => String(x ?? '').trim())))
      || (f.type === 'hours' && !Object.values(v ?? {}).some((d) => d?.length));
    if (empty) out.push({ section: s.title, field: f.label });
  }
  return out;
}

// sections without a named approver and date
export function unsigned(data) {
  return SECTIONS.filter((s) => !(data?._signoff?.[s.id]?.name && data?._signoff?.[s.id]?.date)).map((s) => s.title);
}
