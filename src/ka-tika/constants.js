'use strict';

const WITA_OFFSET_MINUTES = 8 * 60;
const TICK_MS = 12 * 60 * 60 * 1000;

const ANCHOR = {
  year: 2025,
  month: 6,
  day: 25,
  hour: 18,
  minute: 0,
};

const NAMES = {
  sasih: [
    'Kasa', 'Karo', 'Katiga', 'Kapat', 'Kalima', 'Kanem',
    'Kapitu', 'Kawalu', 'Kasanga', 'Kedasa', 'Jyestha', 'Sadha',
  ],
  wuku: [
    'Sinta', 'Landep', 'Ukir', 'Kurantil', 'Tolu', 'Gumbreg', 'Wariga', 'Warigadian',
    'Julungwangi', 'Sungsang', 'Dungulan', 'Kuningan', 'Langkir', 'Medangsia', 'Pujut',
    'Pahang', 'Krulut', 'Merakih', 'Tambir', 'Medangkungan', 'Matal', 'Uye', 'Menail',
    'Prangbakat', 'Bala', 'Ugu', 'Wayang', 'Kelawu', 'Dukut', 'Watugunung',
  ],
  ekaWara: ['Luang'],
  dwiWara: ['Menga', 'Pepet'],
  triWaraCustom: ['Kajeng', 'Pasah', 'Beteng', 'Pasah'],
  caturWara: ['Sri', 'Laba', 'Jaya', 'Menala'],
  pancaWaraCustom: ['Paing', 'Pon', 'Wage', 'Kliwon', 'Umanis'],
  sadWara: ['Tungleh', 'Aryang', 'Urukung', 'Paniron', 'Was', 'Maulu'],
  saptaWara: ['Redite', 'Soma', 'Anggara', 'Buda', 'Wraspati', 'Sukra', 'Saniscara'],
  astaWara: ['Sri', 'Indra', 'Guru', 'Yama', 'Ludra', 'Brahma', 'Kala', 'Uma'],
  sangaWara: ['Dangu', 'Jangur', 'Gigis', 'Nohan', 'Ogan', 'Erangan', 'Urungan', 'Tulus', 'Dadi'],
  dasaWara: ['Pati', 'Suka', 'Duka', 'Sri', 'Manuh', 'Manusa', 'Raja', 'Dewa', 'Raksasa', 'Pandita'],
};

module.exports = {
  WITA_OFFSET_MINUTES,
  TICK_MS,
  ANCHOR,
  NAMES,
};
