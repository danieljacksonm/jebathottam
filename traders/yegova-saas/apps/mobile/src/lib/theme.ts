export const colors = {
  bg: '#f3efe6',
  paper: '#f7f3eb',
  surface: '#fffcf7',
  ink: '#171a17',
  muted: '#5f675f',
  line: 'rgba(23, 26, 23, 0.1)',
  forest: '#1f4d3a',
  forestSoft: '#2f6b52',
  brass: '#9a7840',
  danger: '#b42318',
  ok: '#1f7a4d',
  white: '#ffffff',
};

export function money(n: number) {
  return `Rs ${Number(n || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  })}`;
}
