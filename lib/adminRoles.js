export const ROLES = ["dev", "admin", "usuario", "estabelecimento"];

export const ADMIN_ACCESS_ROLES = ["admin", "dev"];

export const ROLE_CHIP_STYLES = {
  dev: "bg-purple-100 text-purple-700",
  admin: "bg-blue-100 text-blue-700",
  usuario: "bg-gray-100 text-gray-500",
  estabelecimento: "bg-orange-100 text-orange-700",
};

export function canAccessAdmin(role) {
  return ADMIN_ACCESS_ROLES.includes(role);
}

export function normalizeRole(role) {
  if (!role || role === "user") return "usuario";
  return role;
}

export function getRoleChipClass(role) {
  const normalized = normalizeRole(role);
  return ROLE_CHIP_STYLES[normalized] || "bg-gray-100 text-gray-500";
}
