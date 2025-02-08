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
      id: "e7770b71-eec8-4c60-929f-573d35908a56",
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
  };

  const workflow = await prisma.workflow.create({
    data: {
      id: "93959914-f676-428c-88b3-de7befc39798",
      userId: "e7770b71-eec8-4c60-929f-573d35908a56",
      totalActionSteps: 1,
    },
  });

  const trigger = await prisma.trigger.create({
    data: {
      workflowId: workflow.id,
      connectionId: "",
      appType: "email",
      eventType: "LISTEN-EMAIL",
      config: {},
    },
  });

  await prisma.workflow.update({
    where: { id: workflow.id },
    data: { triggerId: trigger.id },
  });

  await prisma.action.create({
    data: {
      workflowId: workflow.id,
      appType: "email",
      eventType: "send_email",
      stepNo: 1,
      config: {
        cc: "asdfasdf",
        to: "asfasdf",
        body: "asdfasdfasdf",
        from: "asdfasdf",
        subject: "asdfasdfasd",
      },
    },
  });

  console.log('✅ Database seeded successfully!');
}