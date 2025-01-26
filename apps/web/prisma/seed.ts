const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker")

const prisma = new PrismaClient();

main()
  .catch((e) => {
    console.log(e)
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

async function main() {
  console.log("....Seeding Database");

  for (let i = 0; i < 5; i++) {
    await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      }
    })
  }

  console.log('✅ Database seeded successfully!');
}