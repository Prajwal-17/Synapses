export const integrations = [
  {
    integrationId: 1,
    appValue: "Gmail",
    appLabel: "Gmail",
    image: "/icons/gmail.svg",
    actions: [
      {
        eventId: 1,
        eventValue: "Listen-email",
        eventLabel: "Listen Email",
        type: "trigger",
        description: "Triggers to new emails",
      },
      {
        eventId: 2,
        eventValue: "Send-email",
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
        eventValue: "Commit",
        eventLabel: "Commit",
        type: "action",
        description: "some desc",
      },
      {
        eventId: 2,
        eventValue: "Pull-request",
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