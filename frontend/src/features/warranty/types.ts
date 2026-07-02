export interface Claim {
  id: string | number;
  claimRef?: string;
  claim_ref?: string;
  customer: string;
  property: string;
  issue: string;
  date?: string;
  status: string;
}
