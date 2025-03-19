const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function main() {
  console.log("....Seeding Database");

  // Create a test user
  const testUserId = "e7770b71-eec8-4c60-929f-573d35908a56";
  await prisma.user.create({
    data: {
      id: testUserId,
      name: "testUser",
      email: "prajwalk1702@gmail.com",
      password: "$2a$10$IWXZ5tRGAb/Vg3zToP8hWuAqOz0dG5VYzQfccBiNbhzNPbJeCMxKC",
    },
  });

  // Create 5 random users
  for (let i = 0; i < 5; i++) {
    await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });
  }

  // Create a workflow for the test user
  const workflow = await prisma.workflow.create({
    data: {
      id: "93959914-f676-428c-88b3-de7befc39798",
      userId: testUserId,
      totalActionSteps: 1,
    },
  });

  // Create a trigger for the workflow
  await prisma.trigger.create({
    data: {
      workflowId: workflow.id,
      // connectionId: "random",
      appType: "Gmail",
      eventType: "LISTEN_EMAIL",
      type: "trigger",
      stepNo: 0,
      payload: {
        cc: faker.internet.email(),
        to: faker.internet.email(),
        body: faker.lorem.paragraph(),
        from: faker.internet.email(),
        subject: faker.lorem.sentence(),
      },
    },
  });

  // Create an action for the workflow
  await prisma.action.create({
    data: {
      workflowId: workflow.id,
      appType: "Gmail",
      // connectionId: "random",
      eventType: "SEND_EMAIL",
      type: "action",
      stepNo: 1,
      payload: {
        cc: faker.internet.email(),
        to: faker.internet.email(),
        body: faker.lorem.paragraph(),
        from: faker.internet.email(),
        subject: faker.lorem.sentence(),
      },
    },
  });

  console.log("✅ Database seeded successfully!");
}

// Execute the seeding function
main()
  .catch((e) => {
    console.error("Error seeding database:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
