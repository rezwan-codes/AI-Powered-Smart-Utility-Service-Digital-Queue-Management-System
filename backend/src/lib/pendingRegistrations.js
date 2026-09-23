const pending = new Map();

function keyOf(email, role) {
  return `${String(email).toLowerCase()}::${role}`;
}

export function storePendingRegistration({ name, email, passwordHash, phone, role, skill, area }) {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expires = new Date(Date.now() + 15 * 60 * 1000);
  const entryKey = keyOf(email, role);

  pending.set(entryKey, {
    name,
    email: email.toLowerCase(),
    passwordHash,
    phone,
    role,
    skill,
    area,
    code,
    expires,
  });

  return code;
}

export function getPendingRegistration(email, role) {
  const entry = pending.get(keyOf(email, role));
  if (!entry) return null;

  if (entry.expires < new Date()) {
    pending.delete(keyOf(email, role));
    return null;
  }

  return { email: entry.email, data: entry };
}

export function consumePendingRegistration(email, role, code) {
  const entryKey = keyOf(email, role);
  const entry = pending.get(entryKey);

  if (!entry || entry.expires < new Date()) {
    pending.delete(entryKey);
    return null;
  }

  if (entry.code !== String(code).trim()) {
    return null;
  }

  pending.delete(entryKey);

  return {
    name: entry.name,
    email: entry.email,
    passwordHash: entry.passwordHash,
    phone: entry.phone,
    role: entry.role,
    skill: entry.skill,
    area: entry.area,
  };
}
