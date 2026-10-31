// Company details from the trade licence (confirmed by Waleed 2026-11-01), plus the
// one value still waiting for confirmation.

export const COMPANY_NAME = 'Al Jash Trading';
export const COMPANY_FORM = 'Establishment';
export const COMPANY_CITY = 'Abu Dhabi';
export const COMPANY_SINCE = 1994;
export const COMPANY_ADDRESS = 'Office 5, Bani Yas West 4, Bani Yas, Abu Dhabi, UAE';
export const COMPANY_LICENCE = 'Economic licence CN-1030597, Abu Dhabi Registration Authority';
export const COMPANY_WEBSITE = 'https://aljashtrading.com';

// Who builds it: TechRealm develops LogicPacks; Al Jash Trading operates and hosts it.
// Profiles listed only when they resolve and clearly belong to TechRealm (checked 2026-11-01:
// LinkedIn names techrealm.online as its website; techrealm.online links the Facebook page).
export const DEVELOPER = {
  name: 'TechRealm',
  url: 'https://techrealm.online',
  about: 'a software and AI development team',
  profiles: ['https://www.linkedin.com/company/techrealm/', 'https://www.facebook.com/TechRealm.Pakistan'],
};

// Brands we have worked with, directly or through third-party agencies (confirmed
// by Waleed). Listed for agents in /about.md and /llms.txt. The visual strip on
// the main page is off (SHOW_BRANDS); logos stay in public/brands for later.
export const SHOW_BRANDS = false;
export const BRANDS = [
  { name: 'Digital Software Market', file: 'digital-software-market' },
  { name: 'Kelvin Haus', file: 'kelvin-haus' },
  { name: 'Zuhd', file: 'zuhd' },
  { name: 'Bakery Hill Dental', file: 'bakery-hill-dental' },
  { name: 'Bank Muscat', file: 'bank-muscat' },
  { name: 'Dubai Islamic Bank', file: 'dubai-islamic-bank' },
  { name: 'UAE Ministry of Justice', file: 'uae-ministry-of-justice' },
  { name: 'Abu Dhabi Ports', file: 'abu-dhabi-ports' },
  { name: 'IBM', file: 'ibm' },
  { name: 'Saudi Tourism Authority', file: 'saudi-tourism-authority' },
  { name: 'Toshiba', file: 'toshiba' },
  { name: 'Al Rajhi Bank', file: 'al-rajhi-bank' },
];

// TODO(confirm): Enterprise is per workspace or per seat.
export const ENTERPRISE_PER = 'per workspace / month';
