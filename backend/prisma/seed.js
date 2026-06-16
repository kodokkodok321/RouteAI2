const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const seedAddresses = [
  {
    name: 'Monas',
    address: 'Monas, Jakarta Pusat',
    lat: -6.1754,
    lng: 106.8272,
  },
  {
    name: 'Bundaran HI',
    address: 'Bundaran HI, Jakarta Pusat',
    lat: -6.1944,
    lng: 106.8229,
  },
  {
    name: 'Kota Tua',
    address: 'Kota Tua, Jakarta Barat',
    lat: -6.1352,
    lng: 106.8133,
  },
  {
    name: 'Ancol',
    address: 'Ancol, Jakarta Utara',
    lat: -6.1256,
    lng: 106.84,
  },
  {
    name: 'Tanah Abang',
    address: 'Tanah Abang, Jakarta Pusat',
    lat: -6.1862,
    lng: 106.8136,
  },
]

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing addresses
  await prisma.address.deleteMany()
  console.log('  ✓ Cleared existing addresses')

  // Insert seed addresses
  const created = await prisma.address.createMany({
    data: seedAddresses,
    skipDuplicates: true,
  })
  console.log(`  ✓ Created ${created.count} addresses`)

  // Print summary
  const all = await prisma.address.findMany()
  console.log('\n📍 Seeded addresses:')
  all.forEach((a) => {
    console.log(`  - ${a.name} (${a.lat}, ${a.lng})`)
  })

  console.log('\n✅ Seed complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
