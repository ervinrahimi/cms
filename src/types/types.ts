export interface Tag {
  name: string;
  slug: string;
  created_at: Date;
}

export interface Category {
  title: string;
  description: string;
  slug: string;
  created_at: Date;
}

export interface Like {
  post_ref: string;
  user_ref: string;
  created_at: Date;
}

export interface Comment {
  post_ref: string;
  user_ref: string;
  content: string;
  created_at: Date;
}
