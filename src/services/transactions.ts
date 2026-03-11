import { supabase } from '../lib/supabase';
import { Transaction, TransactionStage } from '../types';

export const transactionService = {
  async getTransactions(userId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, stages:transaction_stages(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getTransactionById(id: string): Promise<Transaction | null> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, stages:transaction_stages(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createTransaction(transaction: Partial<Transaction>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();

    if (error) throw error;

    // Create initial stages
    const stages: Partial<TransactionStage>[] = [
      { transaction_id: data.id, stage_name: 'Payment Initiated', status: 'completed', description: 'Money has been sent from the source' },
      { transaction_id: data.id, stage_name: 'Sending Bank Processing', status: 'current', description: 'Bank is verifying the transaction' },
      { transaction_id: data.id, stage_name: 'Interbank Transfer', status: 'upcoming', description: 'Transferring funds between banks' },
      { transaction_id: data.id, stage_name: 'Receiving Bank Processing', status: 'upcoming', description: 'Destination bank is clearing the funds' },
      { transaction_id: data.id, stage_name: 'Funds Delivered', status: 'upcoming', description: 'Recipient has received the money' },
    ];

    await supabase.from('transaction_stages').insert(stages);

    return data;
  },

  async updateStageStatus(stageId: string, status: 'completed' | 'current' | 'upcoming'): Promise<void> {
    const { error } = await supabase
      .from('transaction_stages')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', stageId);

    if (error) throw error;
  }
};
