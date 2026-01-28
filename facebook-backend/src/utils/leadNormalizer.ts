export const normalizeLead = (raw: any) => {
  const normalized = {
    first_name:
      raw.first_name || raw.firstname || raw.first || "",
    last_name:
      raw.last_name || raw.lastname || raw.last || "",
    email:
      raw.email || raw.email_address || raw.mail || "",
    company:
      raw.company || raw.organization || "",
    position:
      raw.position || raw.title || "",
    phone:
      raw.phone || raw.mobile || "",
    website:
      raw.website || raw.url || "",
  };

  // Collect extra fields not in the standard set
  const standardKeys = [
    'first_name', 'firstname', 'first',
    'last_name', 'lastname', 'last',
    'email', 'email_address', 'mail',
    'company', 'organization',
    'position', 'title',
    'phone', 'mobile',
    'website', 'url'
  ];

  const extraFields: { [key: string]: any } = {};
  for (const key in raw) {
    if (!standardKeys.includes(key)) {
      extraFields[key] = raw[key];
    }
  }

  return { ...normalized, extraFields };
};
