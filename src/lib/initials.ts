export function companyInitials(name: string): string {
  const words = name.trim().split(/\s+/);

  if (words.length > 1) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  const segments = name.match(/[A-Z][a-z0-9]*/g);
  if (segments && segments.length > 1) {
    return (segments[0][0] + segments[1][0]).toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
}
