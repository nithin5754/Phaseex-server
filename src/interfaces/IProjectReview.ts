interface User {
  id: string;
  name: string;
  email?: string;
}
export interface ProjectReviewer {
  reviewer: {
    id: string;
    name: string;
    email: string;
  };
  avatar?: string;
  approvalStatus: "Approved" | "Rejected" | "Pending";
  reviewedAt?: string | Date;
  suggestion?: string;
}
export interface Reply {
  id: string;
  commentId: string;
  author: User;
  content: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  commentId: string;
  author: User;
  content: string;
  createdAt: string;
  replies: Reply[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Dependency {
  id: string;
  title: string;
  description: String;
  link: string;
}

export interface IFeatureProjectReview {
  id: string;
  title: string;
  description: string;
  attempt: number;
  status: "Approved" | "Rejected" | "Pending" | "Completed";
  featureCreatedAt: string;
  workspaceId: string;
  listId: string;
  folderId: string;
  featureDueDate: string;
  assignee: User;
  reviewers: User[];
  reviewerLogs: ProjectReviewer[];
  comments: Comment[];
  approved: boolean;
  message:string[];

  dependencies: Dependency[];
  attachments: Attachment[];
}
