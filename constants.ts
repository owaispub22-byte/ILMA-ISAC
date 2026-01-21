import { Position, Voter } from './types';

// Admin Credentials
export const ADMIN_PASSWORD = 'admin123';

// Demo Data
export const DEMO_VOTERS: Voter[] = [
  { id: 'VOTER101', name: 'Alice Johnson' },
  { id: 'VOTER102', name: 'Bob Smith' },
  { id: 'VOTER103', name: 'Charlie Brown' },
  { id: 'VOTER104', name: 'Diana Prince' },
  { id: 'VOTER105', name: 'Evan Wright' },
  { id: 'STUDENT001', name: 'Fatima Ali' },
  { id: 'STUDENT002', name: 'Gavin Belson' },
  { id: 'STUDENT003', name: 'Hannah Montana' },
  { id: 'TEST01', name: 'Test User One' },
  { id: 'TEST02', name: 'Test User Two' }
];

// Helper to generate image URL. 
const getImg = (name: string) => {
  const slug = name.toLowerCase().replace(/ /g, '-');
  return `https://picsum.photos/seed/${slug}/400/400`;
};

export const POSITIONS: Position[] = [
  {
    id: 'president',
    title: 'President',
    candidates: [
      { id: 'pres_1', name: 'Naeem Ahmed', image: getImg('Naeem Ahmed') },
      { id: 'pres_2', name: 'Muhammad Shaban', image: getImg('Muhammad Shaban') },
      { id: 'pres_3', name: 'Syed Muhammad Abbas Rizvi', image: getImg('Syed Muhammad Abbas Rizvi') },
      { id: 'pres_4', name: 'Safa Muhammad Aslam', image: getImg('Safa Muhammad Aslam') },
      { id: 'pres_5', name: 'Anas Shakeel', image: getImg('Anas Shakeel') },
      { id: 'pres_6', name: 'Ifrah Azhar', image: getImg('Ifrah Azhar') },
      { id: 'pres_7', name: 'Areeba Waseem', image: getImg('Areeba Waseem') },
    ]
  },
  {
    id: 'vice_president',
    title: 'Vice President',
    candidates: [
      { id: 'vp_1', name: 'Ifrah Azhar', image: getImg('Ifrah Azhar') },
      { id: 'vp_2', name: 'Muhammad Shaban', image: getImg('Muhammad Shaban') },
      { id: 'vp_3', name: 'Muhammad Hamza', image: getImg('Muhammad Hamza') },
      { id: 'vp_4', name: 'Anas Masood Ahmed', image: getImg('Anas Masood Ahmed') },
      { id: 'vp_5', name: 'Humna Khan', image: getImg('Humna Khan') },
      { id: 'vp_6', name: 'Asad Ali', image: getImg('Asad Ali') },
      { id: 'vp_7', name: 'Muhammad Shazar Shamim', image: getImg('Muhammad Shazar Shamim') },
    ]
  },
  {
    id: 'director_morning',
    title: 'Director (Morning)',
    candidates: [
      { id: 'dm_1', name: 'Moid Mohsin', image: getImg('Moid Mohsin') },
      { id: 'dm_2', name: 'Hafsa Iqbal', image: getImg('Hafsa Iqbal') },
      { id: 'dm_3', name: 'Mairah Ahmed', image: getImg('Mairah Ahmed') },
      { id: 'dm_4', name: 'Muhammad Usman', image: getImg('Muhammad Usman') },
      { id: 'dm_5', name: 'Syed Akbar Ali', image: getImg('Syed Akbar Ali') },
      { id: 'dm_6', name: 'Muhammad Hasnain', image: getImg('Muhammad Hasnain') },
      { id: 'dm_7', name: 'Irtaza Hussain', image: getImg('Irtaza Hussain') },
    ]
  },
  {
    id: 'director_evening',
    title: 'Director (Evening)',
    candidates: [
      { id: 'de_1', name: 'Umar Naveed', image: getImg('Umar Naveed') },
      { id: 'de_2', name: 'Muhammad Hamza', image: getImg('Muhammad Hamza') },
      { id: 'de_3', name: 'Muhammad Afnan Naseer', image: getImg('Muhammad Afnan Naseer') },
    ]
  },
  {
    id: 'director_weekend',
    title: 'Director (Weekend)',
    candidates: [
      { id: 'dw_1', name: 'Kubbab Siddiqui', image: getImg('Kubbab Siddiqui') },
      { id: 'dw_2', name: 'Masafa Sharif', image: getImg('Masafa Sharif') },
      { id: 'dw_3', name: 'Taseen Azhar', image: getImg('Taseen Azhar') },
    ]
  },
  {
    id: 'gs_morning',
    title: 'General Secretary (Morning)',
    candidates: [
      { id: 'gsm_1', name: 'Roop Fatima', image: getImg('Roop Fatima') },
      { id: 'gsm_2', name: 'Muhammad Usman', image: getImg('Muhammad Usman') },
      { id: 'gsm_3', name: 'Musfira Khan', image: getImg('Musfira Khan') },
    ]
  },
  {
    id: 'gs_evening',
    title: 'General Secretary (Evening)',
    candidates: [
      { id: 'gse_1', name: 'Farzaan Iqbal', image: getImg('Farzaan Iqbal') },
      { id: 'gse_2', name: 'Irtaza Masood', image: getImg('Irtaza Masood') },
    ]
  },
  {
    id: 'gs_weekend',
    title: 'General Secretary (Weekend)',
    candidates: [
      { id: 'gsw_1', name: 'Kainat Akhter', image: getImg('Kainat Akhter') },
      { id: 'gsw_2', name: 'Saad Ullah Khan', image: getImg('Saad Ullah Khan') },
    ]
  },
];
