export const integrations = [
  {
    integrationId: 1,
    appValue: "Gmail",
    appLabel: "Gmail",
    image: "/icons/gmail.svg",
    trigger: [
      {
        eventId: 1,
        eventValue: "LISTEN_EMAIL",
        eventLabel: "Listen Emails",
        type: "trigger",
        description: "Triggers to new emails",
      },
    ],
    actions: [
      {
        eventId: 1,
        eventValue: "SEND_EMAIL",
        eventLabel: "Send Email",
        type: "action",
        description: "Create and send an email",
      },
      {
        eventId: 2,
        eventValue: "DRAFT_EMAIL",
        eventLabel: "Draft Email",
        type: "action",
        description: "Create a draft email",
      }
    ]
  },
  {
    integrationId: 2,
    appValue: "Github",
    appLabel: "Github",
    image: "/icons/github.svg",
    trigger: [
      {
        eventId: 1,
        eventValue: "COMMIT",
        eventLabel: "Commit",
        type: "trigger",
        description: "some desc",
      }
    ],
    actions: [
      {
        eventId: 1,
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
    trigger: [
      {
        eventId: 1,
        eventValue: "random",
        eventLabel: "random",
        type: "trigger",
        description: "",
      },
    ],
    actions: [
      {
        eventId: 1,
        eventValue: "random",
        eventLabel: "random",
        type: "trigger",
        description: "",
      }
    ]
  }
]