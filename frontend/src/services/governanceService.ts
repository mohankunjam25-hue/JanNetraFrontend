import type { Leader, Scheme, Post } from '../types';

// professional Mock Service to simulate API calls
export const GovernanceService = {
  getLeaders: async (state: string, district: string): Promise<Leader[]> => {
    console.log(`Fetching leaders for ${state}, ${district}`);
    // Simulate API Delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      { id: '1', name: 'Dr. Mohan Yadav', role: 'Chief Minister', level: 'state', verified: true },
      { id: '2', name: 'Alok Sharma', role: 'Member of Parliament', level: 'district', verified: true },
      { id: '3', name: 'Kaushalendra Singh', role: 'District Collector', level: 'district', verified: true },
    ];
  },

  getSchemes: async (level: string): Promise<Scheme[]> => {
    console.log(`Fetching schemes for ${level}`);
    return [
      { id: 's1', name: 'Ladli Behna Yojana', type: 'Financial', level: 'state', description: 'Support for women development.' },
      { id: 's2', name: 'PM-Kisan Nidhi', type: 'Agriculture', level: 'central', description: 'Financial support for farmers.' },
    ];
  },

  getCommunityPosts: async (): Promise<Post[]> => {
    return [
      { id: 'p1', authorId: 'u1', authorName: 'Active Citizen', content: 'Park maintenance is great!', timestamp: '3h ago', likes: 124, comments: 18 },
    ];
  }
};
