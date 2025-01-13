// export const CategoriesList=[
//     {
//         id:1,
//         name:'Έπιπλα',
//         icon:'src/assets/chest-of-drawers.png'
//     },
//     {
//         id:2,
//         name:'Ζωγραφική & Τέχνη',
//         icon:'src/assets/starry-night.png'

//     },
//     {
//         id:3,
//         name:'Μικροαντικείμενα & Διακοσμητικά',
//         icon:'src/assets/lamp-decor.png'

//     },
//     {
//         id:4,
//         name:'Κοσμήματα & Ρολόγια',
//         icon:'src/assets/necklace.png'

//     },
//     {
//         id:5,
//         name:'Μεταλλικά Αντικείμενα',
//         icon:'src/assets/camera-crane.png'

//     },
//     {
//         id:6,
//         name:'Αντίκες από Κεραμικά & Γυαλί',
//         icon:'src/assets/mirror.png'

//     },
//     {
//         id:7,
//         name:'Χειροποίητες Αντίκες',
//         icon:'src/assets/handcraft.png'

//     },
//     {
//         id:8,
//         name:'Συλλογές & Μνημεία',
//         icon:'src/assets/statue.png'

//     },
//     {
//         id:9,
//         name:'Αντίκες Ρούχων & Υφασμάτων',
//         icon:'src/assets/wardrobe.png'

//     },
//     {
//         id:10,
//         name:'Αναμνηστικά & Σπάνια Αντικείμενα',
//         icon:'src/assets/crystal.png'

//     },
//     {
//         id:11,
//         name:'Αντίκες Οικιακών Σκευών',
//         icon:'src/assets/household-appliance.png'

//     },
//     {
//         id:12,
//         name:'Βιβλία & Χάρτες',
//         icon:'src/assets/open-book.png'

//     },
//     {
//         id:13,
//         name:'Αρχαιολογικά Αντικείμενα',
//         icon:'src/assets/vase.png'

//     },
//     {
//         id:14,
//         name:'Αντίκες Σαπούνι & Κεριά',
//         icon:'src/assets/candle.png'

//     },
// ]
import chestOfDrawers from '../assets/chest-of-drawers.png';
import starryNight from '../assets/starry-night.png';
import lampDecor from '../assets/lamp-decor.png';
import necklace from '../assets/necklace.png';
import cameraCrane from '../assets/camera-crane.png';
import mirror from '../assets/mirror.png';
import handcraft from '../assets/handcraft.png';
import statue from '../assets/statue.png';
import wardrobe from '../assets/wardrobe.png';
import crystal from '../assets/crystal.png';
import householdAppliance from '../assets/household-appliance.png';
import openBook from '../assets/open-book.png';
import vase from '../assets/vase.png';
import candle from '../assets/candle.png';

// Import other icons similarly...

export const CategoriesList = [
  { id: 1, name: 'Έπιπλα', icon: chestOfDrawers },
  { id: 2, name: 'Ζωγραφική & Τέχνη', icon: starryNight },
  { id: 3, name: 'Μικροαντικείμενα & Διακοσμητικά', icon: lampDecor },
  { id: 4, name: 'Κοσμήματα & Ρολόγια', icon: necklace },
  { id: 5, name: 'Μεταλλικά Αντικείμενα', icon: cameraCrane },
  { id: 6, name: 'Αντίκες από Κεραμικά & Γυαλί', icon: mirror },
  { id: 7, name: 'Χειροποίητες Αντίκες', icon: handcraft },
  { id: 8, name: 'Συλλογές & Μνημεία', icon: statue },
  { id: 9, name: 'Αντίκες Ρούχων & Υφασμάτων', icon: wardrobe },
  { id: 10, name: 'Αναμνηστικά & Σπάνια Αντικείμενα', icon: crystal },
  { id: 11, name: 'Αντίκες Οικιακών Σκευών', icon: householdAppliance },
  { id: 12, name: 'Βιβλία & Χάρτες', icon: openBook },
  { id: 13, name: 'Αρχαιολογικά Αντικείμενα', icon: vase },
  { id: 14, name: 'Αντίκες Σαπούνι & Κεριά', icon: candle },
];



export const PriceSell = [
    {
        id: 1,
        price: '0-50€'
    },
    {
        id: 2, 
        price: '51-100€'
    },
    {
        id: 3, 
        price: '101-200€'
    },
    {
        id: 4, 
        price: '201-500€'
    },
    {
        id: 5, 
        price: '501-1000€'
    },
    {
        id: 6, 
        price: '1001-3000€'
    },
    {
        id: 7, 
        price: '3001-5000€'
    },
    {
        id: 8, 
        price: '5001-10000€'
    },
    {
        id: 9, 
        price: '10001-20000€'
    },
    {
        id: 10, 
        price: '20001-100000€'
    },
];

export const PriceRent = [
    {
        id: 1,
        price: '1-5€/Μέρα'
    },
    {
        id: 2, 
        price: '5-10€/Μέρα'
    },
    {
        id: 3, 
        price: '10-20€/Μέρα'
    },
    {
        id: 4, 
        price: '20-50€/Μέρα'
    },
    {
        id: 5, 
        price: '50€+/Μέρα'
    },
];

export const addressList = [
    {
      id: 1,
      name: 'Αργολίδα',
    },
    {
      id: 2,
      name: 'Αρκαδία',
    },
    {
      id: 3,
      name: 'Αττική',
    },
    {
      id: 4,
      name: 'Αχαΐα',
    },
    {
      id: 5,
      name: 'Βοιωτία',
    },
    {
      id: 6,
      name: 'Βόρειος Τομέας Αθηνών',
    },
    {
      id: 7,
      name: 'Γρεβενά',
    },
    {
      id: 8,
      name: 'Δράμα',
    },
    {
      id: 9,
      name: 'Έβρος',
    },
    {
      id: 10,
      name: 'Εύβοια',
    },
    {
      id: 11,
      name: 'Ζάκυνθος',
    },
    {
      id: 12,
      name: 'Ηλεία',
    },
    {
      id: 13,
      name: 'Ημαθία',
    },
    {
      id: 14,
      name: 'Ηράκλειο',
    },
    {
      id: 15,
      name: 'Θάσος',
    },
    {
      id: 16,
      name: 'Θεσσαλονίκη',
    },
    {
      id: 17,
      name: 'Ιωάννινα',
    },
    {
      id: 18,
      name: 'Καβάλα',
    },
    {
      id: 19,
      name: 'Καρδίτσα',
    },
    {
      id: 20,
      name: 'Καστοριά',
    },
    {
      id: 21,
      name: 'Κέρκυρα',
    },
    {
      id: 22,
      name: 'Κιλκίς',
    },
    {
      id: 23,
      name: 'Κοζάνη',
    },
    {
      id: 24,
      name: 'Κορίνθια',
    },
    {
      id: 25,
      name: 'Λακωνία',
    },
    {
      id: 26,
      name: 'Λάρισα',
    },
    {
      id: 27,
      name: 'Λασίθι',
    },
    {
      id: 28,
      name: 'Λέσβος',
    },
    {
      id: 29,
      name: 'Μαγνησία',
    },
    {
      id: 30,
      name: 'Μεσσηνία',
    },
    {
      id: 31,
      name: 'Μήλος',
    },
    {
      id: 32,
      name: 'Μυτιλήνη',
    },
    {
      id: 33,
      name: 'Νάξος',
    },
    {
      id: 34,
      name: 'Νήσος Σάμος',
    },
    {
      id: 35,
      name: 'Νομός Αιτωλοακαρνανίας',
    },
    {
      id: 36,
      name: 'Νότιο Αιγαίο',
    },
    {
      id: 37,
      name: 'Ξάνθη',
    },
    {
      id: 38,
      name: 'Πέλλα',
    },
    {
      id: 39,
      name: 'Πειραιάς',
    },
    {
      id: 40,
      name: 'Πιερία',
    },
    {
      id: 41,
      name: 'Πρέβεζα',
    },
    {
      id: 42,
      name: 'Ρέθυμνο',
    },
    {
      id: 43,
      name: 'Ροδόπη',
    },
    {
      id: 44,
      name: 'Σάμος',
    },
    {
      id: 45,
      name: 'Σέρρες',
    },
    {
      id: 46,
      name: 'Σποράδες',
    },
    {
      id: 47,
      name: 'Τρίκαλα',
    },
    {
      id: 48,
      name: 'Φθιώτιδα',
    },
    {
      id: 49,
      name: 'Φλώρινα',
    },
    {
      id: 50,
      name: 'Χαλκιδική',
    },
    {
      id: 51,
      name: 'Χανιά',
    },
    {
      id: 52,
      name: 'Χίος',
    }
];
  
