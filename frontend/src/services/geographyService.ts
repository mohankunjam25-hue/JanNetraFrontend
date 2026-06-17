export interface StateData {
  id: string;
  name: string;
}

export interface DistrictData {
  id: string;
  stateId: string;
  name: string;
}

export interface BlockData {
  id: string;
  districtId: string;
  name: string;
}

export const GeographyService = {
  // In a real 5B user app, these would be paginated API calls
  getStates: async (): Promise<StateData[]> => {
    return [
      { id: 'st1', name: 'Madhya Pradesh' },
      { id: 'st2', name: 'Jharkhand' },
      { id: 'st3', name: 'Uttar Pradesh' },
      { id: 'st4', name: 'Maharashtra' },
      { id: 'st5', name: 'Bihar' },
    ];
  },

  getDistricts: async (stateId: string): Promise<DistrictData[]> => {
    // Mock logic based on state selection
    const data: Record<string, DistrictData[]> = {
      'st1': [{ id: 'd1', stateId: 'st1', name: 'Bhopal' }, { id: 'd2', stateId: 'st1', name: 'Indore' }],
      'st2': [{ id: 'd3', stateId: 'st2', name: 'Ranchi' }, { id: 'd4', stateId: 'st2', name: 'Jamshedpur' }],
    };
    return data[stateId] || [];
  },

  getBlocks: async (districtId: string): Promise<BlockData[]> => {
    const data: Record<string, BlockData[]> = {
      'd1': [{ id: 'b1', districtId: 'd1', name: 'Bhopal North' }, { id: 'b2', districtId: 'd1', name: 'Bhopal South' }],
      'd3': [{ id: 'b3', districtId: 'd3', name: 'Kanke' }, { id: 'b4', districtId: 'd3', name: 'Namkum' }],
    };
    return data[districtId] || [];
  }
};