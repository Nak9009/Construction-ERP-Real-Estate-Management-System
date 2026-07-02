export interface ConstructionTask {
  id: string | number;
  houseRef?: string;
  house_ref?: string;
  stage: string;
  completion: number;
  status: string;
  endDate?: string;
  end_date?: string;
}
