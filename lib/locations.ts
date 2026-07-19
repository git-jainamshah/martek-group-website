/** Country + province data for lead forms. CA/US get real selectors; others get a free-text region. */

export const COUNTRIES = [
  'Canada', 'United States', 'United Kingdom', 'Australia', 'Germany', 'France', 'Netherlands',
  'Ireland', 'Spain', 'Italy', 'Sweden', 'Norway', 'Denmark', 'Switzerland', 'Austria', 'Belgium',
  'Portugal', 'Poland', 'India', 'Singapore', 'United Arab Emirates', 'Japan', 'South Korea',
  'New Zealand', 'Brazil', 'Mexico', 'South Africa', 'Israel', 'Other',
]

export const PROVINCES: Record<string, string[]> = {
  Canada: [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
    'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
    'Quebec', 'Saskatchewan', 'Yukon',
  ],
  'United States': [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'Washington D.C.', 'West Virginia', 'Wisconsin', 'Wyoming',
  ],
}
