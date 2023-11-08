export interface Bug {
  id: string;
  title: string;
  description: string;
  priority: number;
  reporter: string;
  status: string;
  created: string;
  comments: Comment[];
}
