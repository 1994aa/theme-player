// Song suggestions from visitors go to a Google Form, whose responses fill a Google Sheet.
// `action` is the form's address with /viewform changed to /formResponse, and each field is
// the entry id of that question (from the form's "Get pre-filled link"). Until `action` is set,
// the suggestion button stays hidden. A field without an entry id is left off the site's form.
export const SUGGEST_FORM = {
  action: 'https://docs.google.com/forms/d/e/1FAIpQLSdgnIOpK3zw05LL1gNYHDMN2I4kKLYB7T_xTMHCtEGMMi8oPg/formResponse',
  song: '703021803',
  artist: '804650210',
  theme: '', // the form has no theme question yet, so the site hides that choice
  link: '1601716524',
  name: '1395528511',
};
