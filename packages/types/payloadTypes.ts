export type Gmail_Send_Mail_Type = {
  to: string,
  from: string,
  subject: string,
  body: string
};

export type Notion_Create_Page_Type = {
  pageId: string,
  title: string,
  content: string,
};

export type Notion_Add_Comment_Type = {
  pageId: string,
  comment: string
}