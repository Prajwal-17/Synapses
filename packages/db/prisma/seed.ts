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

  await prisma.user.create({
    data: {
      name: "testUser",
      email: "prajwalk1702@gmail.com",
      password: "$2a$10$7I8yzWFc/QBQ2xmSzkBbeesfzVISm1D4rYOHYxhZ0KreQjU3cn59K",
    }
  })

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