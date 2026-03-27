/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const districts = [
  // Dhaka Division
  { name: 'Dhaka', latitude: 23.8103, longitude: 90.4125 },
  { name: 'Gazipur', latitude: 24.0023, longitude: 90.4264 },
  { name: 'Narayanganj', latitude: 23.6238, longitude: 90.5000 },
  { name: 'Tangail', latitude: 24.2513, longitude: 89.9167 },
  { name: 'Faridpur', latitude: 23.6071, longitude: 89.8429 },
  { name: 'Manikganj', latitude: 23.8644, longitude: 90.0047 },
  { name: 'Munshiganj', latitude: 23.5422, longitude: 90.5353 },
  { name: 'Rajbari', latitude: 23.7574, longitude: 89.6444 },
  { name: 'Madaripur', latitude: 23.1641, longitude: 90.1896 },
  { name: 'Gopalganj', latitude: 23.0050, longitude: 89.8267 },
  { name: 'Shariatpur', latitude: 23.2423, longitude: 90.4348 },
  { name: 'Narsingdi', latitude: 23.9230, longitude: 90.7181 },
  { name: 'Kishoreganj', latitude: 24.4449, longitude: 90.7766 },

  // Chattogram Division
  { name: 'Chattogram', latitude: 22.3569, longitude: 91.7832 },
  { name: "Cox's Bazar", latitude: 21.4272, longitude: 92.0058 },
  { name: 'Cumilla', latitude: 23.4607, longitude: 91.1809 },
  { name: 'Feni', latitude: 23.0159, longitude: 91.3976 },
  { name: 'Brahmanbaria', latitude: 23.9571, longitude: 91.1119 },
  { name: 'Noakhali', latitude: 22.8696, longitude: 91.0994 },
  { name: 'Lakshmipur', latitude: 22.9425, longitude: 90.8417 },
  { name: 'Chandpur', latitude: 23.2333, longitude: 90.6500 },
  { name: 'Rangamati', latitude: 22.6533, longitude: 92.1750 },
  { name: 'Khagrachhari', latitude: 23.1192, longitude: 91.9847 },
  { name: 'Bandarban', latitude: 22.1953, longitude: 92.2184 },

  // Rajshahi Division
  { name: 'Rajshahi', latitude: 24.3745, longitude: 88.6042 },
  { name: 'Bogra', latitude: 24.8481, longitude: 89.3730 },
  { name: 'Pabna', latitude: 24.0063, longitude: 89.2493 },
  { name: 'Sirajganj', latitude: 24.4534, longitude: 89.7077 },
  { name: 'Naogaon', latitude: 24.8054, longitude: 88.9479 },
  { name: 'Natore', latitude: 24.4102, longitude: 88.9595 },
  { name: 'Chapai Nawabganj', latitude: 24.5965, longitude: 88.2710 },
  { name: 'Joypurhat', latitude: 25.0947, longitude: 89.0209 },

  // Khulna Division
  { name: 'Khulna', latitude: 22.8456, longitude: 89.5403 },
  { name: 'Jessore', latitude: 23.1664, longitude: 89.2137 },
  { name: 'Satkhira', latitude: 22.7185, longitude: 89.0705 },
  { name: 'Bagerhat', latitude: 22.6516, longitude: 89.7859 },
  { name: 'Kushtia', latitude: 23.9013, longitude: 89.1204 },
  { name: 'Magura', latitude: 23.4873, longitude: 89.4199 },
  { name: 'Meherpur', latitude: 23.7622, longitude: 88.6318 },
  { name: 'Narail', latitude: 23.1725, longitude: 89.5126 },
  { name: 'Chuadanga', latitude: 23.6401, longitude: 88.8418 },
  { name: 'Jhenaidah', latitude: 23.5450, longitude: 89.1726 },

  // Sylhet Division
  { name: 'Sylhet', latitude: 24.8949, longitude: 91.8687 },
  { name: 'Moulvibazar', latitude: 24.4829, longitude: 91.7705 },
  { name: 'Habiganj', latitude: 24.3749, longitude: 91.4124 },
  { name: 'Sunamganj', latitude: 25.0658, longitude: 91.3958 },

  // Barisal Division
  { name: 'Barisal', latitude: 22.7010, longitude: 90.3535 },
  { name: 'Bhola', latitude: 22.6859, longitude: 90.6417 },
  { name: 'Patuakhali', latitude: 22.3596, longitude: 90.3297 },
  { name: 'Pirojpur', latitude: 22.5841, longitude: 89.9720 },
  { name: 'Jhalokati', latitude: 22.6422, longitude: 90.2003 },
  { name: 'Barguna', latitude: 22.1504, longitude: 90.1221 },

  // Rangpur Division
  { name: 'Rangpur', latitude: 25.7439, longitude: 89.2752 },
  { name: 'Dinajpur', latitude: 25.6217, longitude: 88.6354 },
  { name: 'Kurigram', latitude: 25.8054, longitude: 89.6361 },
  { name: 'Gaibandha', latitude: 25.3287, longitude: 89.5280 },
  { name: 'Lalmonirhat', latitude: 25.9126, longitude: 89.4426 },
  { name: 'Nilphamari', latitude: 25.9317, longitude: 88.8560 },
  { name: 'Panchagarh', latitude: 26.3411, longitude: 88.5541 },
  { name: 'Thakurgaon', latitude: 26.0337, longitude: 88.4617 },

  // Mymensingh Division
  { name: 'Mymensingh', latitude: 24.7471, longitude: 90.4203 },
  { name: 'Jamalpur', latitude: 24.9197, longitude: 89.9454 },
  { name: 'Netrokona', latitude: 24.8705, longitude: 90.7273 },
  { name: 'Sherpur', latitude: 25.0188, longitude: 90.0175 },
];

async function main() {
  
  console.log('🚀 Syncing Districts...');

  for (const d of districts) {
    await prisma.districts.upsert({
      where: { name: d.name },
      update: { 
        latitude: d.latitude, 
        longitude: d.longitude 
      },
      create: {
        name: d.name,
        latitude: d.latitude,
        longitude: d.longitude,
      },
    });
  }

  
  console.log('✅ 64 Districts Seeded.');

// async function main() {
//   console.log('🚀 Starting Raw SQL seed...');

//   for (const d of districts) {
//     try {
//       // Direct SQL injection-safe bypass
//       await prisma.$executeRawUnsafe(
//         `INSERT INTO districts (name, latitude, longitude) 
//          VALUES ($1, $2, $3) 
//          ON CONFLICT (name) DO UPDATE 
//          SET latitude = $2, longitude = $3`,
//         d.name, d.latitude, d.longitude
//       );
//     } catch (error) {
//       console.error(`Error seeding ${d.name}:`, error);
//     }
//   }

//   console.log('✅ 64 Districts Seeded via Raw SQL.');
// }

}
main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });