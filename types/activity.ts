export type ActivityAction = "created" | "updated" | "deleted";

export type Activity = {
  id: string;
  action: ActivityAction;
  userName: string;
  at: string;
};
