import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "worker",
  brokers: ["localhost:9092"]
});

const consumer = kafka.consumer({ groupId: "task-consumer" });

async function main() {
  try {

    await consumer.connect();
    await consumer.subscribe({
      topic: "tasks",
      fromBeginning: true,
    })

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          topic,
          offset: message.offset,
          partition: partition,
          key: message.key?.toString(),
          message: message.value?.toString(),
        })
      }
    })

  } catch (error) {
    console.log("Something went wrong in worker", error)
  }
}

main()