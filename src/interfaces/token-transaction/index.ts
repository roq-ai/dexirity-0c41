import { OrganizationInterface } from 'interfaces/organization';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface TokenTransactionInterface {
  id?: string;
  transaction_type: string;
  token_amount: number;
  organization_id?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  organization?: OrganizationInterface;
  user?: UserInterface;
  _count?: {};
}

export interface TokenTransactionGetQueryInterface extends GetQueryInterface {
  id?: string;
  transaction_type?: string;
  organization_id?: string;
  user_id?: string;
}
