import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌍 Seeding Safari database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@safari.co.ke' },
    update: {},
    create: {
      name: 'Safari Admin',
      email: 'admin@safari.co.ke',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create sample user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      name: 'Jane Wanjiku',
      email: 'jane@example.com',
      password: userPassword,
      role: 'USER',
    },
  });

  console.log(`✅ Created users: ${admin.email}, ${user.email}`);

  // Seed destinations
  const destinations = [
    {
      name: 'Maasai Mara National Reserve',
      description:
        'Experience the world-famous Great Migration in one of Africa\'s most iconic wildlife reserves. Watch millions of wildebeest, zebras, and gazelles cross the Mara River in a breathtaking spectacle of nature.',
      location: 'Narok County, Kenya',
      imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
      price: 350,
      category: 'SAFARI' as const,
      rating: 4.9,
      reviewCount: 1240,
      featured: true,
    },
    {
      name: 'Amboseli National Park',
      description:
        'Marvel at the snow-capped peak of Mount Kilimanjaro while watching large elephant herds roam freely across the vast savannah. Amboseli offers some of Africa\'s best wildlife photography opportunities.',
      location: 'Kajiado County, Kenya',
      imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800',
      price: 280,
      category: 'WILDLIFE' as const,
      rating: 4.8,
      reviewCount: 980,
      featured: true,
    },
    {
      name: 'Diani Beach',
      description:
        'Relax on pristine white sandy beaches along the Indian Ocean coast. Diani Beach is consistently ranked among Africa\'s best beaches, offering crystal-clear waters, coral reefs, and luxury resorts.',
      location: 'Kwale County, Kenya',
      imageUrl: 'https://images.unsplash.com/photo-1589179447183-fec4de55db86?w=800',
      price: 200,
      category: 'BEACH' as const,
      rating: 4.7,
      reviewCount: 750,
      featured: true,
    },
    {
      name: 'Mount Kenya National Park',
      description:
        'Challenge yourself with a trek to Point Lenana on Africa\'s second-highest mountain. The park features diverse ecosystems from bamboo forests to glaciers, with incredible views and unique flora.',
      location: 'Central Kenya',
      imageUrl: 'https://images.unsplash.com/photo-1534166104723-0a4ae37f60a4?w=800',
      price: 320,
      category: 'MOUNTAIN' as const,
      rating: 4.6,
      reviewCount: 620,
      featured: false,
    },
    {
      name: 'Lamu Old Town',
      description:
        'Step back in time in this UNESCO World Heritage Site. Lamu is the oldest and best-preserved Swahili settlement in East Africa, offering donkey rides through narrow streets, traditional dhow sailing, and rich cultural heritage.',
      location: 'Lamu County, Kenya',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      price: 180,
      category: 'CULTURAL' as const,
      rating: 4.7,
      reviewCount: 530,
      featured: true,
    },
    {
      name: 'Tsavo National Park',
      description:
        'Explore Kenya\'s largest national park, split into Tsavo East and West. Home to the famous "man-eating lions," red elephants, and the spectacular Mzima Springs, Tsavo offers a truly wild African experience.',
      location: 'Coast and Eastern Provinces, Kenya',
      imageUrl: 'https://images.unsplash.com/photo-1504173010664-32509107de4f?w=800',
      price: 260,
      category: 'SAFARI' as const,
      rating: 4.5,
      reviewCount: 840,
      featured: false,
    },
    {
      name: 'Samburu National Reserve',
      description:
        'Discover unique species found only north of the equator: the reticulated giraffe, Grevy\'s zebra, Beisa oryx, and Somali ostrich. The Ewaso Ng\'iro River provides a stunning backdrop for game drives.',
      location: 'Samburu County, Kenya',
      imageUrl: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800',
      price: 290,
      category: 'WILDLIFE' as const,
      rating: 4.6,
      reviewCount: 410,
      featured: false,
    },
    {
      name: 'Hell\'s Gate National Park',
      description:
        'The inspiration for The Lion King! Cycle through dramatic gorges, towering cliffs, and geothermal activity. Hell\'s Gate allows walking and cycling, making it unique among Kenya\'s parks.',
      location: 'Nakuru County, Kenya',
      imageUrl: 'https://images.unsplash.com/photo-1612208695882-02f2322b7fee?w=800',
      price: 120,
      category: 'ADVENTURE' as const,
      rating: 4.5,
      reviewCount: 680,
      featured: false,
    },
    {
      name: 'Lake Nakuru National Park',
      description:
        'Famous for its spectacular flamingo congregations that paint the lake shores pink. Also home to white and black rhinos, leopards, and lions in a beautiful landscape of acacia woodlands.',
      location: 'Nakuru County, Kenya',
      imageUrl: 'https://images.unsplash.com/photo-1614629038699-0b01be0b1a6c?w=800',
      price: 220,
      category: 'WILDLIFE' as const,
      rating: 4.4,
      reviewCount: 590,
      featured: false,
    },
    {
      name: 'Watamu Marine National Park',
      description:
        'Snorkel and dive in one of Kenya\'s most beautiful marine reserves. Encounter sea turtles, dolphins, whale sharks, and vibrant coral gardens in the crystal-clear waters of the Indian Ocean.',
      location: 'Kilifi County, Kenya',
      imageUrl: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800',
      price: 160,
      category: 'ADVENTURE' as const,
      rating: 4.6,
      reviewCount: 320,
      featured: false,
    },
  ];

  for (const dest of destinations) {
    await prisma.destination.upsert({
      where: { id: dest.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() },
      update: dest,
      create: {
        id: dest.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase(),
        ...dest,
      },
    });
  }

  console.log(`✅ Created ${destinations.length} destinations`);
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
