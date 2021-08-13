import {Objective} from "./objectives";

export interface Space {
  id: string;
  name: string;
  memberIds: Record<string, boolean>;
  adminIds: Record<string, boolean>;
  discussionIds?: string[];
  objectives?: Record<string, Objective>;
  logo?: string;
  ownerId: string;
}
