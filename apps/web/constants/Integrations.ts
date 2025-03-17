export const integrations = [
  {
    integrationId: 1,
    appValue: "Gmail",
    appLabel: "Gmail",
    image: "/icons/gmail.svg",
    actions: [
      {
        eventId: 1,
        eventValue: "LISTEN_EMAIL",
        eventLabel: "Listen Emails",
        type: "trigger",
        description: "Triggers to new emails",
      },
      {
        eventId: 2,
        eventValue: "SEND_EMAIL",
        eventLabel: "Send Email",
        type: "trigger",
        description: "Create and send an email",
      }
    ]
  },
  {
    integrationId: 2,
    appValue: "Github",
    appLabel: "Github",
    image: "/icons/github.svg",
    actions: [
      {
        eventId: 1,
        eventValue: "COMMIT",
        eventLabel: "Commit",
        type: "action",
        description: "some desc",
      },
      {
        eventId: 2,
        eventValue: "PULL_REQUEST",
        eventLabel: "Pull request",
        type: "action",
        description: "random data pull requstt lsdkflsajdfsfd",
      }
    ]
  },
  {
    integrationId: 3,
    appValue: "Notion",
    appLabel: "Notion",
    image: "/icons/notion.svg",
    actions: [
      {
        eventId: 1,
        eventValue: "random",
        eventLabel: "random",
        type: "trigger",
        description: "",
      },
      {
        eventId: 2,
        eventValue: "random",
        eventLabel: "random",
        type: "trigger",
        description: "",
      }
    ]
  }
]