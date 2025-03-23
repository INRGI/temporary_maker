export interface HTMLFormatterPayload {
  html: string;
  printWidth?: number;
  tabWidth?: number;
  useTabs?: boolean;
  htmlWhitespaceSensitivity?: 'css' | 'strict' | 'ignore';
}
