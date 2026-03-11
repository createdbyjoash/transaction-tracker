export interface Transaction {
  id: string;
  created_at: string;
  user_id: string;
  sender_name: string;
  recipient_name: string;
  amount: number;
  currency: string;
  sending_bank: string;
  receiving_bank: string;
  reference_number: string;
  date_sent: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  receipt_url?: string;
  stages?: TransactionStage[];
}

export interface TransactionStage {
  id: string;
  transaction_id: string;
  stage_name: string;
  status: 'completed' | 'current' | 'upcoming';
  description?: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
}
