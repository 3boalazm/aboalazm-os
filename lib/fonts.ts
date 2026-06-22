const stub = (variable: string) => ({ variable, className: variable });
export const instrumentSerif = stub("--font-instrument-serif");
export const interTight      = stub("--font-inter-tight");
export const jetbrainsMono   = stub("--font-jetbrains-mono");
export const geistMono       = stub("--font-geist-mono");
export const plexArabic      = stub("--font-plex-arabic");
export const fontVariables   = [instrumentSerif.variable,interTight.variable,jetbrainsMono.variable,geistMono.variable,plexArabic.variable].join(" ");
