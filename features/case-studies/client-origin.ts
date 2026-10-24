/** A concise, editorially styled client-origin marker for case-study pages. */
export interface ClientOrigin {
  /** ISO-like display code used as a small visual stamp, e.g. KSA. */
  code: string;
  country: string;
  countryAr: string;
}

/**
 * The GAD identity materials identify the client with Saudi Arabia and Vision
 * 2030. This records the country only; it deliberately does not infer a city
 * or a street address from the Eastern Province audience notes.
 */
export const GAD_CLIENT_ORIGIN: ClientOrigin = {
  code: "KSA",
  country: "Saudi Arabia",
  countryAr: "المملكة العربية السعودية",
};
